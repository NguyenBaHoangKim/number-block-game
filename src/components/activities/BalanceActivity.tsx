import { useState } from "react";
import type { WorkspaceProps } from "./types";
import { playEffect } from "../../services/audioService";
import { NumberCharacter } from "../NumberCharacter";
export function BalanceActivity({ step, onReady }: WorkspaceProps) {
  const { values } = step;
  const ready = () => onReady?.();
  const [left, setLeft] = useState(values[0]);
  const [balanceTotal, setBalanceTotal] = useState(values[0] + values[1]);

  const sum = balanceTotal;
  const right = sum - left;
  const tilt = Math.max(-13, Math.min(13, (left - right) * 3));
  return (
    <div className="balance-workspace">
      <div className="balance-numbers">
        <b>{left}</b>
        <span className="relation">
          {left === right ? "=" : left > right ? ">" : "<"}
        </span>
        <b>{right}</b>
      </div>
      <div className="seesaw" style={{ transform: `rotate(${-tilt}deg)` }}>
        <div className="balance-pan pan-left">
          {left > 0 ? (
            <NumberCharacter value={left} size={left > 5 ? 70 : 90} />
          ) : (
            <span>0</span>
          )}
        </div>
        <div className="balance-pan pan-right">
          {right > 0 ? (
            <NumberCharacter value={right} size={right > 5 ? 70 : 90} />
          ) : (
            <span>0</span>
          )}
        </div>
        <div className="beam" />
      </div>
      <div className="fulcrum" />
      <p className="small">
        {left === right
          ? "Hai bên bằng nhau, cân bằng rồi!"
          : `Bên ${left > right ? "trái" : "phải"} có nhiều khối hơn nên hạ xuống.`}
      </p>
      {step.type !== "quiz" && (
        <div className="actions center">
          <button
            className="button secondary"
            disabled={left === 0}
            onClick={() => {
              setLeft(left - 1);
              playEffect("pop");
              ready();
            }}
          >
            ← Chuyển sang phải
          </button>
          <button
            className="button secondary"
            disabled={right === 0}
            onClick={() => {
              setLeft(left + 1);
              playEffect("pop");
              ready();
            }}
          >
            Chuyển sang trái →
          </button>
          <button
            className="text-button"
            onClick={() => {
              setBalanceTotal(4);
              setLeft(2);
              playEffect("pop");
              ready();
            }}
          >
            Thử 2 và 2
          </button>
        </div>
      )}
      {sum !== 4 && left === 2 && (
        <span className="small">
          Tổng hiện tại: {sum} khối.{" "}
          {sum % 2 === 1 ? "Tổng lẻ nên chưa thể chia đều." : ""}
        </span>
      )}
    </div>
  );
}
