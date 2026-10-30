import { useState } from "react";
import { RotateCcw, House, Undo2, Redo2 } from "lucide-react";
import { useNarration } from "./NarrationButton";
import { playgroundConfig, voiceCopy } from "../data/mockData";
import { BlockWorkspace } from "./BlockWorkspace";
import { NumberBlock } from "./NumberCharacter";
import { ModeNavigation } from "./PlayModes";
import { playEffect } from "../services/audioService";
import type { Activity, LessonStep } from "../types/lesson";
export function PlaygroundPage({
  onNavigate,
}: {
  onNavigate: (route: string) => void;
}) {
  useNarration(voiceCopy.playground);
  const [tab, setTab] =
    useState<(typeof playgroundConfig.tabs)[number]["id"]>("merge");
  const [a, setA] = useState(2),
    [b, setB] = useState(3);
  const [color, setColor] = useState(playgroundConfig.colors[0]);
  const [tiles, setTiles] = useState<(string | null)[]>(
    Array(playgroundConfig.cols * playgroundConfig.rows).fill(null),
  );
  const [past, setPast] = useState<(string | null)[][]>([]),
    [future, setFuture] = useState<(string | null)[][]>([]);
  const [moving, setMoving] = useState(false),
    [selectedCell, setSelectedCell] = useState<number | null>(null);
  function commit(next: (string | null)[]) {
    setPast((h) => [...h.slice(-29), tiles]);
    setFuture([]);
    setTiles(next);
    setSelectedCell(null);
  }
  const isSplit = tab === "split";
  const first = isSplit ? Math.max(2, a) : a;
  const second = isSplit ? Math.min(b, first - 1) : b;
  const step: LessonStep = {
    id: "free-play",
    type: "interact",
    title: "Sân chơi tự do",
    instruction: "",
    activity: tab === "build" ? "count" : (tab as Activity),
    values: [first, second],
    hint: "",
  };
  function paint(index: number, nextColor: string | null) {
    commit(tiles.map((c, i) => (i === index ? nextColor : c)));
    playEffect("place");
  }
  function drop(index: number, data: string) {
    const match = /^cell:(\d+)$/.exec(data);
    if (match) {
      const source = Number(match[1]);
      if (source >= tiles.length || source === index) return;
      const next = [...tiles];
      [next[index], next[source]] = [next[source], next[index]];
      commit(next);
      playEffect("place");
    } else if (playgroundConfig.colors.includes(data)) paint(index, data);
  }
  const tileCount = tiles.filter(Boolean).length;
  return (
    <main className="page playground-page">
      <ModeNavigation active="playground" onNavigate={onNavigate} />
      <div className="page-heading">
        <span className="pill">Không có đáp án sai · Cứ thử thôi!</span>
        <h1>Xưởng khối số của bé</h1>
        <p>Ghép, tách, cân và xây những điều bé tưởng tượng.</p>
      </div>
      <div className="activity-tabs">
        {playgroundConfig.tabs.map((t) => (
          <button
            key={t.id}
            className={t.id === tab ? "selected" : ""}
            onClick={() => {
              setTab(t.id);
              playEffect("pop");
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <section className="lesson-board sandbox-board">
        {tab !== "build" ? (
          <>
            <div className="sandbox-controls">
              <label>
                {isSplit ? "Nhóm ban đầu" : "Nhóm bên trái"}
                <strong>{first}</strong>
                <input
                  type="range"
                  min={isSplit ? 2 : 1}
                  max="10"
                  value={first}
                  aria-label="Số khối nhóm đầu"
                  onChange={(e) => setA(Number(e.target.value))}
                />
              </label>
              <label>
                {isSplit ? "Số khối tách ra" : "Nhóm bên phải"}
                <strong>{second}</strong>
                <input
                  type="range"
                  min="1"
                  max={isSplit ? first - 1 : 10}
                  value={second}
                  aria-label="Số khối nhóm thứ hai"
                  onChange={(e) => setB(Number(e.target.value))}
                />
              </label>
            </div>
            <BlockWorkspace key={`${tab}-${first}-${second}`} step={step} />
          </>
        ) : (
          <>
            <div className="build-toolbar">
              <div className="color-palette" aria-label="Chọn màu khối">
                {playgroundConfig.colors.map((c, i) => (
                  <button
                    key={c}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", c)}
                    onClick={() => setColor(c)}
                    className={c === color ? "selected" : ""}
                    style={{ background: c }}
                    aria-label={`Chọn màu ${i + 1}`}
                    aria-pressed={color === c}
                  />
                ))}
              </div>
              <div className="actions">
                <button
                  className="text-button"
                  disabled={!past.length}
                  onClick={() => {
                    setFuture((h) => [tiles, ...h]);
                    setTiles(past.at(-1)!);
                    setPast((h) => h.slice(0, -1));
                    setSelectedCell(null);
                  }}
                >
                  <Undo2 size={17} />
                  Hoàn tác
                </button>
                <button
                  className="text-button"
                  disabled={!future.length}
                  onClick={() => {
                    setPast((h) => [...h, tiles]);
                    setTiles(future[0]);
                    setFuture((h) => h.slice(1));
                    setSelectedCell(null);
                  }}
                >
                  <Redo2 size={17} />
                  Làm lại bước
                </button>
                <button
                  className="text-button"
                  aria-pressed={moving}
                  onClick={() => {
                    setMoving((v) => !v);
                    setSelectedCell(null);
                  }}
                >
                  {moving ? "Đang di chuyển" : "Di chuyển khối"}
                </button>
                <button
                  className="text-button"
                  onClick={() => {
                    commit(
                      tiles.map((_, i) =>
                        playgroundConfig.house.includes(i) ? color : null,
                      ),
                    );
                    playEffect("build");
                  }}
                >
                  <House size={17} />
                  Xếp nhà
                </button>
                <button
                  className="text-button"
                  onClick={() => {
                    commit(tiles.map(() => null));
                    playEffect("split");
                  }}
                >
                  <RotateCcw size={17} />
                  Dọn sân
                </button>
              </div>
            </div>
            <div
              className="construction-grid"
              style={{
                gridTemplateColumns: `repeat(${playgroundConfig.cols},1fr)`,
              }}
            >
              {tiles.map((c, i) => (
                <button
                  key={i}
                  className={`construction-cell ${c ? "occupied" : ""} ${selectedCell === i ? "selected" : ""}`}
                  aria-label={`Ô xây dựng ${i + 1}${c ? ", có khối" : ""}`}
                  draggable={Boolean(c)}
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/plain", `cell:${i}`)
                  }
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    drop(i, e.dataTransfer.getData("text/plain"));
                  }}
                  onClick={() => {
                    if (!moving) paint(i, c ? null : color);
                    else if (selectedCell === null && c) setSelectedCell(i);
                    else if (selectedCell !== null)
                      drop(i, `cell:${selectedCell}`);
                  }}
                >
                  {c ? (
                    <svg viewBox="0 0 60 64">
                      <NumberBlock color={c} face={i % 3 === 0} />
                    </svg>
                  ) : (
                    <span>+</span>
                  )}
                </button>
              ))}
            </div>
            <p className="activity-feedback" role="status">
              Bé đã xây bằng {tileCount} khối.
            </p>
            <div className="build-counts">
              {playgroundConfig.colors.map((c) => {
                const n = tiles.filter((t) => t === c).length;
                return n ? (
                  <span key={c}>
                    <i style={{ background: c }} />
                    {n}
                  </span>
                ) : null;
              })}
              {tileCount > 0 && <b>= {tileCount}</b>}
            </div>
            <p className="small center">
              {moving
                ? "Chạm khối cần chuyển, rồi chạm ô muốn đặt."
                : "Chọn màu rồi chạm ô để thêm/bớt. Có thể kéo khối hoặc bật Di chuyển khối."}
            </p>
          </>
        )}
      </section>
    </main>
  );
}
