# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-08-16

### Added

- Light/dark/system theme toggle, persisted across sessions.
- Favorites: heart any Pokémon from its card or detail screen, with a dedicated Favorites tab.
- Compare: pick two Pokémon and see their types and base stats side by side.
- Tab navigation (Dex / Favorites / Compare), with the detail screen pushed as a shared stack screen over any tab.
- Detail screen restructured to follow a pokedex-style layout: Training, Breeding, and a computed Type defenses chart, alongside the existing stats, forms, evolution, and version-picked Pokédex entries.
- `packages/core` type chart: `getTypeDefenses` computes incoming-damage multipliers for any 1-2 type combination.
- Data model extended with training (catch rate, base friendship, base experience, growth rate), breeding (egg groups, gender ratio, egg cycles), EV yield, per-version-group sprites, and regional Pokédex numbers, populated from data already pulled from PokeAPI (no new API calls; generation packs bumped to `schemaVersion: 2`).
- Legends Z-A's new Mega Evolutions (picked up from PokeAPI's `mega-dimension` version group) now carry `introducedIn: "legends-za"` on the affected species/forms.
- Offline-friendly sprite loading via `expo-image`'s disk cache.
- Original app icon, splash, and adaptive icon artwork, replacing the default Expo placeholders.

## [0.1.0] - 2026-08-16

### Added

- Initial monorepo scaffold (`apps/mobile`, `packages/schema`, `packages/core`, `packages/data`).
- Versioned data model: `Species`, `Form` (regional variants, Mega Evolution, Gigantamax, Primal Reversion, other gimmicks), `EvolutionCondition`, `GameVersion`/`VersionGroup`.
- Data packs for Generation 1 through Generation 9, synced from PokeAPI, plus a `partial` Legends Z-A pack ready to be filled in as data becomes available.
- `packages/core` domain logic: repository/loader, search, filters, evolution-chain builder, form resolver.
- Mobile app (Expo/React Native): searchable, filterable Dex list and a detail screen with stats, forms/variants tabs, evolution chain, and an in-game version picker for flavor text and sprites.
- Data-integrity test suite (Vitest) validating referential integrity across species, forms, and evolutions.
