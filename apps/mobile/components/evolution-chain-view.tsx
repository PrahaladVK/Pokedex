import type { ReactNode } from "react";
import { Fragment } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import type { EvolutionChainNode } from "@pokedex/core";
import { describeEvolutionCondition } from "../lib/evolution-text";

function ChainNode({ node, currentSpeciesId }: { node: EvolutionChainNode; currentSpeciesId: string }): ReactNode {
  const router = useRouter();
  const isCurrent = node.species.id === currentSpeciesId;

  return (
    <Fragment>
      {node.viaConditions.length > 0 && (
        <Text className="ml-1 mb-1 mt-2 text-xs text-slate-400 dark:text-slate-500">
          {"↓ " + node.viaConditions.map(describeEvolutionCondition).join("  OR  ")}
        </Text>
      )}
      <Pressable
        onPress={() => router.push(`/pokemon/${node.species.id}`)}
        className={`self-start rounded-xl px-3 py-2 ${
          isCurrent ? "bg-indigo-600" : "bg-slate-100 dark:bg-slate-700"
        }`}
      >
        <Text className={`font-medium ${isCurrent ? "text-white" : "text-slate-800 dark:text-slate-100"}`}>
          {node.species.name}
        </Text>
      </Pressable>
      {node.children.map((child) => (
        <ChainNode key={child.species.id} node={child} currentSpeciesId={currentSpeciesId} />
      ))}
    </Fragment>
  );
}

export function EvolutionChainView({ node, currentSpeciesId }: { node: EvolutionChainNode; currentSpeciesId: string }) {
  return (
    <View>
      <ChainNode node={node} currentSpeciesId={currentSpeciesId} />
    </View>
  );
}
