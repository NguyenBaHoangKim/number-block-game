import { payloadOf } from "../payload";
import { useState } from "react";
import { ArrowRight, KeyRound, LockKeyhole, Rocket, Star } from "lucide-react";
import type { ExerciseViewProps } from "../types";
import { calculate } from "../validators";
import { NumberBlock } from "../../../components/NumberCharacter";
import { Blocks } from "./Visuals";
import { playEffect } from "../../../services/audioService";
export function MissionView({
  question,
  answer,
  onChange,
  disabled,
  status,
}: ExerciseViewProps) {
  const p = payloadOf(question, "mission");
  const values = answer?.kind === "mission" ? answer.values : [],
    round = p.rounds[Math.min(values.length, p.rounds.length - 1)],
    target = calculate(round.a, round.op, round.b),
    [choice, setChoice] = useState<number | null>(null),
    [notice, setNotice] = useState("");
  const complete = values.length === p.rounds.length;
  return (
    <div
      className={`ex-mission mission-${p.mode} ${complete ? "mission-ready" : ""} ${status === "correct" ? "mission-done" : ""}`}
    >
      <div className="mission-scene">
        {p.mode === "rocket" ? (
          <div className="mission-rocket">
            <Rocket size={90} />
            <div className="rocket-flame" />
          </div>
        ) : p.mode === "treasure" ? (
          <>
            <div className="treasure-chest">
              <LockKeyhole size={54} />
            </div>
            <div className="mission-keys">
              {Array.from({ length: values.length }, (_, i) => (
                <KeyRound key={i} size={25} />
              ))}
            </div>
          </>
        ) : (
          <div className="platform-journey">
            <svg
              key={values.length}
              className="platform-traveler"
              viewBox="0 0 60 64"
              style={{
                left: `calc(${(Math.min(values.length, p.rounds.length - 1) / p.rounds.length) * 100}% + 4px)`,
              }}
              aria-label="Bạn Mầm nhảy qua các chặng"
            >
              <NumberBlock color="#78b794" face expression="excited" />
            </svg>
            {p.rounds.map((_, i) => (
              <span className={i < values.length ? "landed" : ""} key={i}>
                {i < values.length ? <Star fill="#edbc55" /> : i + 1}
              </span>
            ))}
          </div>
        )}
        <div className="mission-energy">
          {p.rounds.map((_, i) => (
            <i key={i} className={i < values.length ? "filled" : ""} />
          ))}
        </div>
      </div>
      {complete ? (
        <p className="activity-feedback">
          Đã đủ {p.rounds.length} chặng! Bấm Kiểm tra để nhận phần thưởng.
        </p>
      ) : (
        <>
          <h3>
            Chặng {values.length + 1}: {round.a} {round.op} {round.b} = ?
          </h3>
          <div className="mission-blocks">
            <Blocks count={round.a} small />
            <b>{round.op}</b>
            <Blocks count={round.b} small />
          </div>
          <div className="ex-options">
            {[target - 1, target, target + 1].map((n) => (
              <button
                key={n}
                disabled={disabled}
                className={n === choice ? "selected" : ""}
                onClick={() => {
                  setChoice(n);
                  setNotice(
                    n === target
                      ? "Đúng rồi! Bé bấm Qua chặng nhé."
                      : "Bé thử đếm hai nhóm và chọn lại nhé.",
                  );
                  playEffect(n === target ? "correct" : "tryAgain");
                }}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            className="button secondary"
            disabled={disabled || choice !== target}
            onClick={() => {
              onChange({ kind: "mission", values: [...values, target] });
              setChoice(null);
              setNotice("");
              playEffect("step");
            }}
          >
            Qua chặng
            <ArrowRight size={18} />
          </button>
          <p className="ex-caption" role="status">
            {notice}
          </p>
        </>
      )}
      <button
        className="text-button"
        disabled={disabled}
        onClick={() => {
          onChange({ kind: "mission", values: [] });
          setChoice(null);
          setNotice("");
        }}
      >
        Chơi lại các chặng
      </button>
    </div>
  );
}
