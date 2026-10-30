import { useEffect, useState } from "react";
import { ArrowRight, Check, Clock3, RotateCcw, Trophy } from "lucide-react";
import { NarrationButton, useNarration } from "./NarrationButton";
import { narrate, speakAnswer } from "../services/narrationService";
import { NumberCharacter } from "./NumberCharacter";
import {
  lessons,
  challengeConfig,
  voiceCopy,
  numberCharacters,
} from "../data/mockData";
import { BlockWorkspace } from "./BlockWorkspace";
import { ModeNavigation } from "./PlayModes";
import { playEffect, setAudioMood } from "../services/audioService";
import { validateLegacyQuestion } from "../features/exercises/legacyValidators";
import type { LessonStep } from "../types/lesson";
function shuffled<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function QuickChallengePage({
  onNavigate,
  best,
  bestByLength,
  onComplete,
}: {
  onNavigate: (route: string) => void;
  best: number;
  bestByLength?: Record<string, number>;
  onComplete: (score: number, length: number) => void;
}) {
  const [timed, setTimed] = useState(false),
    [difficulty, setDifficulty] = useState(0),
    [length, setLength] = useState(challengeConfig.questionsPerRound),
    [queue, setQueue] = useState<LessonStep[]>([]),
    [index, setIndex] = useState(0),
    [seconds, setSeconds] = useState(challengeConfig.seconds),
    [selected, setSelected] = useState<string | number | null>(null),
    [status, setStatus] = useState<"wrong" | "correct" | null>(null),
    [score, setScore] = useState(0),
    [done, setDone] = useState(false);
  const currentBest = length === 5 ? best : (bestByLength?.[length] ?? 0);
  const active = queue.length > 0 && !done;
  const step = queue[index];
  const narrationText = done
    ? voiceCopy.complete
    : step?.question
      ? step.question.prompt
      : voiceCopy.challenge;
  useNarration(narrationText);
  useEffect(() => {
    if (!active || !timed) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [active, timed]);
  useEffect(() => {
    if (active && timed && seconds === 0) {
      setDone(true);
      onComplete(score, queue.length);
      setAudioMood("celebration");
      playEffect("complete");
    }
  }, [active, timed, seconds, onComplete, score, queue.length]);
  function start() {
    const pool = lessons
      .filter((l) => !difficulty || l.difficulty === difficulty)
      .flatMap((l) => l.steps.filter((s) => s.question));
    const round = shuffled(pool);
    while (round.length < length) round.push(pool[round.length % pool.length]);
    setQueue(round.slice(0, length));
    setIndex(0);
    setSeconds(challengeConfig.seconds);
    setSelected(null);
    setStatus(null);
    setScore(0);
    setDone(false);
    setAudioMood("challenge");
    playEffect("start");
  }
  function next() {
    if (index + 1 === queue.length) {
      setDone(true);
      onComplete(score, queue.length);
      setAudioMood("celebration");
      playEffect("complete");
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setStatus(null);
      playEffect("step");
    }
  }
  return (
    <main className="page challenge-page">
      <ModeNavigation active="challenge" onNavigate={onNavigate} />
      {!queue.length ? (
        <div className="challenge-welcome">
          <span className="pill">Mỗi vòng {length} câu · Có thể thử lại</span>
          <h1>{challengeConfig.title}</h1>
          <p>Không cần vội. Bé tự chọn có dùng đồng hồ hay không.</p>
          <label className="challenge-level">
            Chọn nội dung
            <select
              aria-label="Nội dung thử thách"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
            >
              {challengeConfig.difficultyLabels.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
          <label className="challenge-level">
            Số câu mỗi vòng
            <select
              aria-label="Số câu mỗi vòng"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            >
              {[5, 10, 15].map((n) => (
                <option key={n} value={n}>
                  {n} câu
                </option>
              ))}
            </select>
          </label>
          <label className="timer-choice">
            <input
              type="checkbox"
              checked={timed}
              onChange={(e) => setTimed(e.target.checked)}
            />
            <Clock3 size={20} />
            Thêm đồng hồ 60 giây
          </label>
          <p className="small">
            Kỷ lục của bé: {currentBest} / {length} câu
          </p>
          <button className="button primary" onClick={start}>
            Bắt đầu thử thách
            <ArrowRight size={18} />
          </button>
        </div>
      ) : done ? (
        <div className="completion-card challenge-completion">
          <Trophy size={55} color="#be9538" />
          <h1>Một chuyến khám phá thật vui!</h1>
          <p className="challenge-score">
            {score} / {queue.length}
          </p>
          <p>
            {timed && seconds === 0
              ? "Hết giờ rồi. Mỗi lần chơi là thêm một lần tiến bộ!"
              : "Bé đã hoàn thành vòng thử thách."}
          </p>
          <p className="small">
            Kỷ lục: {Math.max(currentBest, score)} câu · Điểm thử thách được lưu
            riêng, không cộng sao bài học.
          </p>
          <div className="actions center">
            <button className="button primary" onClick={start}>
              <RotateCcw size={18} />
              Chơi vòng mới
            </button>
            <button
              className="button secondary"
              onClick={() => {
                setQueue([]);
                setAudioMood("challenge");
              }}
            >
              Đổi nội dung
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="challenge-status">
            <span>
              Câu {index + 1} / {queue.length}
            </span>
            <span>{score} câu đúng</span>
            {timed && (
              <span className={seconds <= 10 ? "timer-low" : ""}>
                <Clock3 size={18} />
                {seconds}s
              </span>
            )}
          </div>
          <div className="lesson-heading">
            <span className="pill">Bé thử tài</span>
            <h1>{step.question?.prompt}</h1>
            <NarrationButton text={narrationText} />
          </div>
          <section className="lesson-board" key={step.id}>
            <BlockWorkspace step={step} />
            <div className="quiz-options">
              {step.question?.options.map((option) => (
                <button
                  key={option}
                  aria-label={String(option)}
                  className={`quiz-option ${selected === option ? "selected" : ""}`}
                  aria-pressed={selected === option}
                  disabled={status === "correct"}
                  onClick={() => {
                    setSelected(option);
                    setStatus(null);
                    playEffect("pop");
                    speakAnswer(option);
                  }}
                >
                  {typeof option === "string" &&
                    numberCharacters.some((c) => c.name === option) && (
                      <NumberCharacter
                        value={
                          numberCharacters.find((c) => c.name === option)!.value
                        }
                        size={65}
                      />
                    )}
                  <span>{option}</span>
                </button>
              ))}
            </div>
            <div className="actions center">
              {status === "correct" ? (
                <button className="button primary" onClick={next}>
                  {index + 1 === queue.length ? "Xem kết quả" : "Câu tiếp theo"}
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  className="button primary"
                  disabled={selected === null}
                  onClick={() => {
                    const result = validateLegacyQuestion(step, selected);
                    if (result.status === "incomplete") return;
                    if (result.status === "correct") {
                      setStatus("correct");
                      setScore((s) => s + 1);
                      playEffect("correct");
                      narrate(step.question?.explanation ?? voiceCopy.ready);
                    } else {
                      setStatus("wrong");
                      playEffect("tryAgain");
                      narrate(voiceCopy.tryAgain);
                    }
                  }}
                >
                  <Check size={18} />
                  Kiểm tra
                </button>
              )}
            </div>
            {status && (
              <div
                className={`feedback ${status === "correct" ? "success" : "wrong"}`}
                role="status"
              >
                {status === "correct"
                  ? step.question?.explanation
                  : `Bé thử lại nhé! ${step.hint}`}
              </div>
            )}
          </section>
          <div className="challenge-exit">
            <button
              className="text-button"
              onClick={() => {
                setQueue([]);
                setStatus(null);
              }}
            >
              Dừng vòng chơi
            </button>
          </div>
        </>
      )}
    </main>
  );
}
