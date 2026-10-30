import { useEffect, useState, useSyncExternalStore } from "react";
import { Hand, RotateCcw, Sparkles } from "lucide-react";
import type { WorkspaceProps } from "./types";
import { NumberCharacter, colorFor } from "../NumberCharacter";
import { numberCharacters, narrationConfig } from "../../data/mockData";
import { NarrationButton, useNarration } from "../NarrationButton";
import {
  getNarrationSnapshot,
  subscribeNarration,
  narrationDuration,
} from "../../services/narrationService";
import { playEffect } from "../../services/audioService";

export function MeetCharactersActivity({ step, onReady }: WorkspaceProps) {
  const introduction = step.introduction;
  const [phase, setPhase] = useState(-1);
  const [replay, setReplay] = useState(0);
  const [greeted, setGreeted] = useState<number | null>(null);
  const count = introduction?.cues.length ?? 0;
  const finished = phase >= count && count > 0;

  const voiceEnabled = useSyncExternalStore(
    subscribeNarration,
    () => getNarrationSnapshot().enabled,
  );
  const narrationText = introduction
    ? phase < 0
      ? introduction.opening
      : finished && greeted === null
        ? introduction.closing
        : introduction.cues[greeted ?? Math.min(phase, count - 1)]?.greeting
    : null;
  useNarration(narrationText);
  useEffect(() => {
    if (!introduction || phase < 0) return;
    if (phase >= introduction.cues.length) {
      onReady?.();
      return;
    }
    playEffect("greet");
    const timer = window.setTimeout(
      () => setPhase((p) => p + 1),
      Math.max(
        introduction.cueDurationMs,
        narrationDuration(introduction.cues[phase].greeting) +
          narrationConfig.greetingPauseMs,
      ),
    );
    return () => window.clearTimeout(timer);
  }, [phase, introduction, onReady, voiceEnabled]);

  if (!introduction) return null;
  const current =
    introduction.cues[greeted ?? Math.min(Math.max(phase, 0), count - 1)];
  return (
    <div className={`meet-workspace ${finished ? "meet-finished" : ""}`}>
      <div
        className="meet-garden"
        aria-label="Khu vườn làm quen với các bạn khối số"
      >
        <span className="garden-cloud cloud-left" aria-hidden="true" />
        <span className="garden-cloud cloud-right" aria-hidden="true" />
        <span className="garden-sun" aria-hidden="true" />
        <div className="meet-friends">
          {introduction.cues.map((cue, index) => {
            const character = numberCharacters.find(
              (c) => c.value === cue.value,
            );
            const visible = phase >= index;
            const waving = phase === index || greeted === index;
            return (
              <div
                className={`meet-friend ${visible ? "arrived" : ""} ${waving ? "speaking" : ""}`}
                key={`${replay}-${cue.value}`}
              >
                <div className="friend-slot">
                  {visible ? (
                    <button
                      className="friend-greeting"
                      aria-label={`Chào ${character?.name}`}
                      onClick={() => {
                        if (finished) setGreeted(index);
                        setReplay((r) => r + 1);
                        playEffect("greet");
                      }}
                    >
                      <div className="friend-entrance">
                        <NumberCharacter
                          value={cue.value}
                          size={105}
                          expression={waving ? "excited" : "happy"}
                        />
                        {waving && (
                          <svg
                            className="greeting-hand"
                            viewBox="0 0 55 60"
                            aria-hidden="true"
                          >
                            <path
                              d="M4 51Q25 55 28 30"
                              stroke={colorFor(cue.value)}
                              strokeWidth="9"
                              fill="none"
                              strokeLinecap="round"
                            />
                            <g className="waving-glove">
                              <path
                                d="M25 35 15 24q-2-6 3-6l6 6-4-17q1-5 5-2l5 16 0-18q3-5 6 0l1 18 5-14q4-3 6 1l-4 20q-1 13-12 13Z"
                                fill="#fffdf5"
                                stroke="#586950"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                            </g>
                          </svg>
                        )}
                      </div>
                      <span className="friend-name">{character?.name}</span>
                    </button>
                  ) : (
                    <span className="friend-waiting" aria-hidden="true">
                      <span>?</span>
                      <i />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="garden-floor" aria-hidden="true" />
      </div>
      <div
        className="meet-dialogue"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {phase < 0 ? (
          <>
            <Sparkles size={21} />
            <p>{introduction.opening}</p>
          </>
        ) : (
          <>
            <span
              className="speaker-dot"
              style={{ background: colorFor(current.value) }}
            />
            <p>
              {finished && greeted === null
                ? introduction.closing
                : current.greeting}
            </p>
          </>
        )}
      </div>
      {narrationText && <NarrationButton text={narrationText} />}
      <div className="meet-controls">
        {!finished && (
          <button
            className="text-button"
            onClick={() => {
              setGreeted(null);
              setPhase(count);
            }}
          >
            Bỏ qua lời chào
          </button>
        )}
        {phase < 0 ? (
          <button
            className="button primary"
            onClick={() => {
              setGreeted(null);
              setPhase(0);
            }}
          >
            <Hand size={20} />
            {introduction.invitation}
          </button>
        ) : finished ? (
          <button
            className="text-button"
            onClick={() => {
              setGreeted(null);
              setPhase(-1);
              setReplay((r) => r + 1);
            }}
          >
            <RotateCcw size={17} />
            {introduction.replayLabel}
          </button>
        ) : (
          <div
            className="greeting-progress"
            aria-label={`Đang chào bạn thứ ${phase + 1} trong ${count}`}
          >
            {introduction.cues.map((cue, i) => (
              <span key={cue.value} className={phase >= i ? "filled" : ""} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
