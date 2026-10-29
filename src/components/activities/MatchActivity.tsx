import { useState } from "react";
import type { WorkspaceProps } from "./types";
import { playEffect } from "../../services/audioService";
import { NumberCharacter } from "../NumberCharacter";
export function MatchActivity({ step, onReady }: WorkspaceProps) {
  const { values } = step;
  const ready = () => onReady?.();
  const [selected, setSelected] = useState<number | null>(null);
  const [placed, setPlaced] = useState(false);

  const target = values[values.length - 1];
  const place = (n: number) => {
    setSelected(n);
    setPlaced(true);
    playEffect(n === target ? "correct" : "tryAgain");
    if (n === target) ready();
  };
  return (
    <div className="match-workspace">
      <div className="match-choices">
        {values.map((v) => (
          <button
            key={v}
            className={`match-choice ${selected === v ? "selected" : ""}`}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", String(v))}
            onClick={() => place(v)}
            aria-label={`Chọn nhóm ${v} khối`}
          >
            <NumberCharacter value={v} size={90} />
          </button>
        ))}
      </div>
      <button
        className={`drop-zone match-target ${placed && selected === target ? "filled" : ""}`}
        aria-label={`Đặt nhóm vào số ${target}`}
        onClick={() => selected !== null && place(selected)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const n = Number(e.dataTransfer.getData("text/plain"));
          if (values.includes(n)) place(n);
        }}
      >
        <b>{target}</b>
        <small>
          {placed && selected === target
            ? "Đúng người bạn rồi!"
            : "Đặt nhóm khối vào đây"}
        </small>
      </button>
      <p className="small">
        {placed && selected !== target
          ? "Nhóm này chưa đủ. Bé đếm lại và thử nhé!"
          : "Kéo thả hoặc chạm nhóm có số khối bằng số trong ô."}
      </p>
    </div>
  );
}
