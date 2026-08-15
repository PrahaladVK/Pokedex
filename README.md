# Pokédex

A Pokédex covering Generation 1 through Generation 9, plus Pokémon Legends Z-A, built to keep growing. New generations, new Pokémon, regional variants, Mega Evolutions, Gigantamax forms, and corrections can all be added without breaking the app.

## Stack

- **App**: [Expo](https://expo.dev) (React Native) + TypeScript + Expo Router, one codebase for iOS, Android, and web.
- **Styling**: NativeWind (Tailwind for React Native) + Reanimated.
- **Data**: a local, versioned dataset synced from [PokeAPI](https://pokeapi.co), validated with [zod](https://zod.dev).
- **Monorepo**: pnpm workspaces.

## Layout

```
apps/mobile/    Expo Router app
packages/schema/  zod schemas + types: Species, Form, EvolutionCondition, GameVersion, GenerationPack
packages/data/    versioned JSON data packs (one per generation) + manifest.json
packages/core/    domain logic: repository, search, filters, evolution-chain builder, form resolver
scripts/          sync-pokeapi.ts (pulls + normalizes data), seed-legends-za.ts
```

## Versioning

This project is versioned on three independent axes:

1. **App version**: semver in the root `package.json`, changes logged in [`CHANGELOG.md`](./CHANGELOG.md).
2. **Data version**: every generation pack in `packages/data/generations/` is listed in `packages/data/manifest.json` with its own `schemaVersion`, `dataVersion`, and `status` (`complete` or `partial`). Adding a new generation is additive: drop in a new pack file and a manifest entry.
3. **In-game version**: a registry of every mainline game (Red/Blue through Scarlet/Violet and Legends Z-A) in `packages/data/game-versions.json`. Species and forms reference which games they appear in, flavor text and sprites are keyed per game, and the app's detail screen lets you pick a version to view.

## Adding a new generation or Pokémon later

- **New generation**: add `packages/data/generations/genN.json` (see an existing pack for shape) and register it in `packages/data/manifest.json`. No code changes required unless the schema itself needs to grow, in which case bump `schemaVersion` and add a migration in `packages/core`.
- **New Pokémon, form, or correction**: edit the relevant generation pack directly, or add an entry under `packages/data/overrides/` to layer a correction on top of synced data without hand-editing synced output.
- **Re-sync from PokeAPI**: `pnpm sync:pokeapi` (safe to re-run, idempotent per generation).
- **Legends Z-A**: starts as a `partial` pack. Fill it in over time by re-running the sync script once PokeAPI has more data, or by hand-editing `packages/data/generations/legends-za.json`.

## Development

```bash
pnpm install
pnpm sync:pokeapi     # populate packages/data from PokeAPI (Gen 1-9)
pnpm validate:data    # referential-integrity checks
pnpm typecheck
pnpm test
pnpm mobile           # expo start: scan the QR code with Expo Go, or press w for web
```

True iOS/Android testing requires a device or simulator via `expo start`. The web target (`w` in the Expo CLI, or `expo start --web`) is the fastest way to preview UI changes during development.

## Releasing

1. Bump `version` in the root `package.json` and in `apps/mobile/package.json` / `app.json` (keep them in sync).
2. Add an entry to `CHANGELOG.md` under the new version, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
3. Commit, then tag: `git tag -a vX.Y.Z -m "vX.Y.Z"`.
4. `git push && git push --tags`, then draft a matching GitHub Release from the tag.

Generation packs version independently of the app; see `packages/data/manifest.json`. A data-only update (new Pokémon, corrections) doesn't require an app version bump unless the schema changes.
