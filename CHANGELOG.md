# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-08-16

### Added

- Initial monorepo scaffold (`apps/mobile`, `packages/schema`, `packages/core`, `packages/data`).
- Versioned data model: `Species`, `Form` (regional variants, Mega Evolution, Gigantamax, Primal Reversion, other gimmicks), `EvolutionCondition`, `GameVersion`/`VersionGroup`.
- Data packs for Generation 1 through Generation 9, synced from PokeAPI, plus a `partial` Legends Z-A pack ready to be filled in as data becomes available.
- `packages/core` domain logic: repository/loader, search, filters, evolution-chain builder, form resolver.
- Mobile app (Expo/React Native): searchable, filterable Dex list and a detail screen with stats, forms/variants tabs, evolution chain, and an in-game version picker for flavor text and sprites.
- Data-integrity test suite (Vitest) validating referential integrity across species, forms, and evolutions.
