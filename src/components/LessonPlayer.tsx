import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  HelpCircle,
  RotateCcw,
  Star,
  Trophy,
  X,
} from "lucide-react";
import { validateLegacyQuestion } from "../features/exercises/legacyValidators";
import type { Lesson } from "../types/lesson";
import { BlockWorkspace } from "./BlockWorkspace";
import { NumberCharacter } from "./NumberCharacter";
import { playEffect, setAudioMood } from "../services/audioService";
import { NarrationButton, useNarration } from "./NarrationButton";
import { narrate, speakAnswer } from "../services/narrationService";
import { appConfig, numberCharacters, voiceCopy } from "../data/mockData";
interface Props {
  lesson: Lesson;
  onExit: () => void;
  onComplete: (stars: number) => void;
  onNext: () => void;
  onReplay: () => void;
  hasNext: boolean;
}
export function LessonPlayer({
  lesson,
  onExit,
  onComplete,
  onNext,
  onReplay,
  hasNext,
}: Props) {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [passed, setPassed] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [hint, setHint] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    setAudioMood(done ? "celebration" : "lesson");
  }, [done]);
  const step = lesson.steps[index];
  const markStepReady = useCallback(
    (isReady = true) =>
      setReady((r) =>
        r[step.id] === isReady ? r : { ...r, [step.id]: isReady },
      ),
    [step.id],
  );
  const narrationText = done
    ? voiceCopy.complete
    : step.activity === "meet"
      ? null
      : step.question
        ? step.question.prompt
        : step.instruction;
  useNarration(narrationText);
  const stars = mistakes === 0 ? appConfig.maxStars : mistakes <= 2 ? 2 : 1;
  const quizCount = lesson.steps.filter((s) => s.question).length;
  function changeStep(next: number) {
    setIndex(next);
    setFeedback(null);
    setHint(false);
    playEffect("pop");
  }
  function check() {
    const result = validateLegacyQuestion(step, answers[step.id]);
    if (result.status === "incomplete" || passed[step.id]) return;
    if (result.status === "correct") {
      setFeedback("correct");
      setPassed({ ...passed, [step.id]: true });
      playEffect("correct");
      narrate(step.question?.explanation ?? voiceCopy.ready);
    } else {
      setFeedback("wrong");
      setMistakes((m) => m + 1);
      playEffect("tryAgain");
      narrate(voiceCopy.tryAgain);
    }
  }
  function next() {
    if (index < lesson.steps.length - 1) changeStep(index + 1);
    else {
      onComplete(stars);
      setDone(true);
      playEffect("complete");
    }
  }
  if (done)
    return (
      <main className="page completion-page">
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => (
            <i
              key={i}
              style={{
                left: `${(i * 17) % 100}%`,
                background: ["#e9b94c", "#80b99d", "#c6a0da", "#e9a28b"][i % 4],
                animationDelay: `${(i % 5) * 0.13}s`,
                transform: `rotate(${i * 23}deg)`,
              }}
            />
          ))}
        </div>
        <div className="completion-card">
          <div className="trophy-medal">
            <Trophy size={48} />
          </div>
          <p className="eyebrow">THÊM MỘT KHÁM PHÁ MỚI</p>
          <h1>Bé làm được rồi!</h1>
          <p>Đã hoàn thành bài “{lesson.title}”</p>
          <div className="big-stars" aria-label={`${stars} trên 3 sao`}>
            {[1, 2, 3].map((n) => (
              <Star
                key={n}
                size={54}
                fill={n <= stars ? "#efbc4e" : "#e7e9e4"}
                color={n <= stars ? "#dca238" : "#e7e9e4"}
              />
            ))}
          </div>
          <p>
            Đúng {Object.keys(passed).length}/{quizCount} câu ·{" "}
            {mistakes === 0
              ? "Tất cả đều đúng ngay lần đầu!"
              : "Bé đã kiên trì thử lại. Thật đáng khen!"}
          </p>
          <p className="small">Lưu kết quả tốt nhất · Tối đa 3 sao mỗi bài</p>
          <div className="actions center">
            <button className="button secondary" onClick={onReplay}>
              <RotateCcw size={18} /> Học lại
            </button>
            <button
              className="button primary"
              onClick={hasNext ? onNext : onExit}
            >
              {hasNext ? "Bài tiếp theo" : "Về bản đồ"}
              <ArrowRight size={18} />
            </button>
          </div>
          <button className="text-button" onClick={onExit}>
            Về bản đồ bài học
          </button>
        </div>
      </main>
    );
  const canNext =
    step.activity === "meet"
      ? ready[step.id]
      : step.type === "explain" ||
        (step.type === "interact" ? ready[step.id] : passed[step.id]);
  return (
    <main className="page lesson-page">
      <div className="lesson-top">
        <button
          className="icon-button"
          onClick={onExit}
          aria-label="Về bản đồ bài học"
        >
          <X size={22} />
        </button>
        <div>
          <p className="eyebrow">{lesson.title}</p>
          <div
            className="lesson-progress"
            aria-label={`Bước ${index + 1} trên ${lesson.steps.length}`}
          >
            {lesson.steps.map((s, i) => (
              <span key={s.id} className={i <= index ? "filled" : ""} />
            ))}
          </div>
        </div>
        <span className="step-label">
          {index + 1} / {lesson.steps.length}
        </span>
      </div>
      <div className="lesson-heading">
        <span className="pill">
          {step.type === "explain"
            ? "Cùng làm quen"
            : step.type === "interact"
              ? "Chơi và khám phá"
              : "Bé thử tài"}
        </span>
        <h1>{step.title}</h1>
        <p>{step.instruction}</p>
        {step.activity !== "meet" && (
          <NarrationButton text={narrationText ?? step.instruction} />
        )}
      </div>
      <section className="lesson-board" key={step.id}>
        <BlockWorkspace
          step={step}
          expression={
            feedback === "wrong"
              ? "encouraging"
              : feedback === "correct"
                ? "excited"
                : "happy"
          }
          onReady={markStepReady}
        />
        {step.type === "quiz" && step.question && (
          <div className="quiz">
            <h2>{step.question.prompt}</h2>
            <div className="quiz-options">
              {step.question.options.map((option) => (
                <button
                  key={option}
                  aria-label={String(option)}
                  disabled={passed[step.id]}
                  aria-pressed={answers[step.id] === option}
                  className={`quiz-option ${answers[step.id] === option ? "selected" : ""} ${passed[step.id] && option === step.question?.answer ? "correct" : ""}`}
                  onClick={() => {
                    setAnswers({ ...answers, [step.id]: option });
                    setFeedback(null);
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
            {!passed[step.id] && (
              <button
                className="button primary check-button"
                disabled={answers[step.id] === undefined}
                onClick={check}
              >
                <Check size={19} /> Kiểm tra
              </button>
            )}
          </div>
        )}
        {(feedback || passed[step.id]) && (
          <div
            role="status"
            className={`feedback ${feedback === "wrong" ? "wrong" : "success"}`}
          >
            {feedback === "wrong" ? (
              <>
                <NumberCharacter value={1} size={40} expression="encouraging" />
                <span>Gần đúng rồi! Bé thử đếm lại nhé. {step.hint}</span>
              </>
            ) : (
              <>
                <Star size={22} fill="currentColor" />
                <span>{step.question?.explanation}</span>
              </>
            )}
          </div>
        )}
      </section>
      <div className="lesson-footer">
        <button
          className="button secondary"
          onClick={() => changeStep(index - 1)}
          disabled={index === 0}
        >
          <ArrowLeft size={18} /> Quay lại
        </button>
        <button
          className="text-button"
          onClick={() => {
            setHint(!hint);
            if (!hint) narrate(step.hint);
            playEffect("hint");
          }}
          aria-expanded={hint}
        >
          <HelpCircle size={19} /> Gợi ý
        </button>
        <button className="button primary" onClick={next} disabled={!canNext}>
          {index === lesson.steps.length - 1 ? "Hoàn thành" : "Tiếp tục"}
          <ArrowRight size={19} />
        </button>
      </div>
      {hint && (
        <div className="hint" role="status">
          {step.hint}
        </div>
      )}
      {!canNext && step.type === "interact" && (
        <p className="small center">
          Hoàn thành hoạt động bên trên để tiếp tục nhé.
        </p>
      )}
    </main>
  );
}
