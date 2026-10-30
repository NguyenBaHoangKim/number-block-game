import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  Compass,
  Gamepad2,
  Gift,
  Layers,
  LockKeyhole,
  Play,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import {
  worlds,
  curriculumLessons,
  lessonById,
  questionById,
} from "../../data/expansion/curriculum";
import { definitions, definitionByType } from "../exercises/catalog";
import type { Difficulty, ExerciseType } from "../exercises/types";
import { generateQuestion, seeded, shuffle } from "../exercises/generator";
import {
  loadLearningProgress,
  saveLearningProgress,
  freshLearning,
} from "../../services/learningStorage";
import type { LearningProgress } from "../../services/learningStorage";
import { NumberCharacter } from "../../components/NumberCharacter";
import { WorldLessonPlayer } from "./WorldLessonPlayer";
import {
  dailyQuestions,
  dateKey,
  hashText,
  practiceQuestions,
} from "./practice";
import "./worlds.css";
interface Props {
  route: string;
  navigate: (route: string) => void;
}
function LearningRoute({
  route,
  progress,
  onProgress,
  navigate,
}: Props & {
  progress: LearningProgress;
  onProgress: (update: (p: LearningProgress) => LearningProgress) => void;
}) {
  const [mode, id, level] = route.split("/");
  const lesson = mode === "learn" ? lessonById[id] : undefined;
  const type =
    mode === "practice" && id && definitionByType[id as ExerciseType]
      ? (id as ExerciseType)
      : undefined;
  const valid =
    mode === "daily" ||
    (mode === "practice" && (!id || Boolean(type))) ||
    Boolean(lesson);
  const [questions] = useState(() => {
    if (lesson) {
      const saved =
        progress.session?.lessonId === lesson.id
          ? progress.session.questionIds
              .map((q) => questionById[q])
              .filter(Boolean)
          : [];
      return saved.length
        ? saved
        : shuffle(
            lesson.questionIds.map((q) => questionById[q]),
            seeded(hashText(`${lesson.id}-${progress.sessions}`)),
          ).slice(0, 5);
    }
    if (mode === "daily") return dailyQuestions(dateKey());
    if (type && ["1", "2", "3", "4", "5"].includes(level))
      return Array.from({ length: 5 }, (_, i) =>
        generateQuestion(
          type,
          Number(level) as Difficulty,
          hashText(`${route}-${progress.sessions}`) + i,
          `${route}-${progress.sessions}-${i}`,
        ),
      );
    return practiceQuestions(progress, type);
  });
  if (!valid)
    return (
      <main className="page empty-state">
        <h1>Bài học chưa có ở đây.</h1>
        <button className="button primary" onClick={() => navigate("worlds")}>
          Về thế giới
        </button>
      </main>
    );
  const title =
    lesson?.title ??
    (mode === "daily"
      ? "Ba khám phá hôm nay"
      : type
        ? `Luyện thêm: ${definitionByType[type].title}`
        : "Luyện theo nhịp của bé");
  return (
    <WorldLessonPlayer
      id={lesson?.id ?? (mode === "daily" ? `daily-${dateKey()}` : route)}
      title={title}
      questions={questions}
      progress={progress}
      onProgress={onProgress}
      onExit={() => navigate(lesson ? `world/${lesson.worldId}` : "worlds")}
      onNext={
        lesson && curriculumLessons[curriculumLessons.indexOf(lesson) + 1]
          ? () =>
              navigate(
                `learn/${curriculumLessons[curriculumLessons.indexOf(lesson) + 1].id}`,
              )
          : undefined
      }
    />
  );
}
export default function ExpansionApp({ route, navigate }: Props) {
  const [progress, setProgress] = useState(loadLearningProgress),
    [showAllSkills, setShowAllSkills] = useState(false);
  const update = useCallback(
    (updater: (p: LearningProgress) => LearningProgress) =>
      setProgress(updater),
    [],
  );
  useEffect(() => {
    saveLearningProgress(progress);
  }, [progress]);
  useEffect(() => {
    const reset = () => setProgress(freshLearning());
    window.addEventListener("number-block-learning-reset", reset);
    return () =>
      window.removeEventListener("number-block-learning-reset", reset);
  }, []);
  const completed = Object.keys(progress.stars).length,
    stars = Object.values(progress.stars).reduce((n, s) => n + s, 0),
    day = dateKey();
  if (
    route.startsWith("learn/") ||
    route === "daily" ||
    route === "practice" ||
    route.startsWith("practice/")
  )
    return (
      <LearningRoute
        key={route}
        route={route}
        navigate={navigate}
        progress={progress}
        onProgress={update}
      />
    );
  const world = route.startsWith("world/")
    ? worlds.find((w) => w.id === route.split("/")[1])
    : undefined;
  const navigation = (
    <nav className="world-nav" aria-label="Hành trình mở rộng">
      <button
        className={route === "worlds" || world ? "active" : ""}
        onClick={() => navigate("worlds")}
      >
        <Compass size={18} />
        Thế giới
      </button>
      <button
        className={route === "daily" ? "active" : ""}
        onClick={() => navigate("daily")}
      >
        <CalendarDays size={18} />
        Hôm nay
      </button>
      <button
        className={route === "notebook" ? "active" : ""}
        onClick={() => navigate("notebook")}
      >
        <BookOpen size={18} />
        Sổ tay
      </button>
      <button
        className={route === "collection" ? "active" : ""}
        onClick={() => navigate("collection")}
      >
        <Gift size={18} />
        Bộ sưu tập
      </button>
    </nav>
  );
  if (route === "notebook")
    return (
      <main className="page expansion-page">
        {navigation}
        <div className="page-heading">
          <span className="pill">Mỗi khám phá đều đáng nhớ</span>
          <h1>Sổ tay toán học</h1>
          <p>Ôn lại bằng một lượt chơi ngắn, theo nhịp của bé.</p>
        </div>
        <div className="world-hub-actions">
          <button
            className="button primary"
            onClick={() => navigate("practice")}
          >
            <Sparkles size={18} />
            Luyện phù hợp hôm nay
          </button>
          <label className="adult-toggle">
            <input
              type="checkbox"
              checked={showAllSkills}
              onChange={(e) => setShowAllSkills(e.target.checked)}
            />
            Xem mọi kỹ năng
          </label>
        </div>
        <div className="notebook-grid">
          {definitions
            .filter((d) => showAllSkills || progress.skills[d.type]?.attempts)
            .map((d) => (
              <article key={d.type}>
                <span className="skill-number">{d.number}</span>
                <h2>{d.title}</h2>
                <p>{d.objective}</p>
                <span className="small">
                  {progress.skills[d.type]
                    ? `Đã khám phá ${progress.skills[d.type]!.attempts} lượt`
                    : "Một khám phá mới đang chờ bé"}
                </span>
                <div className="skill-levels">
                  {[1, 3, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => navigate(`practice/${d.type}/${level}`)}
                    >
                      Mức {level}
                    </button>
                  ))}
                </div>
              </article>
            ))}
        </div>
        {!showAllSkills && !Object.keys(progress.skills).length && (
          <div className="empty-state">
            <NumberCharacter value={1} size={80} />
            <p>Sổ tay sẽ ghi lại những kỹ năng bé đã thử.</p>
            <button className="text-button" onClick={() => navigate("worlds")}>
              Bắt đầu một khám phá
              <ArrowRight size={17} />
            </button>
          </div>
        )}
      </main>
    );
  if (route === "collection")
    return (
      <main className="page expansion-page">
        {navigation}
        <div className="page-heading">
          <span className="pill">Bạn bè và những dấu mốc nhỏ</span>
          <h1>Bộ sưu tập của bé</h1>
          <p>Đã hoàn thành {completed} / 80 bài trong hành trình mới.</p>
        </div>
        <div className="character-collection">
          {[0, 1, 3, 5, 8, 12, 20, 30, 50, 80].map((required, i) => (
            <article
              key={i}
              className={completed >= required ? "unlocked" : ""}
            >
              <NumberCharacter value={i + 1} size={90} />
              <h3>Bạn số {i + 1}</h3>
              <span>
                {completed >= required
                  ? "Đã đến chơi cùng bé!"
                  : `Khám phá ${required} bài để gặp bạn`}
              </span>
              {completed < required && <LockKeyhole size={18} />}
            </article>
          ))}
        </div>
        <div className="collection-badges">
          {[
            { n: 1, title: "Bước đầu khám phá", Icon: Sparkles },
            { n: 10, title: "Người bạn kiên trì", Icon: Star },
            { n: 40, title: "Nhà thám hiểm", Icon: Compass },
            { n: 80, title: "Vòng quanh hòn đảo", Icon: Trophy },
          ].map((b) => (
            <div className={completed >= b.n ? "earned" : ""} key={b.n}>
              <b.Icon size={32} />
              <strong>{b.title}</strong>
              <span>
                {Math.min(completed, b.n)}/{b.n} bài
              </span>
            </div>
          ))}
        </div>
        <button className="button primary" onClick={() => navigate("worlds")}>
          Tiếp tục hành trình
          <ArrowRight size={18} />
        </button>
      </main>
    );
  if (world)
    return (
      <main className="page expansion-page">
        {navigation}
        <button className="text-button" onClick={() => navigate("worlds")}>
          <ArrowLeft size={18} />
          Tất cả thế giới
        </button>
        <div
          className="world-detail-header"
          style={{ background: world.color }}
        >
          <span className="eyebrow">THẾ GIỚI {world.order}</span>
          <h1>{world.title}</h1>
          <p>{world.description}</p>
          <span>
            {world.lessonIds.filter((id) => progress.stars[id]).length}/10 bài
            đã khám phá
          </span>
        </div>
        <div className="world-lesson-grid">
          {world.lessonIds.map((id, i) => {
            const lesson = lessonById[id],
              available =
                progress.unlockAll ||
                lesson.prerequisites.every((p) => progress.stars[p]);
            return (
              <button
                key={id}
                className={`world-lesson-card ${progress.stars[id] ? "completed" : ""}`}
                disabled={!available}
                onClick={() => navigate(`learn/${id}`)}
              >
                <span
                  className="lesson-orbit"
                  style={{ background: world.color }}
                >
                  {progress.stars[id] ? (
                    <Check />
                  ) : available ? (
                    i + 1
                  ) : (
                    <LockKeyhole size={22} />
                  )}
                </span>
                <span className="eyebrow">{id}</span>
                <h2>{lesson.title}</h2>
                <p>{lesson.description}</p>
                <div>
                  <span>Mức {lesson.difficulty} · 10 tình huống</span>
                  <span>
                    {progress.stars[id] ? "★ ★ ★" : "5 câu mỗi lượt"}
                    <ArrowRight size={16} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <label className="adult-toggle world-unlock">
          <input
            type="checkbox"
            checked={progress.unlockAll}
            onChange={(e) =>
              setProgress((p) => ({ ...p, unlockAll: e.target.checked }))
            }
          />
          Mở mọi bài để khám phá · Tắt để đi theo lộ trình
        </label>
      </main>
    );
  if (route !== "worlds")
    return (
      <main className="page empty-state">
        {navigation}
        <h1>Hình như bé đi lạc một chút!</h1>
        <button className="button primary" onClick={() => navigate("worlds")}>
          Về các thế giới
        </button>
      </main>
    );
  return (
    <main className="page expansion-page">
      {navigation}
      <div className="page-heading">
        <span className="pill">8 thế giới · 80 bài · 800 tình huống</span>
        <h1>Mỗi thế giới, một điều kỳ diệu</h1>
        <p>Chạm một hòn đảo để cùng các bạn khám phá.</p>
      </div>
      <div className="world-hub-stats">
        <span>
          <Star fill="#edbc55" color="#b68e36" />
          {stars}/240 sao
        </span>
        <span>
          <Check />
          {completed}/80 bài
        </span>
        <button onClick={() => navigate("map")}>
          24 bài gốc
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="world-grid">
        {worlds.map((world, i) => {
          const count = world.lessonIds.filter(
            (id) => progress.stars[id],
          ).length;
          return (
            <button
              key={world.id}
              className="world-card"
              onClick={() => navigate(`world/${world.id}`)}
              style={{ background: world.color }}
            >
              <span className="world-island-art">
                <NumberCharacter value={i + 1} size={95} expression="excited" />
                <span className="island-shadow" />
              </span>
              <span className="eyebrow">THẾ GIỚI 0{i + 1}</span>
              <h2>{world.title}</h2>
              <p>{world.description}</p>
              <div className="world-card-progress">
                <i style={{ width: `${count * 10}%` }} />
              </div>
              <div className="world-card-footer">
                <span>{count}/10 bài</span>
                <ArrowRight size={20} />
              </div>
            </button>
          );
        })}
      </div>
      <section className="daily-banner">
        <span className="daily-badge">
          <CalendarDays size={35} />
        </span>
        <div>
          <span className="eyebrow">MỘT CHÚT MỖI NGÀY</span>
          <h2>Ba khám phá hôm nay</h2>
          <p>Không cần chuỗi ngày liên tục. Bé chơi khi thấy vui.</p>
          <span className="small">
            {progress.daily[day]?.length ?? 0}/3 khám phá hôm nay
          </span>
        </div>
        <button className="button primary" onClick={() => navigate("daily")}>
          Cùng chơi
          <Play size={18} />
        </button>
      </section>
      <section className="world-hub-actions">
        <button
          className="button secondary"
          onClick={() => navigate("practice")}
        >
          <Sparkles size={19} />
          Luyện theo nhịp của bé
        </button>
        <button
          className="button secondary"
          onClick={() => navigate("notebook")}
        >
          <Layers size={19} />
          Chọn kỹ năng và mức độ
        </button>
        <button
          className="button secondary"
          onClick={() => navigate("playground")}
        >
          <Gamepad2 size={19} />
          Sân chơi tự do
        </button>
      </section>
    </main>
  );
}
