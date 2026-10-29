import { Blocks, Compass, Zap, ArrowRight } from "lucide-react";
import { playModes } from "../data/mockData";
export function PlayModes({
  onNavigate,
}: {
  onNavigate: (route: string) => void;
}) {
  return (
    <section className="play-modes-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">HÔM NAY BÉ MUỐN CHƠI THẾ NÀO?</p>
          <h2>Ba cách khám phá hòn đảo</h2>
        </div>
      </div>
      <div className="mode-grid">
        {playModes.map((mode, i) => (
          <button
            className={`mode-card mode-${i}`}
            key={mode.id}
            onClick={() => onNavigate(mode.id)}
          >
            <span className="mode-icon">
              {i === 0 ? <Compass /> : i === 1 ? <Blocks /> : <Zap />}
            </span>
            <span className="mode-label">{mode.label}</span>
            <h3>{mode.title}</h3>
            <p>{mode.description}</p>
            <span className="text-button">
              Cùng chơi <ArrowRight size={17} />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
export function ModeNavigation({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate: (route: string) => void;
}) {
  return (
    <div
      className="mode-navigation"
      role="navigation"
      aria-label="Chọn chế độ chơi"
    >
      {playModes.map((mode) => (
        <button
          key={mode.id}
          aria-current={active === mode.id ? "page" : undefined}
          className={active === mode.id ? "selected" : ""}
          onClick={() => onNavigate(mode.id)}
        >
          {mode.title}
        </button>
      ))}
    </div>
  );
}
