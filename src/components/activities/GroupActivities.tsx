import { useState } from "react";
import { RotateCcw, Sprout, Users, Handshake } from "lucide-react";
import type { WorkspaceProps } from "./types";
import { NumberBlock, NumberCharacter, colorFor } from "../NumberCharacter";
import { playEffect } from "../../services/audioService";
export function MiniBlocks({
  count,
  color = "#78b794",
}: {
  count: number;
  color?: string;
}) {
  return (
    <div className="mini-blocks">
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} viewBox="0 0 60 64" aria-label={`Khối ${i + 1}`}>
          <NumberBlock color={color} face={i === 0} />
        </svg>
      ))}
    </div>
  );
}
export function GroupingActivity({ step, onReady }: WorkspaceProps) {
  const [grown, setGrown] = useState(0);
  const [groups, perGroup] = step.values;
  return (
    <div className="grouping-workspace">
      <div className="garden-rows">
        {Array.from({ length: groups }, (_, i) => (
          <div className={`garden-row ${i < grown ? "planted" : ""}`} key={i}>
            <span>Luống {i + 1}</span>
            {i < grown ? (
              <MiniBlocks count={perGroup} color={colorFor(i + 1)} />
            ) : (
              <div className="empty-row">
                <Sprout size={23} />
                <span>{perGroup} mầm nhỏ</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="equation">
        {Array.from({ length: grown }, () => perGroup).join(" + ") || "?"}
        {grown > 0 ? ` = ${grown * perGroup}` : ""}
      </p>
      <div className="actions center">
        <button
          className="button primary"
          disabled={grown === groups}
          onClick={() => {
            const next = grown + 1;
            setGrown(next);
            playEffect("build");
            if (next === groups) onReady?.();
          }}
        >
          <Sprout size={18} />
          {grown === groups ? "Khu vườn đã đủ mầm!" : "Trồng thêm một luống"}
        </button>
        <button className="text-button" onClick={() => setGrown(0)}>
          <RotateCcw size={17} />
          Trồng lại
        </button>
      </div>
      {grown === groups && (
        <p className="activity-feedback" role="status">
          {groups} nhóm × {perGroup} khối = {groups * perGroup} khối. Mỗi nhóm
          đều bằng nhau!
        </p>
      )}
    </div>
  );
}
export function SharingActivity({ step, onReady }: WorkspaceProps) {
  const [total, people] = step.values;
  const [shares, setShares] = useState<number[]>(Array(people).fill(0));
  const used = shares.reduce((a, b) => a + b, 0);
  const equal = used === total && shares.every((n) => n === shares[0]);
  function give(i: number) {
    if (used >= total) return;
    const next = shares.map((n, j) => (i === j ? n + 1 : n));
    setShares(next);
    playEffect("share");
    if (
      next.reduce((a, b) => a + b, 0) === total &&
      next.every((n) => n === next[0])
    ) {
      playEffect("correct");
      onReady?.();
    }
  }
  return (
    <div className="sharing-workspace">
      <div
        className="cookie-basket"
        aria-label={`Còn ${total - used} chiếc bánh`}
      >
        {Array.from({ length: total - used }, (_, i) => (
          <span className="cookie" key={i} />
        ))}
      </div>
      <p className="small">Còn {total - used} chiếc bánh để chia</p>
      <div className="sharing-friends">
        {shares.map((n, i) => (
          <button
            className="share-friend"
            onClick={() => give(i)}
            key={i}
            disabled={used >= total}
            aria-label={`Chia bánh cho bạn ${i + 1}`}
          >
            <NumberCharacter value={i + 1} size={65} />
            <span className="cookie-plate">
              {Array.from({ length: n }, (_, j) => (
                <span className="cookie small-cookie" key={j} />
              ))}
            </span>
            <strong>{n} chiếc</strong>
          </button>
        ))}
      </div>
      <p
        className={`activity-feedback ${used === total && !equal ? "try-again" : ""}`}
        role="status"
      >
        {equal
          ? `Mỗi bạn ${shares[0]} chiếc. Chia đều rồi!`
          : used === total
            ? "Có bạn nhiều hơn rồi. Chia lại để mọi bạn bằng nhau nhé!"
            : "Chạm một người bạn để chia một chiếc bánh."}
      </p>
      <button
        className="button secondary"
        onClick={() => {
          setShares(Array(people).fill(0));
          playEffect("pop");
        }}
      >
        <RotateCcw size={17} />
        Chia lại
      </button>
    </div>
  );
}
export function ParityActivity({ step, onReady }: WorkspaceProps) {
  const [value, setValue] = useState(step.values[0]);
  const [paired, setPaired] = useState(0);
  const pairs = Math.floor(value / 2);
  const complete = paired === pairs;
  return (
    <div className="parity-workspace">
      <div className="pair-dance">
        {Array.from({ length: Math.ceil(value / 2) }, (_, i) => (
          <div className={`dance-pair ${i < paired ? "paired" : ""}`} key={i}>
            <MiniBlocks
              count={i === pairs && value % 2 ? 1 : 2}
              color={colorFor(i + 1)}
            />
            {i < paired && <Handshake size={22} />}
          </div>
        ))}
      </div>
      <div className="actions center">
        <button
          className="button primary"
          disabled={complete}
          onClick={() => {
            setPaired((p) => p + 1);
            playEffect("pair");
            if (paired + 1 === pairs) onReady?.();
          }}
        >
          <Users size={18} />
          Ghép một cặp
        </button>
        {step.type !== "quiz" && (
          <button
            className="button secondary"
            onClick={() => {
              setValue(value % 2 ? value - 1 : value + 1);
              setPaired(0);
              playEffect("pop");
            }}
          >
            Thử {value % 2 ? value - 1 : value + 1} khối
          </button>
        )}
      </div>
      <p className="activity-feedback" role="status">
        {complete
          ? `${value} có ${pairs} cặp${value % 2 ? ", còn một bạn đứng riêng: số lẻ!" : ", không ai đứng riêng: số chẵn!"}`
          : `${paired} / ${pairs} cặp đã có bạn nhảy.`}
      </p>
    </div>
  );
}
