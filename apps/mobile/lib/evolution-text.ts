import type { EvolutionCondition } from "@pokedex/schema";
import { humanize } from "./format";

export function describeEvolutionCondition(condition: EvolutionCondition): string {
  const parts: string[] = [];

  switch (condition.trigger) {
    case "level-up":
      parts.push(condition.minLevel ? `Level ${condition.minLevel}` : "Level up");
      break;
    case "trade":
      parts.push(condition.tradeForSpecies ? `Trade for ${humanize(condition.tradeForSpecies)}` : "Trade");
      break;
    case "use-item":
      parts.push(`Use ${humanize(condition.item)}`);
      break;
    case "shed":
      parts.push("Empty Poké Ball + free party slot");
      break;
    case "other":
      parts.push(humanize(condition.description) || "Special condition");
      break;
  }

  if (condition.timeOfDay) parts.push(`during ${humanize(condition.timeOfDay)}`);
  if (condition.heldItem) parts.push(`holding ${humanize(condition.heldItem)}`);
  if (condition.knownMove) parts.push(`knowing ${humanize(condition.knownMove)}`);
  if (condition.knownMoveType) parts.push(`knowing a ${humanize(condition.knownMoveType)}-type move`);
  if (condition.location) parts.push(`at ${humanize(condition.location)}`);
  if (condition.minHappiness) parts.push("with high friendship");
  if (condition.minAffection) parts.push("with high affection");
  if (condition.minBeauty) parts.push("with high beauty");
  if (condition.gender) parts.push(`(${condition.gender} only)`);
  if (condition.partySpecies) parts.push(`with ${humanize(condition.partySpecies)} in party`);
  if (condition.partyType) parts.push(`with a ${humanize(condition.partyType)}-type in party`);
  if (condition.needsOverworldRain) parts.push("while raining");
  if (condition.turnUpsideDown) parts.push("holding console upside down");
  if (condition.relativePhysicalStats === 1) parts.push("Attack > Defense");
  if (condition.relativePhysicalStats === -1) parts.push("Attack < Defense");
  if (condition.relativePhysicalStats === 0) parts.push("Attack = Defense");

  return parts.join(", ");
}
