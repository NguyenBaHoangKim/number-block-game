import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Star,
  Trophy,
} from "lucide-react";
import { learningStages, lessons, badges, appConfig } from "../data/mockData";
import type { Progress } from "../types/lesson";
import { NumberCharacter } from "./NumberCharacter";
import { StageIcon } from "./HomePage";
export function LearningMap({
  progress,
  onLesson,
  onHome,
}: {
  progress: Progress;
  onLesson: (id: string) => void;
  onHome: () => void;
}) {
  return (
    <main className="page map-page">
      <button className="text-button back-link" onClick={onHome}>
        <ArrowLeft size={17} /> Về trang chủ
      </button>
      <div className="page-heading">
        <span className="pill">
          {lessons.length} bài học · {learningStages.length} chặng khám phá
        </span>
        <h1>Hành trình khối số</h1>
        <p>Chọn một bài bé thích. Những người bạn đang đợi bé!</p>
      </div>
      {learningStages.map((stage, index) => (
        <section className="map-stage" key={stage.id}>
          <div className="map-stage-heading">
            <span className="stage-icon" style={{ background: stage.color }}>
              <StageIcon index={index} />
            </span>
            <div>
              <p className="eyebrow">CHẶNG 0{index + 1}</p>
              <h2>{stage.title}</h2>
            </div>
            <span className="stage-completed">
              {
                lessons.filter(
                  (l) => l.stageId === stage.id && progress.stars[l.id],
                ).length
              }{" "}
              / {lessons.filter((l) => l.stageId === stage.id).length} hoàn
              thành
            </span>
          </div>
          <div className="lesson-grid">
            {lessons
              .filter((l) => l.stageId === stage.id)
              .map((l) => {
                const number = lessons.indexOf(l) + 1;
                const stars = progress.stars[l.id] ?? 0;
                return (
                  <button
                    className={`lesson-card ${stars ? "completed" : ""}`}
                    key={l.id}
                    onClick={() => onLesson(l.id)}
                  >
                    <div
                      className="lesson-card-art"
                      style={{ background: stage.color }}
                    >
                      <NumberCharacter
                        value={Math.min(number, 10)}
                        size={number > 5 ? 65 : 75}
                      />
                      <span className="lesson-number">
                        BÀI {String(number).padStart(2, "0")}
                      </span>
                      {stars > 0 && (
                        <span className="completed-mark">
                          <Check size={16} />
                        </span>
                      )}
                    </div>
                    <h3>{l.title}</h3>
                    <p>{l.description}</p>
                    <span className="lesson-difficulty">
                      Cấp {l.difficulty} ·{" "}
                      {l.difficulty >= 4
                        ? "Thử sức cùng người lớn"
                        : "Khám phá theo nhịp bé"}
                    </span>
                    <div className="lesson-card-bottom">
                      <span>
                        <Clock3 size={14} />
                        {l.minutes} phút
                      </span>
                      {stars > 0 ? (
                        <span className="star-row" aria-label={`${stars} sao`}>
                          {[1, 2, 3].map((n) => (
                            <Star
                              key={n}
                              size={15}
                              fill={n <= stars ? "#dfad3f" : "none"}
                              color={n <= stars ? "#bf8c23" : "#b5b9b0"}
                            />
                          ))}
                        </span>
                      ) : (
                        <span>
                          {progress.lastLesson === l.id
                            ? "Đang học"
                            : "Khám phá"}
                          <ArrowRight size={15} />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        </section>
      ))}
    </main>
  );
}
export function ProgressPage({
  progress,
  onMap,
}: {
  progress: Progress;
  onMap: () => void;
}) {
  const count = Object.keys(progress.stars).length;
  const stars = Object.values(progress.stars).reduce((a, b) => a + b, 0);
  return (
    <main className="page progress-page">
      <div className="page-heading">
        <span className="pill">Mỗi cố gắng đều tỏa sáng</span>
        <h1>Khu vườn thành tích</h1>
        <p>Nhìn xem bé đã đi được xa thế nào rồi!</p>
      </div>
      <div className="stats-grid">
        <div>
          <Star size={32} />
          <strong>
            {stars}
            <small> / {lessons.length * appConfig.maxStars}</small>
          </strong>
          <span>Ngôi sao đã nhận</span>
        </div>
        <div>
          <Check size={32} />
          <strong>
            {count}
            <small> / {lessons.length}</small>
          </strong>
          <span>Bài học hoàn thành</span>
        </div>
        <div>
          <Trophy size={32} />
          <strong>
            {badges.filter((b) => count >= b.required).length}
            <small> / {badges.length}</small>
          </strong>
          <span>Huy hiệu khám phá</span>
        </div>
      </div>
      <div className="practice-stats">
        <strong>Thử thách nhanh</strong>
        <span>
          Kỷ lục: {progress.practice.quickBest}/5 câu · Đã chơi{" "}
          {progress.practice.rounds} vòng
        </span>
      </div>
      <h2 className="center">Bộ sưu tập huy hiệu</h2>
      <div className="badge-grid">
        {badges.map((b, i) => (
          <div
            className={`badge-card ${count >= b.required ? "unlocked" : ""}`}
            key={b.id}
          >
            <div className="badge-medal">
              <StageIcon index={i} size={40} />
            </div>
            <h3>{b.title}</h3>
            <p>{b.description}</p>
            <span className="pill">
              {count >= b.required
                ? "Đã đạt được!"
                : `${count} / ${b.required} bài`}
            </span>
          </div>
        ))}
      </div>
      <div className="center">
        <button className="button primary" onClick={onMap}>
          Tiếp tục khám phá <ArrowRight size={18} />
        </button>
      </div>
    </main>
  );
}
