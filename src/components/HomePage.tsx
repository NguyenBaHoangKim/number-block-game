import {
  ArrowRight,
  Play,
  Leaf,
  Sparkles,
  Puzzle,
  Rocket,
  Clock3,
  Check,
  Star,
  BookOpen,
  Heart,
  Search,
  Shapes,
} from "lucide-react";
import { useNarration } from "./NarrationButton";
import { voiceCopy } from "../data/mockData";
import { PlayModes } from "./PlayModes";
import { NumberCharacter } from "./NumberCharacter";
import { homeCopy, learningStages, lessons } from "../data/mockData";
import type { Progress } from "../types/lesson";
export function StageIcon({
  index,
  size = 26,
}: {
  index: number;
  size?: number;
}) {
  if (index === 3) return <Search size={size} />;
  if (index === 4) return <Shapes size={size} />;
  return index === 0 ? (
    <Leaf size={size} />
  ) : index === 1 ? (
    <Puzzle size={size} />
  ) : (
    <Rocket size={size} />
  );
}
export function HeroScene() {
  return (
    <div
      className="hero-scene"
      aria-label="Những người bạn khối số vui chơi trên hòn đảo xanh"
    >
      <svg className="landscape" viewBox="0 0 640 510" aria-hidden="true">
        <defs>
          <linearGradient id="sky" x2="0" y2="1">
            <stop stopColor="#eaf4eb" />
            <stop offset="1" stopColor="#f5f8e9" />
          </linearGradient>
          <linearGradient id="island" x2="0" y2="1">
            <stop stopColor="#b8d7a1" />
            <stop offset="1" stopColor="#88b58b" />
          </linearGradient>
        </defs>
        <path
          d="M88 111C161 21 380 20 508 98S661 348 528 421 136 483 64 349 33 180 88 111"
          fill="url(#sky)"
        />
        <circle cx="487" cy="112" r="37" fill="#f7d67b" />
        <g stroke="#ecc669" strokeWidth="4" strokeLinecap="round">
          <path d="m487 60 0-9m0 113v9m52-61h9m-113 0h-9m98-37 7-7m-81 81-7 7m81-7 7 7m-81-81-7-7" />
        </g>
        <g fill="white" opacity=".9">
          <path
            d="M100 145q-15-21-33-9-12-37-36-13-22-4-23 18Z"
            transform="translate(55 -10)"
          />
          <path
            d="M100 145q-15-21-33-9-12-37-36-13-22-4-23 18Z"
            transform="translate(295 -55) scale(1.1)"
          />
        </g>
        <ellipse cx="324" cy="395" rx="244" ry="55" fill="#d2c7a8" />
        <path d="M80 366q22 82 245 81t244-81Z" fill="#b1c293" />
        <ellipse cx="324" cy="366" rx="244" ry="65" fill="url(#island)" />
        <path
          d="M120 380q85-45 185-12t211-14"
          fill="none"
          stroke="#d1e1b3"
          strokeWidth="23"
          strokeLinecap="round"
        />
        <g fill="#70a67e">
          <ellipse cx="112" cy="326" rx="24" ry="28" />
          <ellipse cx="140" cy="328" rx="20" ry="21" />
          <ellipse cx="535" cy="327" rx="22" ry="28" />
        </g>
        <g stroke="#5f966c" strokeWidth="3" fill="none">
          <path d="M161 391v-23m0 12-9-9m9 4 9-9M481 393v-22m0 12-9-9m9 4 8-8" />
        </g>
        <g fill="#fff9e5">
          <circle cx="160" cy="365" r="8" />
          <circle cx="481" cy="368" r="7" />
        </g>
        <g fill="#edbd55">
          <circle cx="160" cy="365" r="3" />
          <circle cx="481" cy="368" r="3" />
        </g>
      </svg>
      <div className="scene-character scene-two">
        <NumberCharacter
          value={2}
          size={104}
          expression="excited"
          interactive
        />
      </div>
      <div className="scene-character scene-five">
        <NumberCharacter value={5} size={157} interactive />
      </div>
      <div className="scene-character scene-three">
        <NumberCharacter
          value={3}
          size={101}
          expression="excited"
          interactive
        />
      </div>
      <div className="floating-note note-top">
        <Sparkles size={17} /> Học toán là một cuộc vui!
      </div>
      <div className="floating-note note-bottom">
        <span className="mini-star">★</span> Những bạn nhỏ, niềm vui to!
      </div>
      <span className="scene-spark spark-one">✧</span>
      <span className="scene-spark spark-two">+</span>
      <span className="scene-spark spark-three">✦</span>
    </div>
  );
}
export function HomePage({
  progress,
  onMap,
  onStart,
  onLesson,
  onNavigate,
}: {
  progress: Progress;
  onMap: () => void;
  onStart: () => void;
  onLesson: (id: string) => void;
  onNavigate: (route: string) => void;
}) {
  useNarration(voiceCopy.welcome);
  const completed = Object.keys(progress.stars).length;
  const nextLesson = lessons.find((l) => !progress.stars[l.id]) ?? lessons[0];
  return (
    <main className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            {homeCopy.eyebrow}
          </div>
          <h1>
            Chơi cùng <span>khối số.</span>
            <br />
            Lớn cùng <span className="orange-text">niềm vui.</span>
            <svg
              className="title-underline"
              viewBox="0 0 225 15"
              aria-hidden="true"
            >
              <path
                d="M3 10Q110-4 220 7"
                stroke="#e8b66f"
                fill="none"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </h1>
          <p>{homeCopy.description}</p>
          <div className="actions">
            <button className="button primary large" onClick={onStart}>
              <Play size={18} fill="currentColor" />{" "}
              {progress.lastLesson ? "Tiếp tục học" : "Bắt đầu học"}
              <ArrowRight size={19} />
            </button>
            <button className="button plain large" onClick={onMap}>
              Chọn bài học <ArrowRight size={18} />
            </button>
          </div>
          <div className="hero-reassurance">
            <span className="little-faces">
              <i />
              <i />
              <i />
            </span>
            <span>Mỗi ngày một chút, mỗi chút một niềm vui.</span>
          </div>
        </div>
        <HeroScene />
      </section>
      <section className="benefit-strip" aria-label="Đặc điểm">
        <span>
          <span className="benefit-icon green">
            <Leaf size={21} />
          </span>
          {homeCopy.tips[0]}
        </span>
        <span>
          <span className="benefit-icon orange">
            <Puzzle size={21} />
          </span>
          {homeCopy.tips[1]}
        </span>
        <span>
          <span className="benefit-icon purple">
            <Heart size={21} />
          </span>
          {homeCopy.tips[2]}
        </span>
      </section>
      <PlayModes onNavigate={onNavigate} />
      <section className="journey-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CHUYẾN PHIÊU LƯU CỦA BÉ</p>
            <h2>
              Từng bước nhỏ, khám phá lớn <Sparkles size={24} />
            </h2>
          </div>
          <button className="text-button" onClick={onMap}>
            Xem tất cả bài học <ArrowRight size={18} />
          </button>
        </div>
        <div className="stage-grid">
          {learningStages.map((stage, index) => {
            const stageLessons = lessons.filter((l) => l.stageId === stage.id);
            const count = stageLessons.filter(
              (l) => progress.stars[l.id],
            ).length;
            return (
              <button
                className={`stage-card stage-${index}`}
                key={stage.id}
                onClick={() => onMap()}
              >
                <div className="stage-card-top">
                  <span
                    className="stage-icon"
                    style={{ background: stage.color }}
                  >
                    <StageIcon index={index} />
                  </span>
                  <span className="stage-tag">CHẶNG 0{index + 1}</span>
                  <ArrowRight className="card-arrow" size={20} />
                </div>
                <div className="stage-art" aria-hidden="true">
                  {index === 0 ? (
                    <>
                      <NumberCharacter value={1} size={58} />
                      <NumberCharacter value={2} size={60} />
                      <NumberCharacter value={3} size={59} />
                    </>
                  ) : index === 1 ? (
                    <>
                      <NumberCharacter value={2} size={60} />
                      <span>+</span>
                      <NumberCharacter value={3} size={59} />
                      <span>=</span>
                      <NumberCharacter value={5} size={78} />
                    </>
                  ) : (
                    <>
                      <span className="math-symbol">+</span>
                      <NumberCharacter value={4} size={90} />
                      <span className="math-symbol minus">−</span>
                    </>
                  )}
                </div>
                <h3>{stage.title}</h3>
                <p>{stage.subtitle}</p>
                <div className="stage-card-bottom">
                  <span>
                    <BookOpen size={15} />
                    {stageLessons.length} bài học
                  </span>
                  <span>
                    {count > 0 ? (
                      <>
                        <Check size={15} />
                        {count}/{stageLessons.length}
                      </>
                    ) : (
                      "Cùng khám phá"
                    )}
                    <ArrowRight size={15} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
      <section className="continue-banner">
        <span className="continue-icon">
          <Star size={27} />
        </span>
        <div>
          <h3>
            {completed
              ? "Tiếp nối hành trình của bé"
              : "Một cuộc phiêu lưu đang chờ bé!"}
          </h3>
          <p>
            {nextLesson.title} <span>·</span> <Clock3 size={14} />{" "}
            {nextLesson.minutes} phút <span>·</span> Tối đa 3 sao
          </p>
        </div>
        <button
          className="button secondary"
          onClick={() => onLesson(nextLesson.id)}
        >
          Khám phá ngay <ArrowRight size={17} />
        </button>
      </section>
      <div className="kind-note">
        <Heart size={15} /> Không áp lực, không vội vàng. Mỗi bé có một nhịp
        khám phá riêng.
      </div>
    </main>
  );
}
