import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { WorkspaceProps } from "./types";
import {
  NumberBlock,
  blockPosition,
  colorFor,
  columnsFor,
} from "../NumberCharacter";
import { playEffect } from "../../services/audioService";
import { RotateCcw, Sparkles, Check } from "lucide-react";
export function TransformActivity({
  step,
  onReady,
  expression = "happy",
}: WorkspaceProps) {
  const { activity, values } = step;
  const [transformed, setTransformed] = useState(false);
  const [pair, setPair] = useState(values.slice(0, 2));
  const [draggedGroup, setDraggedGroup] = useState(false);
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const dragStart = useRef<{ x: number; y: number; group: boolean } | null>(
    null,
  );
  const svgRef = useRef<SVGSVGElement>(null);
  const isSplit = activity === "split";
  const a = pair[0],
    b = pair[1] ?? 0;
  const total = isSplit ? a : a + b;
  const ready = () => onReady?.();
  const transform = () => {
    setTransformed(true);
    playEffect(isSplit ? "split" : "merge");
    ready();
  };
  function pointerDown(event: PointerEvent<SVGGElement>, group: boolean) {
    if (transformed) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, y: event.clientY, group };
    setDraggedGroup(group);
    setDrag({ x: 0, y: 0, active: true });
  }
  function pointerMove(event: PointerEvent<SVGGElement>) {
    if (!dragStart.current) return;
    const scale = 600 / (svgRef.current?.getBoundingClientRect().width ?? 600);
    setDrag({
      x: (event.clientX - dragStart.current.x) * scale,
      y: (event.clientY - dragStart.current.y) * scale,
      active: true,
    });
  }
  function pointerUp() {
    if (!dragStart.current) return;
    if (Math.hypot(drag.x, drag.y) > 45) transform();
    dragStart.current = null;
    setDrag({ x: 0, y: 0, active: false });
  }
  const reset = () => {
    setTransformed(false);
    onReady?.(false);
    playEffect("pop");
  };
  const cols = columnsFor(total);
  const rows = Math.ceil(total / cols);
  return (
    <div className={`transform-workspace ${transformed ? "transformed" : ""}`}>
      <svg
        className="transform-canvas"
        ref={svgRef}
        viewBox="0 0 600 360"
        role="img"
        aria-label={
          isSplit
            ? `Tách ${a} thành ${a - b} và ${b}`
            : `Ghép ${a} và ${b} thành ${total}`
        }
      >
        <ellipse cx="300" cy="328" rx="235" ry="15" fill="#e2e9dc" />
        {!isSplit && !transformed && (
          <text x="300" y="218" className="operation-sign">
            +
          </text>
        )}
        {Array.from({ length: total }, (_, i) => {
          const group = isSplit ? i >= a - b : i >= a;
          const local = isSplit ? (group ? i - (a - b) : i) : group ? i - a : i;
          const groupSize = isSplit ? (group ? b : a - b) : group ? b : a;
          let x: number, y: number;
          if ((isSplit && !transformed) || (!isSplit && transformed)) {
            const p = blockPosition(i, total);
            x = 300 - cols * 31 + p.x;
            y = 315 - rows * 62 + p.y;
          } else {
            const p = blockPosition(local, groupSize);
            x = (group ? 420 : 170) - (groupSize > 3 ? 62 : 31) + p.x;
            y = 315 - Math.ceil(groupSize / (groupSize > 3 ? 2 : 1)) * 62 + p.y;
          }
          if (drag.active && draggedGroup === group) {
            x += drag.x;
            y += drag.y;
          }
          const face = isSplit
            ? transformed
              ? local === groupSize - 1
              : i === total - 1
            : transformed
              ? i === total - 1
              : local === groupSize - 1;
          return (
            <g
              key={i}
              className={`moving-block ${drag.active ? "dragging" : ""}`}
              style={{ transform: `translate(${x}px,${y}px)` }}
              onPointerDown={(event) => pointerDown(event, group)}
              onPointerMove={pointerMove}
              onPointerUp={pointerUp}
              onPointerCancel={() => {
                dragStart.current = null;
                setDrag({ x: 0, y: 0, active: false });
              }}
            >
              <NumberBlock
                color={colorFor(isSplit ? a : group ? b : a)}
                face={face}
                expression={transformed ? "excited" : expression}
              />
            </g>
          );
        })}
        {transformed && (
          <text x="300" y="38" textAnchor="middle" className="result-number">
            {isSplit ? `${a - b} và ${b}` : total}
          </text>
        )}
      </svg>
      <div className="actions center">
        <button
          className="button primary"
          onClick={transform}
          disabled={transformed}
        >
          {transformed ? <Check size={19} /> : <Sparkles size={19} />}{" "}
          {transformed ? "Thật kỳ diệu!" : isSplit ? "Tách khối" : "Ghép khối"}
        </button>
        <button className="text-button" onClick={reset}>
          <RotateCcw size={17} /> Làm lại
        </button>
      </div>
      {isSplit &&
        step.type !== "quiz" &&
        step.config?.splitTarget === undefined && (
          <label className="split-control">
            Tách ra {b} khối
            <input
              aria-label="Số khối tách ra"
              type="range"
              min="1"
              max={a - 1}
              value={b}
              onChange={(e) => {
                setPair([a, Number(e.target.value)]);
                setTransformed(false);
                onReady?.(false);
              }}
            />
          </label>
        )}
      <p className="workspace-caption">
        {transformed
          ? isSplit
            ? `${a} = ${a - b} + ${b} · Tổng số khối vẫn giữ nguyên!`
            : `${a} + ${b} = ${total} · Các bạn đã về chung một nhà!`
          : "Kéo các khối để khám phá, hoặc chạm nút bên trên."}
      </p>
      {activity === "merge" && step.alternatives && (
        <div className="pair-options">
          <span>Thử một cách khác:</span>
          {step.alternatives.map(([first, second]) => (
            <button
              key={first}
              onClick={() => {
                setPair([first, second]);
                setTransformed(false);
                onReady?.(false);
              }}
            >
              {first} + {second}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
