import { useEffect, useState } from "react";
import { Eye, RotateCcw } from "lucide-react";
import type { WorkspaceProps } from "./types";
import { MiniBlocks } from "./GroupActivities";
import { playEffect } from "../../services/audioService";
export function MemoryActivity({ step, onReady }: WorkspaceProps) {
  const [phase, setPhase] = useState<"idle" | "visible" | "hidden">("idle");
  useEffect(() => {
    if (phase !== "visible") return;
    const timer = window.setTimeout(() => {
      setPhase("hidden");
      onReady?.();
    }, step.config?.flashMs ?? 1800);
    return () => window.clearTimeout(timer);
  }, [phase, step.config?.flashMs, onReady]);
  return (
    <div className="memory-workspace">
      <div
        className={`memory-box ${phase}`}
        aria-label={
          phase === "visible" ? "Các khối trong hộp" : "Hộp bí mật đã đóng"
        }
      >
        {phase === "visible" ? (
          <MiniBlocks count={step.values[0]} color="#e8b75b" />
        ) : (
          <span className="memory-mystery" aria-hidden="true">
            ?
          </span>
        )}
      </div>
      <p className="activity-feedback" role="status">
        {phase === "idle"
          ? "Các khối đang trốn trong hộp. Bé sẵn sàng chưa?"
          : phase === "visible"
            ? "Nhìn thật kỹ nhé…"
            : "Hộp đóng rồi! Bé nhớ có bao nhiêu khối không?"}
      </p>
      <button
        className="button primary"
        disabled={phase === "visible"}
        onClick={() => {
          setPhase("visible");
          playEffect("reveal");
        }}
      >
        {phase === "hidden" ? <RotateCcw size={19} /> : <Eye size={19} />}{" "}
        {phase === "idle" ? "Mở hộp bí mật" : "Nhìn lại một lần"}
      </button>
    </div>
  );
}
