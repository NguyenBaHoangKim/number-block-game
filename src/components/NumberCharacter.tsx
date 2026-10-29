import { useState } from "react";
import type { Expression } from "../types/lesson";
import { numberCharacters } from "../data/mockData";
import { playEffect } from "../services/audioService";
export const colorFor = (value: number) =>
  numberCharacters.find((n) => n.value === value)?.color ?? "#78b794";
export function BlockFace({
  expression = "happy",
}: {
  expression?: Expression;
}) {
  return (
    <g className={`face face-${expression}`}>
      {expression === "thinking" && (
        <path
          d="M11 13l12 -3 M35 10l12 3"
          stroke="#35414d"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
      <ellipse cx="20" cy="23" rx="7" ry="8" fill="#fffdf5" />
      <ellipse cx="40" cy="23" rx="7" ry="8" fill="#fffdf5" />
      <ellipse className="pupil" cx="22" cy="24" rx="3" ry="4" fill="#344354" />
      <ellipse className="pupil" cx="42" cy="24" rx="3" ry="4" fill="#344354" />
      <circle cx="23" cy="22" r="1.2" fill="white" />
      <circle cx="43" cy="22" r="1.2" fill="white" />
      <ellipse cx="11" cy="35" rx="5" ry="3" fill="#f27b88" opacity=".45" />
      <ellipse cx="49" cy="35" rx="5" ry="3" fill="#f27b88" opacity=".45" />
      {expression === "surprised" ? (
        <ellipse cx="30" cy="39" rx="5" ry="6" fill="#35414d" />
      ) : expression === "thinking" ? (
        <path
          d="M25 40q6 -4 12 0"
          fill="none"
          stroke="#35414d"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path
            d={
              expression === "excited"
                ? "M21 36q9 20 18 0Z"
                : "M22 37q8 13 16 0Z"
            }
            fill="#35414d"
          />
          <path
            d="M26 42q4 -3 8 0"
            stroke="#f69ba4"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
    </g>
  );
}
export function NumberBlock({
  color,
  face = false,
  expression,
  counted = false,
}: {
  color: string;
  face?: boolean;
  expression?: Expression;
  counted?: boolean;
}) {
  return (
    <>
      <rect
        x="1"
        y="5"
        width="58"
        height="57"
        rx="10"
        fill={color}
        style={{ filter: "brightness(.80)" }}
      />
      <rect
        x="1"
        y="1"
        width="58"
        height="55"
        rx="10"
        fill={color}
        stroke="rgba(255,255,255,.5)"
        strokeWidth="2"
      />
      <path
        d="M12 7h34"
        stroke="white"
        strokeOpacity=".25"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {face && <BlockFace expression={expression} />}
      {counted && (
        <g>
          <circle cx="48" cy="11" r="9" fill="#345f4c" />
          <path d="m44 11 3 3 5-6" fill="none" stroke="white" strokeWidth="2" />
        </g>
      )}
    </>
  );
}
export const columnsFor = (value: number) =>
  value > 10 ? 5 : value > 3 ? 2 : 1;
export function blockPosition(index: number, value: number) {
  const cols = columnsFor(value);
  const rows = Math.ceil(value / cols);
  return {
    x: (index % cols) * 62,
    y: (rows - 1 - Math.floor(index / cols)) * 62,
  };
}
export function NumberCharacter({
  value,
  size = 100,
  expression = "happy",
  interactive = false,
  className = "",
}: {
  value: number;
  size?: number;
  expression?: Expression;
  interactive?: boolean;
  className?: string;
}) {
  const [bounce, setBounce] = useState(0);
  const cols = columnsFor(value);
  const rows = Math.ceil(value / cols);
  const width = cols * 62 + 20;
  const height = rows * 62 + 44;
  const art = (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={size}
      style={{ maxWidth: "100%", overflow: "visible" }}
      role="img"
      aria-label={`Nhân vật số ${value}, gồm ${value} khối`}
    >
      <ellipse
        cx={width / 2}
        cy={height - 4}
        rx={width * 0.4}
        ry="5"
        fill="#344354"
        opacity=".1"
      />
      <g
        key={bounce}
        className={bounce ? "character-bounce" : ""}
        transform="translate(10 26)"
      >
        {Array.from({ length: value }, (_, i) => {
          const p = blockPosition(i, value);
          return (
            <g key={i} transform={`translate(${p.x} ${p.y})`}>
              <NumberBlock
                color={colorFor(value)}
                face={i === value - 1}
                expression={expression}
              />
            </g>
          );
        })}
        <path
          d={`M12 ${rows * 62 + 2}h13 M${cols * 62 - 24} ${rows * 62 + 2}h13`}
          stroke="#35414d"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>
      <text
        x={width / 2}
        y="18"
        textAnchor="middle"
        fontSize="23"
        fontWeight="800"
        fill="#35414d"
      >
        {value}
      </text>
    </svg>
  );
  return interactive ? (
    <button
      className={`character-button ${className}`}
      onClick={() => {
        setBounce((b) => b + 1);
        playEffect("pop");
      }}
      aria-label={`Chào bạn số ${value}`}
    >
      {art}
    </button>
  ) : (
    <div className={`number-character ${className}`}>{art}</div>
  );
}
