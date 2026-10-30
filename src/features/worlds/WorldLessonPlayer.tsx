import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  HelpCircle,
  Pause,
  Play,
  RotateCcw,
  Star,
  X,
} from "lucide-react";
import type {
  Answer,
  ExerciseQuestion,
  ExerciseStatus,
  Validation,
} from "../exercises/types";
import { exerciseRegistry, ExerciseRenderer } from "../exercises/registry";
import { solutionFor } from "../exercises/validators";
import { playEffect, setAudioMood } from "../../services/audioService";
import { stopNarration } from "../../services/narrationService";
import {
  NarrationButton,
  useNarration,
} from "../../components/NarrationButton";
import { NumberCharacter } from "../../components/NumberCharacter";
import { exerciseVoicePrompts } from "../../data/expansion/curriculum";
import type { LearningProgress } from "../../services/learningStorage";
import {
  completeLearning,
  recordLearningAttempt,
} from "../../services/learningStorage";
interface Props {
  id: string;
  title: string;
  questions: ExerciseQuestion[];
  progress: LearningProgress;
  onProgress: (update: (p: LearningProgress) => LearningProgress) => void;
  onExit: () => void;
  onNext?: () => void;
}
export function WorldLessonPlayer({
  id,
  title,
  questions,
  progress,
  onProgress,
  onExit,
  onNext,
}: Props) {
  const resumed = progress.session?.lessonId === id ? progress.session : null;
  const [index, setIndex] = useState(
      Math.min(resumed?.index ?? 0, questions.length - 1),
    ),
    [answer, setAnswer] = useState<Answer | null>(null),
    [status, setStatus] = useState<ExerciseStatus>("idle"),
    [feedback, setFeedback] = useState<Validation | null>(null),
    [hintLevel, setHintLevel] = useState(0),
    [paused, setPaused] = useState(false),
    [complete, setComplete] = useState(false),
    [attempts, setAttempts] = useState(0),
    [guided, setGuided] = useState(false);
  const [runId] = useState(() => `${id}-${Date.now()}`);
  const pauseDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = pauseDialog.current;
    if (paused) dialog?.showModal();
    else dialog?.close();
  }, [paused]);
  const locked = useRef(false),
    succeeded = useRef(false);
  const q = questions[index];
  const entry = exerciseRegistry[q.type];
  const narration = complete
    ? "Bé làm được rồi! Cảm ơn bé đã cùng các bạn khám phá. Mình cùng nhận ngôi sao nào!"
    : paused
      ? null
      : exerciseVoicePrompts[entry.engine];
  useNarration(narration);
  useEffect(() => {
    setAudioMood(complete ? "celebration" : "lesson");
  }, [complete]);
  useEffect(() => {
    if (complete) return;
    onProgress((p) => ({
      ...p,
      session: { lessonId: id, index, questionIds: questions.map((q) => q.id) },
    }));
  }, [id, index, questions, onProgress, complete]);
  const changeAnswer = useCallback((next: Answer) => {
    if (succeeded.current) return;
    locked.current = false;
    setAnswer(next);
    setStatus("interaction");
    setFeedback(null);
  }, []);
  function record(correct: boolean, assisted = false) {
    onProgress((p) =>
      recordLearningAttempt(p, {
        eventId: `${runId}-${index}-${attempts}`,
        type: q.type,
        correct,
        difficulty: q.difficulty,
        guided: assisted,
        hints: hintLevel,
      }),
    );
    setAttempts((a) => a + 1);
  }
  function check() {
    if (locked.current || paused) return;
    const result = entry.validate(q, answer);
    setFeedback(result);
    if (result.status === "incomplete") return;
    locked.current = true;
    record(result.status === "correct", guided);
    setStatus(result.status);
    playEffect(result.status === "correct" ? "correct" : "tryAgain");
    if (result.status === "correct") succeeded.current = true;
  }
  function demonstrate() {
    locked.current = false;
    const solved = solutionFor(q);
    setAnswer(solved);
    setGuided(true);
    setStatus("hint");
    setFeedback({
      status: "incomplete",
      message: "Đây là một cách làm mẫu. Bé quan sát rồi bấm Kiểm tra nhé.",
    });
    playEffect("hint");
  }
  function next() {
    if (index + 1 === questions.length) {
      setComplete(true);
      onProgress((p) => {
        const next = completeLearning(p, id);
        if (id.startsWith("daily-")) {
          const day = id.slice(6);
          next.daily = { ...next.daily, [day]: questions.map((q) => q.id) };
        }
        return next;
      });
      playEffect("complete");
    } else {
      setIndex((i) => i + 1);
      setAnswer(null);
      setStatus("idle");
      setFeedback(null);
      setHintLevel(0);
      setAttempts(0);
      setGuided(false);
      locked.current = false;
      succeeded.current = false;
    }
  }
  if (complete)
    return (
      <main className="page world-player">
        <div className="completion-card">
          <div className="big-stars">
            {[0, 1, 2].map((n) => (
              <Star key={n} size={45} fill="#edbc55" color="#c69d45" />
            ))}
          </div>
          <h1>Bé đã khám phá thêm rồi!</h1>
          <p>
            Hoàn thành {questions.length} tình huống của “{title}”.
          </p>
          <p className="small">
            Ngôi sao ghi nhận sự kiên trì. Gợi ý và thử lại luôn được chào đón.
          </p>
          <div className="actions center">
            <button className="button secondary" onClick={onExit}>
              Về hành trình
            </button>
            {onNext && (
              <button className="button primary" onClick={onNext}>
                Bài tiếp theo
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </main>
    );
  return (
    <main className="page world-player">
      <div className="world-player-top">
        <button
          className="icon-button"
          aria-label="Về bản đồ mới"
          onClick={onExit}
        >
          <ArrowLeft />
        </button>
        <div>
          <p className="eyebrow">{title}</p>
          <div className="world-session-progress">
            {questions.map((question, i) => (
              <i key={question.id} className={i <= index ? "filled" : ""} />
            ))}
          </div>
        </div>
        <b>
          {index + 1}/{questions.length}
        </b>
        <button
          className="icon-button"
          aria-label="Tạm dừng bài học"
          onClick={() => {
            setPaused(true);
            stopNarration();
          }}
        >
          <Pause />
        </button>
      </div>
      <div className="lesson-heading">
        <span className="pill">
          {entry.title} · Mức {q.difficulty}
        </span>
        <h1>{q.instruction}</h1>
        <NarrationButton text={exerciseVoicePrompts[entry.engine]} />
      </div>
      <section
        className="lesson-board expanded-board"
        key={q.id}
        data-question-id={q.id}
        data-exercise-type={q.type}
      >
        <ExerciseRenderer
          question={q}
          answer={answer}
          onChange={changeAnswer}
          status={status}
          hintLevel={hintLevel}
          disabled={status === "correct" || paused}
        />
        {feedback && (
          <div
            role="status"
            className={`feedback ${feedback.status === "incorrect" ? "wrong" : feedback.status === "correct" ? "success" : "neutral"}`}
          >
            {feedback.status === "correct" ? (
              <Star fill="currentColor" size={22} />
            ) : (
              <NumberCharacter value={1} size={35} expression="encouraging" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}
        {hintLevel > 0 && (
          <div className="hint" role="status">
            {q.hints[Math.min(hintLevel - 1, q.hints.length - 1)]}
            {hintLevel >= 3 && (
              <button className="text-button" onClick={demonstrate}>
                Xem một cách làm mẫu
              </button>
            )}
          </div>
        )}
      </section>
      <div className="world-player-actions">
        <button
          className="button secondary"
          onClick={() => {
            setHintLevel((h) => Math.min(3, h + 1));
            setStatus((s) => (s === "correct" ? s : "hint"));
            playEffect("hint");
          }}
        >
          <HelpCircle size={18} />
          Gợi ý
        </button>
        <button
          className="text-button"
          disabled={status === "correct"}
          onClick={() => {
            locked.current = false;
            setAnswer(null);
            setStatus("idle");
            setFeedback(null);
            setGuided(false);
          }}
        >
          <RotateCcw size={17} />
          Làm lại
        </button>
        {status === "correct" ? (
          <button className="button primary" onClick={next}>
            {index + 1 === questions.length ? "Hoàn thành" : "Tiếp tục"}
            <ArrowRight size={18} />
          </button>
        ) : (
          <button className="button primary" onClick={check}>
            <Check size={20} />
            Kiểm tra
          </button>
        )}
      </div>
      {status === "incorrect" && attempts >= 2 && (
        <div className="center">
          <button className="text-button" onClick={demonstrate}>
            Cùng xem một cách làm nhé
          </button>
        </div>
      )}
      {paused && (
        <dialog
          ref={pauseDialog}
          className="world-pause"
          aria-labelledby="pause-title"
          onCancel={() => setPaused(false)}
        >
          <div>
            <button
              className="icon-button pause-close"
              onClick={() => setPaused(false)}
              aria-label="Đóng tạm dừng"
            >
              <X />
            </button>
            <h2 id="pause-title">Nghỉ một chút nhé!</h2>
            <p>Tiến trình được giữ. Bé tiếp tục khi sẵn sàng.</p>
            <button className="button primary" onClick={() => setPaused(false)}>
              <Play size={18} />
              Tiếp tục chơi
            </button>
            <button className="text-button" onClick={onExit}>
              Về bản đồ
            </button>
          </div>
        </dialog>
      )}
    </main>
  );
}
