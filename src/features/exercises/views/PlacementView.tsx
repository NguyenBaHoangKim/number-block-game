import { payloadOf } from "../payload";
import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { RotateCw, RotateCcw, Undo2 } from "lucide-react";
import type { ExerciseViewProps, Answer } from "../types";
import { ShapePicture } from "./Visuals";
import { playEffect } from "../../../services/audioService";
export function PlacementView({
  question,
  answer,
  onChange,
  disabled,
  hintLevel,
}: ExerciseViewProps) {
  const p = payloadOf(question, "placement");
  const items = answer?.kind === "placements" ? answer.items : [];
  const [selected, setSelected] = useState<string | null>(null),
    [rotations, setRotations] = useState<Record<string, number>>({}),
    [notice, setNotice] = useState("");
  const [history, setHistory] = useState<
    Extract<Answer, { kind: "placements" }>["items"][]
  >([]);
  const drag = useRef<{ pieceId: string; x: number; y: number } | null>(null);
  const [cursor, setCursor] = useState<{
    x: number;
    y: number;
    pieceId: string;
  } | null>(null);
  const rotationFor = (id: string) =>
    rotations[id] ??
    items.find((i) => i.pieceId === id)?.rotation ??
    p.pieces.find((i) => i.id === id)!.rotation;
  function commit(next: typeof items) {
    setHistory((h) => [...h, items]);
    onChange({ kind: "placements", items: next });
  }
  function place(pieceId: string, slotId: string) {
    if (disabled) return;
    const slot = p.slots.find((s) => s.id === slotId);
    if (!slot || !p.pieces.some((i) => i.id === pieceId)) return;
    commit([
      ...items.filter((i) => i.pieceId !== pieceId && i.slotId !== slotId),
      { pieceId, slotId, x: slot.x, y: slot.y, rotation: rotationFor(pieceId) },
    ]);
    setSelected(null);
    setNotice("Đã đặt mảnh. Bé có thể xoay hoặc thử vị trí khác.");
    playEffect("place");
  }
  function start(e: PointerEvent<HTMLElement>, pieceId: string) {
    if (disabled) return;
    setSelected(pieceId);
    drag.current = { pieceId, x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function move(e: PointerEvent<HTMLElement>) {
    if (!drag.current) return;
    if (Math.hypot(e.clientX - drag.current.x, e.clientY - drag.current.y) > 8)
      setCursor({ x: e.clientX, y: e.clientY, pieceId: drag.current.pieceId });
  }
  function end(e: PointerEvent<HTMLElement>) {
    if (drag.current && cursor) {
      const slot = document
        .elementsFromPoint(e.clientX, e.clientY)
        .map((el) => el.closest<HTMLElement>("[data-ex-slot]"))
        .find(Boolean);
      if (slot?.dataset.exSlot)
        place(drag.current.pieceId, slot.dataset.exSlot);
    }
    drag.current = null;
    setCursor(null);
  }
  function rotate() {
    if (!selected || disabled) return;
    const rotation = (rotationFor(selected) + 90) % 360;
    setRotations((r) => ({ ...r, [selected]: rotation }));
    if (items.some((i) => i.pieceId === selected))
      commit(
        items.map((i) => (i.pieceId === selected ? { ...i, rotation } : i)),
      );
    playEffect("pop");
  }
  const previewScale = Math.max(
    1,
    ...p.pieces.flatMap((piece) => [piece.width ?? 60, piece.height ?? 60]),
  );
  const sample = !["mirror", "length", "height"].includes(p.mode);
  return (
    <div className={`ex-placement placement-${p.mode}`}>
      {sample && (
        <div className="placement-reference">
          <span>Hình mẫu</span>
          <div>
            {p.slots.map((slot, i) => (
              <i
                key={slot.id}
                style={{
                  left: `${slot.x}%`,
                  top: `${slot.y}%`,
                  width: slot.width ? `${slot.width}%` : undefined,
                  height: slot.height ? `${slot.height}%` : undefined,
                }}
              >
                <ShapePicture
                  shape={slot.shape}
                  polygon={slot.polygon}
                  rotation={slot.rotation}
                  color={slot.color ?? p.pieces[i].color}
                />
              </i>
            ))}
          </div>
        </div>
      )}
      <div className="placement-board-viewport">
        <div className="placement-board" aria-label="Vùng ghép hình">
          {p.mode === "mirror" && (
            <div className="symmetry-axis" aria-label="Trục đối xứng" />
          )}
          {p.mode === "length" && (
            <div
              className="measuring-object horizontal"
              style={{
                left: `${p.slots[0].x - 6.5}%`,
                width: `${p.slots.length * 13}%`,
              }}
            >
              <span>Vật cần đo</span>
            </div>
          )}
          {p.mode === "height" && (
            <>
              <div
                className="measuring-object vertical"
                style={{
                  height: `${p.slots.length * 12}%`,
                  top: `${92 - p.slots.length * 12}%`,
                }}
              >
                <span>Vật cần đo</span>
              </div>
              <span className="common-ground" />
            </>
          )}
          {p.fixed?.map((slot) => (
            <span
              key={slot.id}
              className="fixed-piece"
              style={{
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                width: slot.width ? `${slot.width}%` : undefined,
                height: slot.height ? `${slot.height}%` : undefined,
              }}
            >
              <ShapePicture
                shape={slot.shape}
                color={slot.color}
                rotation={slot.rotation}
              />
            </span>
          ))}
          {p.slots.map((slot, i) => {
            const placed = items.find((item) => item.slotId === slot.id);
            const piece = p.pieces.find(
              (piece) => piece.id === placed?.pieceId,
            );
            return (
              <button
                key={slot.id}
                data-ex-slot={slot.id}
                className={`piece-slot ${placed ? "placed" : ""} ${selected === placed?.pieceId ? "active-piece" : ""}`}
                style={{
                  left: `${slot.x}%`,
                  top: `${slot.y}%`,
                  width: slot.width ? `${slot.width}%` : undefined,
                  height: slot.height ? `${slot.height}%` : undefined,
                  clipPath: slot.polygon
                    ? `polygon(${slot.polygon.map(([x, y]) => `${x}% ${y}%`).join(",")})`
                    : undefined,
                }}
                disabled={disabled}
                aria-label={`Vị trí ghép ${i + 1}${placed ? ", đã có mảnh" : ""}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  place(e.dataTransfer.getData("text/plain"), slot.id);
                }}
                onClick={() => {
                  if (selected) place(selected, slot.id);
                  else if (placed) setSelected(placed.pieceId);
                  else setNotice("Bé chạm chọn một mảnh ở khay trước nhé.");
                }}
                onPointerDown={(e) => {
                  if (placed) start(e, placed.pieceId);
                }}
                onPointerMove={move}
                onPointerUp={end}
                onPointerCancel={() => {
                  drag.current = null;
                  setCursor(null);
                }}
              >
                {p.mode === "length" || p.mode === "height" ? (
                  <span
                    className={`measurement-unit ${piece ? "filled" : ""}`}
                    style={{ background: piece?.color }}
                  >
                    {i + 1}
                  </span>
                ) : (
                  <ShapePicture
                    shape={piece?.shape ?? slot.shape}
                    polygon={piece?.polygon ?? slot.polygon}
                    color={
                      piece?.color ?? (hintLevel > 1 ? slot.color : "#bdc8ac")
                    }
                    rotation={placed?.rotation ?? slot.rotation}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="piece-tray" aria-label="Khay mảnh ghép">
        {p.pieces
          .filter((piece) => !items.some((i) => i.pieceId === piece.id))
          .map((piece, i) => (
            <button
              key={piece.id}
              className={selected === piece.id ? "selected" : ""}
              disabled={disabled}
              aria-label={`Chọn mảnh ${Number(piece.id.split("-").at(-1)) + 1}`}
              onClick={() => setSelected(piece.id)}
              onPointerDown={(e) => start(e, piece.id)}
              onPointerMove={move}
              onPointerUp={end}
              onPointerCancel={() => {
                drag.current = null;
                setCursor(null);
              }}
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("text/plain", piece.id)
              }
            >
              <span
                className="tray-shape"
                style={{
                  width: `${((piece.width ?? 60) / previewScale) * 56}px`,
                  height: `${((piece.height ?? 60) / previewScale) * 56}px`,
                  transform: `rotate(${rotationFor(piece.id)}deg)`,
                }}
              >
                <ShapePicture
                  shape={piece.shape}
                  polygon={piece.polygon}
                  color={piece.color}
                />
              </span>
              <small>
                Mảnh {Number(piece.id.split("-").at(-1)) + 1 || i + 1}
              </small>
            </button>
          ))}
      </div>
      <div className="actions center">
        <button
          className="button secondary"
          disabled={!selected || disabled}
          onClick={rotate}
        >
          <RotateCw size={19} />
          Xoay mảnh
        </button>
        <button
          className="button secondary"
          disabled={disabled || !history.length}
          onClick={() => {
            onChange({ kind: "placements", items: history.at(-1)! });
            setHistory((h) => h.slice(0, -1));
          }}
        >
          <Undo2 size={18} />
          Hoàn tác
        </button>
        <button
          className="text-button"
          disabled={disabled}
          onClick={() => {
            commit([]);
            setSelected(null);
            setRotations({});
          }}
        >
          <RotateCcw size={17} />
          Làm lại
        </button>
      </div>
      <p className="ex-caption" role="status">
        {notice ||
          "Chạm mảnh rồi chạm vị trí. Có thể kéo thả hoặc xoay mảnh đã chọn."}
      </p>
      {cursor && (
        <div
          className="drag-piece-preview"
          style={{ left: cursor.x - 30, top: cursor.y - 30 }}
        >
          <ShapePicture
            shape={p.pieces.find((piece) => piece.id === cursor.pieceId)!.shape}
            color={p.pieces.find((piece) => piece.id === cursor.pieceId)!.color}
            rotation={rotationFor(cursor.pieceId)}
          />
        </div>
      )}
    </div>
  );
}
