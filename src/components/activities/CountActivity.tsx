import { countObjective } from "../../features/exercises/legacyObjectives";
import { useEffect, useState } from "react";
import type { WorkspaceProps } from "./types";
import { playEffect } from "../../services/audioService";
import { NumberBlock, colorFor, columnsFor } from "../NumberCharacter";
import { numberCharacters } from "../../data/mockData";
import { speakCount, stopCounting } from "../../services/narrationService";
import { Hand, RotateCcw } from "lucide-react";
export function CountActivity({
  step,
  onReady,
  expression = "happy",
}: WorkspaceProps) {
  const { values } = step;
  const ready = () => onReady?.();
  const [counted, setCounted] = useState<Set<string>>(new Set());
  useEffect(() => () => stopCounting(), []);
  const reset = () => {
    stopCounting();
    setCounted(new Set());
    onReady?.(false);
    playEffect("pop");
  };

  const { groups: targetGroups, total: countTotal } = countObjective(step);
  const targeted = targetGroups.length !== values.length;
  const targetName =
    targeted && targetGroups.length === 1
      ? (numberCharacters.find((c) => c.value === values[targetGroups[0]])
          ?.name ?? `nhóm ${values[targetGroups[0]]}`)
      : null;
  return (
    <div className="count-workspace">
      <div className="count-groups">
        {values.map((value, group) => (
          <div
            className={`count-group ${targeted && targetGroups.includes(group) ? "count-target-group" : ""}`}
            data-count-group={group}
            data-count-target={targetGroups.includes(group)}
            key={group}
          >
            <span className="number-label">
              {step.characterLabels === "name"
                ? numberCharacters.find((c) => c.value === value)?.name
                : value}
            </span>
            <div
              className="count-grid"
              style={{
                gridTemplateColumns: `repeat(${columnsFor(value)}, 1fr)`,
              }}
            >
              {Array.from({ length: value }, (_, i) => {
                const id = `${group}-${i}`;
                return (
                  <button
                    key={id}
                    className={`count-block ${counted.has(id) ? "counted" : ""}`}
                    aria-label={`Đếm nhóm ${value}, khối ${i + 1}`}
                    aria-pressed={counted.has(id)}
                    disabled={!targetGroups.includes(group)}
                    onClick={() => {
                      if (!targetGroups.includes(group) || counted.has(id))
                        return;
                      const next = new Set(counted).add(id);
                      setCounted(next);
                      const groupCount = [...next].filter((id) =>
                        id.startsWith(`${group}-`),
                      ).length;
                      playEffect("count", groupCount);
                      speakCount(groupCount);
                      if (next.size === countTotal) ready();
                    }}
                  >
                    <svg viewBox="0 0 60 64">
                      <NumberBlock
                        color={colorFor(value)}
                        face={i === 0}
                        counted={counted.has(id)}
                        expression={expression}
                      />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="workspace-caption">
        <Hand size={18} />
        {counted.size === countTotal
          ? targetName
            ? `Đã đếm đủ ${countTotal} khối của bạn ${targetName}!`
            : "Đã đếm đủ tất cả các bạn!"
          : `${targetName ? `Chạm khối của bạn ${targetName}` : "Chạm từng khối để đếm"} · ${counted.size} / ${countTotal}`}
        <button className="text-button" onClick={reset} aria-label="Đếm lại">
          <RotateCcw size={17} />
        </button>
      </div>
    </div>
  );
}
