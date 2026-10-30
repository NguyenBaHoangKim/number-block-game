import { version } from "../package.json";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  BookOpen,
  ChevronRight,
  Compass,
  Home,
  Settings2,
  Star,
  Trophy,
  Volume2,
  VolumeX,
  Heart,
  Gamepad2,
} from "lucide-react";
import { appConfig, lessons } from "./data/mockData";
import { HomePage } from "./components/HomePage";
import { LearningMap, ProgressPage } from "./components/LearningMap";
import { LessonPlayer } from "./components/LessonPlayer";
import { PlaygroundPage } from "./components/PlaygroundPage";
import { QuickChallengePage } from "./components/QuickChallengePage";
import { SettingsDialog } from "./components/SettingsDialog";
import {
  awardStars,
  emptyProgress,
  loadProgress,
  saveProgress,
} from "./services/progressStorage";
import {
  disposeAudio,
  initializeAudio,
  pauseAudio,
  setEffectsEnabled,
  setMasterVolume,
  setMusicEnabled,
  setAudioMood,
  setBackgroundAudioEnabled,
} from "./services/audioService";
import {
  unlockNarration,
  setNarrationEnabled,
  setNarrationVolume,
  stopNarration,
  setBackgroundNarrationEnabled,
} from "./services/narrationService";
import type { Progress } from "./types/lesson";
import {
  totalLearningStars,
  resetLearningProgress,
} from "./services/learningStorage";
const ExpansionApp = lazy(() => import("./features/worlds/ExpansionApp"));
const getRoute = () => window.location.hash.slice(1) || "home";
export default function App() {
  const [learningStars, setLearningStars] = useState(totalLearningStars);
  useEffect(() => {
    const refresh = () => setLearningStars(totalLearningStars());
    window.addEventListener("number-block-learning-changed", refresh);
    return () =>
      window.removeEventListener("number-block-learning-changed", refresh);
  }, []);
  const [route, setRoute] = useState(getRoute);
  const [progress, setProgress] = useState(loadProgress);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [replay, setReplay] = useState(0);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const started = useRef(false);
  const navigate = (page: string) => {
    window.location.assign(`#${page}`);
  };
  useEffect(() => {
    const update = () => {
      setRoute(getRoute());
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);
  useEffect(() => {
    setBackgroundAudioEnabled(progress.settings.background);
    setBackgroundNarrationEnabled(progress.settings.background);
    setNarrationEnabled(progress.settings.voice);
    setNarrationVolume(progress.settings.volume);
    setEffectsEnabled(progress.settings.effects);
    setMasterVolume(progress.settings.volume);
    setMusicEnabled(progress.settings.music);
  }, [progress.settings]);
  useEffect(() => {
    const visibility = () => {
      if (document.hidden && !progress.settings.background) {
        pauseAudio();
        stopNarration();
      } else if (started.current) {
        void initializeAudio();
        unlockNarration();
      }
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [progress.settings.background]);
  useEffect(
    () => () => {
      stopNarration();
      disposeAudio();
    },
    [],
  );
  const activateAudio = () => {
    unlockNarration();
    started.current = true;
    void initializeAudio().then((ok) => setAudioUnavailable(!ok));
  };
  function openLesson(id: string) {
    setProgress((p) => ({ ...p, lastLesson: id }));
    navigate(`play/${id}`);
  }
  function changeSettings(settings: Progress["settings"]) {
    activateAudio();
    setProgress((p) => ({ ...p, settings }));
  }
  useEffect(() => {
    setAudioMood(
      route.startsWith("play/") ||
        route.startsWith("learn/") ||
        route.startsWith("practice") ||
        route === "daily"
        ? "lesson"
        : route === "challenge"
          ? "challenge"
          : route === "playground"
            ? "playground"
            : "lobby",
    );
  }, [route]);
  const saveChallenge = useCallback(
    (score: number, length = 5) =>
      setProgress((p) => ({
        ...p,
        practice: {
          ...p.practice,
          quickBest:
            length === 5
              ? Math.max(p.practice.quickBest, score)
              : p.practice.quickBest,
          ...(length !== 5
            ? {
                bestByLength: {
                  ...p.practice.bestByLength,
                  [length]: Math.max(
                    p.practice.bestByLength?.[length] ?? 0,
                    score,
                  ),
                },
              }
            : {}),
          rounds: p.practice.rounds + 1,
        },
      })),
    [],
  );
  const soundEnabled =
    progress.settings.effects ||
    progress.settings.music ||
    progress.settings.voice;
  const stars =
    Object.values(progress.stars).reduce((sum, n) => sum + n, 0) +
    learningStars;
  const lesson = lessons.find((l) => `play/${l.id}` === route);
  return (
    <div
      className="app"
      onPointerDown={activateAudio}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") activateAudio();
      }}
    >
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Đến nội dung chính
      </a>
      <header className="site-header">
        <div className="header-inner">
          <button
            className="brand"
            onClick={() => navigate("home")}
            aria-label="Đảo Khối Số, trang chủ"
          >
            <span className="brand-mark">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span>
              {appConfig.name}
              <small>{appConfig.tagline}</small>
            </span>
          </button>
          <nav aria-label="Điều hướng chính">
            <button
              className={route === "home" ? "active" : ""}
              onClick={() => navigate("home")}
            >
              <Home size={17} />
              Trang chủ
            </button>
            <button
              className={route === "map" || lesson ? "active" : ""}
              onClick={() => navigate("map")}
            >
              <Compass size={18} />
              Bài học
            </button>
            <button
              className={route === "progress" ? "active" : ""}
              onClick={() => navigate("progress")}
            >
              <Trophy size={17} />
              Thành tích
            </button>
            <button
              className={
                route === "playground" || route === "challenge" ? "active" : ""
              }
              onClick={() => navigate("playground")}
            >
              <Gamepad2 size={18} />
              Sân chơi
            </button>
          </nav>
          <div className="header-controls">
            <button
              className="star-counter"
              onClick={() => navigate("progress")}
              aria-label={`${stars} sao, xem thành tích`}
            >
              <Star size={19} fill="#efc565" />
              {stars}
              <span>sao</span>
            </button>
            <span className="header-divider" />
            <button
              className="icon-button sound-toggle"
              onClick={() =>
                changeSettings({
                  ...progress.settings,
                  effects: !soundEnabled,
                  music: !soundEnabled,
                  voice: !soundEnabled,
                })
              }
              aria-label={
                soundEnabled ? "Tắt tất cả âm thanh" : "Bật tất cả âm thanh"
              }
              aria-pressed={soundEnabled}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              className="icon-button"
              onClick={() => setSettingsOpen(true)}
              aria-label="Mở cài đặt âm thanh"
            >
              <Settings2 size={21} />
            </button>
          </div>
        </div>
      </header>
      <div id="main-content" tabIndex={-1}>
        {route === "worlds" ||
        route.startsWith("world/") ||
        route.startsWith("learn/") ||
        route.startsWith("practice") ||
        ["daily", "notebook", "collection"].includes(route) ? (
          <Suspense
            fallback={
              <main className="page empty-state">
                <p>Đang mở hòn đảo…</p>
              </main>
            }
          >
            <ExpansionApp route={route} navigate={navigate} />
          </Suspense>
        ) : route === "home" ? (
          <HomePage
            progress={progress}
            onMap={() => navigate("map")}
            onStart={() =>
              progress.lastLesson
                ? openLesson(progress.lastLesson)
                : navigate("map")
            }
            onLesson={openLesson}
            onNavigate={navigate}
          />
        ) : route === "map" ? (
          <LearningMap
            progress={progress}
            onLesson={openLesson}
            onHome={() => navigate("home")}
          />
        ) : route === "progress" ? (
          <ProgressPage progress={progress} onMap={() => navigate("map")} />
        ) : route === "playground" ? (
          <PlaygroundPage onNavigate={navigate} />
        ) : route === "challenge" ? (
          <QuickChallengePage
            onNavigate={navigate}
            best={progress.practice.quickBest}
            bestByLength={progress.practice.bestByLength}
            onComplete={saveChallenge}
          />
        ) : lesson ? (
          <LessonPlayer
            key={`${lesson.id}-${replay}`}
            lesson={lesson}
            onExit={() => navigate("map")}
            onComplete={(n) => setProgress((p) => awardStars(p, lesson.id, n))}
            onNext={() =>
              openLesson(
                lessons[lessons.indexOf(lesson) + 1]?.id ?? lessons[0].id,
              )
            }
            onReplay={() => setReplay((n) => n + 1)}
            hasNext={lessons.indexOf(lesson) < lessons.length - 1}
          />
        ) : (
          <main className="page empty-state">
            <Compass size={48} />
            <h1>Hình như bé đi lạc một chút!</h1>
            <p>Quay lại hòn đảo và chọn một bài học nhé.</p>
            <button className="button primary" onClick={() => navigate("map")}>
              Về bản đồ <ChevronRight size={18} />
            </button>
          </main>
        )}
      </div>
      <footer className="site-footer">
        <div>
          <span className="footer-brand">
            <BookOpen size={17} /> Đảo Khối Số
          </span>
          <span>Một thế giới nhỏ. Vạn điều hay.</span>
        </div>
        <span>
          Được làm bằng <Heart size={13} /> cho những trí tò mò nhỏ.
        </span>
        <small className="footer-version">Version {version}</small>
      </footer>
      {settingsOpen && (
        <SettingsDialog
          settings={progress.settings}
          onClose={() => setSettingsOpen(false)}
          onChange={changeSettings}
          onReset={() => {
            resetLearningProgress();
            setProgress((p) => ({ ...emptyProgress(), settings: p.settings }));
            setReplay((n) => n + 1);
            navigate("home");
          }}
        />
      )}
      {audioUnavailable &&
        (progress.settings.music || progress.settings.effects) && (
          <div className="audio-notice" role="status">
            Trình duyệt chưa bật âm thanh. Bé vẫn có thể học bình thường.
            <button className="text-button" onClick={activateAudio}>
              Thử bật lại
            </button>
            <button
              className="text-button"
              onClick={() =>
                changeSettings({
                  ...progress.settings,
                  effects: false,
                  music: false,
                })
              }
            >
              Tắt âm thanh
            </button>
          </div>
        )}
    </div>
  );
}
