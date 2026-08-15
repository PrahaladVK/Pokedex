import { describe, expect, it } from "vitest";
import { getTypeDefenses } from "./type-chart";

describe("getTypeDefenses", () => {
  it("combines dual-type multipliers for Grass/Poison", () => {
    const defenses = getTypeDefenses(["grass", "poison"]);
    expect(defenses.fire).toBe(2);
    expect(defenses.flying).toBe(2);
    expect(defenses.psychic).toBe(2);
    expect(defenses.ice).toBe(2);
    expect(defenses.water).toBe(0.5);
    expect(defenses.electric).toBe(0.5);
    expect(defenses.fighting).toBe(0.5);
    expect(defenses.grass).toBe(0.25);
    expect(defenses.fairy).toBe(0.5);
  });

  it("omits neutral (1x) matchups", () => {
    const defenses = getTypeDefenses(["normal"]);
    expect(defenses.fighting).toBe(2);
    expect(defenses.ghost).toBe(0);
    expect(defenses.rock).toBeUndefined();
  });

  it("ignores stellar as a defending type", () => {
    const defenses = getTypeDefenses(["stellar"]);
    expect(Object.keys(defenses)).toHaveLength(0);
  });
});
