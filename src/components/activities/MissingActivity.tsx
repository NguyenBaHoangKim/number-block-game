import { useState } from "react";
import type { WorkspaceProps } from "./types";
import { playEffect } from "../../services/audioService";
import { NumberCharacter } from "../NumberCharacter";
import { Hand } from "lucide-react";
export function MissingActivity({ step, onReady }: WorkspaceProps) {
  const { values } = step;
  const ready = () => onReady?.();
  const [selected, setSelected] = useState<number | null>(null);
  const [placed, setPlaced] = useState(false);

  const target = values[1];
  const correct = target - values[0];
  const options = step.question?.options ?? [correct - 1, correct, correct + 1];
  const place = (n: number) => {
    setSelected(n);
    setPlaced(true);
    playEffect(n === correct ? "correct" : "tryAgain");
    if (n === correct) ready();
  };
  return (
    <div className="missing-workspace">
      <div className="missing-equation">
        <NumberCharacter value={values[0]} size={95} />
        <span>+</span>
        <button
          className={`drop-zone ${placed ? "filled" : ""}`}
          onClick={() => selected !== null && place(selected)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const n = Number(e.dataTransfer.getData("text/plain"));
            if (options.includes(n)) place(n);
          }}
          aria-label="Đặt nhóm khối vào ô trống"
        >
          {placed && selected ? (
            <NumberCharacter value={selected} size={90} />
          ) : (
            <>
              <Hand />
              <small>Thả vào đây</small>
            </>
          )}
        </button>
        <span>=</span>
        <b>{target}</b>
      </div>
      <div className="actions center">
        {options.map((n) => (
          <button
            key={n}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", String(n))}
            className={`number-option ${selected === n ? "selected" : ""}`}
            onClick={() => place(Number(n))}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="small">
        {placed
          ? selected === correct
            ? `Đúng rồi! ${values[0]} + ${selected} = ${target}`
            : "Chưa đủ khối rồi. Bé thử nhóm khác nhé!"
          : "Kéo một số vào ô trống, hoặc chạm để chọn."}
      </p>
    </div>
  );
}
