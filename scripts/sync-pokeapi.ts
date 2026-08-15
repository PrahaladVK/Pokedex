// Pulls Gen 1-9 species/forms/evolution data from PokeAPI into packages/data.
// Safe to re-run: responses are cached under .cache/pokeapi, delete that
// folder to force a fresh pull.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  GenerationPackSchema,
  type AbilitySlot,
  type BaseStats,
  type EvolutionCondition,
  type EvolutionEdge,
  type Form,
  type GenerationId,
  type PokemonType,
  type Species,
} from "@pokedex/schema";
import { createLimiter, extractIdFromUrl, fetchJson } from "./lib/http";
import {
  GEN_NUMBER_TO_ID,
  VERSION_GROUP_SLUG_TO_ID,
  VERSION_TO_GROUP,
  classifyForm,
  cleanFlavorText,
  humanize,
  prettifyFormName,
} from "./lib/pokeapi-mapping";
import { DATA_DIR, readManifest, today, upsertPackEntry, writeManifest } from "./lib/manifest";

const API = "https://pokeapi.co/api/v2";
// Two separate pools: a species task awaits form fetches nested inside it,
// so sharing one limiter between them would deadlock (outer tasks hold every
// slot while waiting on inner tasks that can never get one).
const limit = createLimiter(10);
const formLimit = createLimiter(10);

interface SpeciesBuild extends Omit<Species, "evolutions"> {
  evolutions: EvolutionEdge[];
  evolutionChainId: number;
}

const speciesMap = new Map<string, SpeciesBuild>();
const formsMap = new Map<string, Form>();

function extractTypes(pokemon: any): PokemonType[] {
  return [...pokemon.types]
    .sort((a, b) => a.slot - b.slot)
    .map((t) => t.type.name as PokemonType);
}

function extractAbilities(pokemon: any): AbilitySlot[] {
  return pokemon.abilities.map((a: any) => ({
    name: a.ability.name,
    isHidden: a.is_hidden,
    slot: a.slot,
  }));
}

function extractStats(pokemon: any): BaseStats {
  const byName = new Map<string, number>(pokemon.stats.map((s: any) => [s.stat.name, s.base_stat]));
  return {
    hp: byName.get("hp") ?? 0,
    attack: byName.get("attack") ?? 0,
    defense: byName.get("defense") ?? 0,
    specialAttack: byName.get("special-attack") ?? 0,
    specialDefense: byName.get("special-defense") ?? 0,
    speed: byName.get("speed") ?? 0,
  };
}

function extractSprites(pokemon: any) {
  return {
    front: pokemon.sprites?.front_default ?? undefined,
    frontShiny: pokemon.sprites?.front_shiny ?? undefined,
    official: pokemon.sprites?.other?.["official-artwork"]?.front_default ?? undefined,
  };
}

async function processSpecies(name: string, genId: GenerationId): Promise<void> {
  if (speciesMap.has(name)) return;
  const species = await fetchJson<any>(`${API}/pokemon-species/${name}`);
  const speciesId = species.name as string;
  const displayName = species.names.find((n: any) => n.language.name === "en")?.name ?? speciesId;
  const genus = species.genera.find((g: any) => g.language.name === "en")?.genus;
  const evolvesFromSpeciesId = species.evolves_from_species?.name ?? undefined;
  const evolutionChainId = extractIdFromUrl(species.evolution_chain.url);

  const varieties = species.varieties as Array<{ is_default: boolean; pokemon: { name: string; url: string } }>;
  const formIds: string[] = [];
  let defaultFormId = "";
  let defaultTypes: PokemonType[] = [];
  let defaultStats: BaseStats = { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 };
  let defaultAbilities: AbilitySlot[] = [];
  let heightM: number | undefined;
  let weightKg: number | undefined;
  const extraAvailability = new Set<string>();

  await Promise.all(
    varieties.map((variety) =>
      formLimit(async () => {
        const pokemon = await fetchJson<any>(`${API}/pokemon/${variety.pokemon.name}`);
        const { category, regionalVariantKind } = classifyForm(variety.pokemon.name, variety.is_default);
        const types = extractTypes(pokemon);
        const stats = extractStats(pokemon);
        const abilities = extractAbilities(pokemon);

        // Non-default forms (megas, gmax, regional variants, ...) carry a
        // pokemon-form resource with the version-group that introduced them.
        let introducedIn: string | undefined;
        if (!variety.is_default && pokemon.forms?.[0]?.url) {
          const pokemonForm = await fetchJson<any>(pokemon.forms[0].url);
          const slug = pokemonForm.version_group?.name as string | undefined;
          introducedIn = slug ? VERSION_GROUP_SLUG_TO_ID[slug] : undefined;
          if (introducedIn) extraAvailability.add(introducedIn);
        }

        const form: Form = {
          id: variety.pokemon.name,
          speciesId,
          name: prettifyFormName(variety.pokemon.name, speciesId, displayName, category, regionalVariantKind),
          category,
          regionalVariantKind,
          types,
          abilities,
          baseStats: stats,
          introducedIn,
          isDefault: variety.is_default,
          sprites: extractSprites(pokemon),
        };
        formsMap.set(form.id, form);
        formIds.push(form.id);
        if (variety.is_default) {
          defaultFormId = form.id;
          defaultTypes = types;
          defaultStats = stats;
          defaultAbilities = abilities;
          heightM = pokemon.height ? pokemon.height / 10 : undefined;
          weightKg = pokemon.weight ? pokemon.weight / 10 : undefined;
        }
      }),
    ),
  );

  if (!defaultFormId && formIds.length > 0) {
    defaultFormId = formIds[0]!;
    const fallback = formsMap.get(defaultFormId)!;
    defaultTypes = fallback.types;
    defaultStats = fallback.baseStats;
    defaultAbilities = fallback.abilities;
  }

  const flavorText: Record<string, string> = {};
  const availability = new Set<string>();
  for (const entry of species.flavor_text_entries as any[]) {
    if (entry.language.name !== "en") continue;
    const vgId = VERSION_TO_GROUP[entry.version.name];
    if (!vgId) continue;
    availability.add(vgId);
    if (!flavorText[vgId]) flavorText[vgId] = cleanFlavorText(entry.flavor_text);
  }
  for (const vgId of extraAvailability) availability.add(vgId);

  speciesMap.set(speciesId, {
    id: speciesId,
    nationalDexNumber: species.id,
    name: displayName,
    genus,
    generationId: genId,
    defaultFormId,
    formIds,
    types: defaultTypes,
    baseStats: defaultStats,
    abilities: defaultAbilities,
    heightM,
    weightKg,
    evolvesFromSpeciesId,
    evolutions: [],
    availability: [...availability],
    flavorText,
    evolutionChainId,
  });
}

function mapEvolutionDetail(detail: any): EvolutionCondition {
  const fields = {
    minLevel: detail.min_level ?? undefined,
    minHappiness: detail.min_happiness ?? undefined,
    minAffection: detail.min_affection ?? undefined,
    minBeauty: detail.min_beauty ?? undefined,
    timeOfDay: detail.time_of_day || undefined,
    heldItem: detail.held_item?.name,
    knownMove: detail.known_move?.name,
    knownMoveType: detail.known_move_type?.name,
    location: detail.location?.name,
    gender: detail.gender === 1 ? "female" : detail.gender === 2 ? "male" : undefined,
    partySpecies: detail.party_species?.name,
    partyType: detail.party_type?.name,
    needsOverworldRain: detail.needs_overworld_rain || undefined,
    turnUpsideDown: detail.turn_upside_down || undefined,
    relativePhysicalStats:
      detail.relative_physical_stats === -1 || detail.relative_physical_stats === 0 || detail.relative_physical_stats === 1
        ? detail.relative_physical_stats
        : undefined,
  };

  const trigger = detail.trigger?.name as string;
  if (trigger === "level-up") return { trigger: "level-up", ...fields };
  if (trigger === "trade") return { trigger: "trade", ...fields, tradeForSpecies: detail.trade_species?.name };
  if (trigger === "use-item") return { trigger: "use-item", ...fields, item: detail.item?.name ?? "unknown-item" };
  if (trigger === "shed") return { trigger: "shed", ...fields };

  const pretty = (trigger ?? "other").replace(/-/g, " ");
  const item = detail.item?.name ? ` (${detail.item.name})` : "";
  return { trigger: "other", ...fields, description: `${pretty}${item}` };
}

function dedupeConditions(conditions: EvolutionCondition[]): EvolutionCondition[] {
  const seen = new Set<string>();
  return conditions.filter((c) => {
    const key = JSON.stringify(c);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function processEvolutionChain(chainId: number): Promise<void> {
  const chain = await fetchJson<any>(`${API}/evolution-chain/${chainId}`);

  function walk(node: any) {
    const fromId = node.species.name as string;
    for (const child of node.evolves_to) {
      const toId = child.species.name as string;
      const rawDetails = child.evolution_details as any[];
      // Some chain edges (e.g. Shedinja) ship an empty evolution_details
      // array, so fall back to a described "other" condition instead of an
      // edge with zero conditions. PokeAPI also sometimes lists the same
      // detail twice (Pikachu -> Raichu's "use thunder-stone"), so dedupe.
      const conditions =
        rawDetails.length > 0
          ? dedupeConditions(rawDetails.map(mapEvolutionDetail))
          : [{ trigger: "other" as const, description: `Evolves alongside ${humanize(fromId)}` }];
      const edge: EvolutionEdge = { fromSpeciesId: fromId, toSpeciesId: toId, conditions };
      const fromSpecies = speciesMap.get(fromId);
      if (fromSpecies) fromSpecies.evolutions.push(edge);
      const toSpecies = speciesMap.get(toId);
      if (toSpecies) toSpecies.evolvesFromSpeciesId = fromId;
      walk(child);
    }
  }
  walk(chain.chain);
}

async function main() {
  for (let genNum = 1; genNum <= 9; genNum++) {
    const genId = GEN_NUMBER_TO_ID[genNum]!;
    console.log(`[gen${genNum}] fetching generation index...`);
    const genData = await fetchJson<any>(`${API}/generation/${genNum}`);
    const speciesRefs = genData.pokemon_species as Array<{ name: string; url: string }>;
    console.log(`[gen${genNum}] ${speciesRefs.length} species`);
    let done = 0;
    await Promise.all(
      speciesRefs.map((ref) =>
        limit(async () => {
          await processSpecies(ref.name, genId);
          done++;
          if (done % 50 === 0) console.log(`[gen${genNum}] ${done}/${speciesRefs.length}`);
        }),
      ),
    );
  }

  const chainIds = new Set<number>();
  for (const s of speciesMap.values()) chainIds.add(s.evolutionChainId);
  console.log(`Fetching ${chainIds.size} evolution chains...`);
  let chainsDone = 0;
  await Promise.all(
    [...chainIds].map((id) =>
      limit(async () => {
        await processEvolutionChain(id);
        chainsDone++;
        if (chainsDone % 100 === 0) console.log(`evolution chains ${chainsDone}/${chainIds.size}`);
      }),
    ),
  );

  console.log("Writing generation packs...");
  const generationsDir = join(DATA_DIR, "generations");
  mkdirSync(generationsDir, { recursive: true });

  let manifest = readManifest();
  const dataVersion = today();

  for (let genNum = 1; genNum <= 9; genNum++) {
    const genId = GEN_NUMBER_TO_ID[genNum]!;
    const speciesForGen = [...speciesMap.values()]
      .filter((s) => s.generationId === genId)
      .sort((a, b) => a.nationalDexNumber - b.nationalDexNumber)
      .map(({ evolutionChainId, ...species }) => species as Species);
    const speciesIds = new Set(speciesForGen.map((s) => s.id));
    const formsForGen = [...formsMap.values()].filter((f) => speciesIds.has(f.speciesId));

    const pack = {
      meta: {
        id: genId,
        schemaVersion: 1,
        dataVersion,
        sourceUpdatedAt: new Date().toISOString(),
        status: "complete" as const,
      },
      species: speciesForGen,
      forms: formsForGen,
    };

    const validated = GenerationPackSchema.parse(pack);
    const fileName = `generations/${genId}.json`;
    writeFileSync(join(DATA_DIR, fileName), JSON.stringify(validated, null, 2) + "\n");
    manifest = upsertPackEntry(manifest, { ...validated.meta, file: fileName });
    console.log(`  ${genId}: ${speciesForGen.length} species, ${formsForGen.length} forms`);
  }

  writeManifest(manifest);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
