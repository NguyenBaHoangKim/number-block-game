import type { Shape, Solid, Rule } from "../types";
import {
  NumberBlock,
  NumberCharacter,
  colorFor,
} from "../../../components/NumberCharacter";
import { days, shapeNames, solidNames } from "../catalog";
export function ShapePicture({
  shape,
  color = "#e7b95d",
  rotation = 0,
  polygon,
}: {
  shape: Shape;
  color?: string;
  rotation?: number;
  polygon?: [number, number][];
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio={polygon ? "none" : "xMidYMid meet"}
      role="img"
      aria-label={shapeNames[shape]}
    >
      <g transform={`rotate(${rotation} 50 50)`}>
        {polygon ? (
          <polygon
            points={polygon.map((p) => p.join(",")).join(" ")}
            fill={color}
          />
        ) : shape === "circle" ? (
          <circle cx="50" cy="50" r="42" fill={color} />
        ) : shape === "triangle" ? (
          <path d="M50 7 94 91H6Z" fill={color} />
        ) : shape === "parallelogram" ? (
          <path d="M27 10h66L73 90H7Z" fill={color} />
        ) : shape === "half" ? (
          <path d="M50 7a43 43 0 0 0 0 86Z" fill={color} />
        ) : shape === "quarter" ? (
          <path d="M10 90V10a80 80 0 0 1 80 80Z" fill={color} />
        ) : (
          <rect
            x="8"
            y={shape === "rectangle" ? 23 : 8}
            width="84"
            height={shape === "rectangle" ? 54 : 84}
            rx="5"
            fill={color}
          />
        )}
      </g>
    </svg>
  );
}
export function SolidPicture({ solid }: { solid: Solid }) {
  const id = `solid-${solid}`;
  return (
    <svg viewBox="0 0 150 130" role="img" aria-label={solidNames[solid]}>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor="#d6e8ca" />
          <stop offset="1" stopColor="#76a283" />
        </radialGradient>
      </defs>
      {solid === "sphere" ? (
        <circle cx="75" cy="65" r="52" fill={`url(#${id})`} />
      ) : solid === "cone" ? (
        <>
          <path d="M75 8 132 113H18Z" fill="#e8c06b" />
          <ellipse cx="75" cy="112" rx="57" ry="12" fill="#cda24f" />
        </>
      ) : solid === "cylinder" ? (
        <>
          <path d="M25 28h100v77H25Z" fill="#91a4d4" />
          <ellipse cx="75" cy="105" rx="50" ry="17" fill="#748bc1" />
          <ellipse cx="75" cy="28" rx="50" ry="17" fill="#bdc8e6" />
        </>
      ) : (
        <g
          transform={
            solid === "cuboid" ? "translate(-6 10) scale(1.1 .8)" : undefined
          }
        >
          <path d="M20 36 68 10 128 35 80 62Z" fill="#b9cfa8" />
          <path d="M20 36v63l60 26V62Z" fill="#83ac80" />
          <path d="M80 62v63l48-27V35Z" fill="#639268" />
        </g>
      )}
    </svg>
  );
}
export function Blocks({
  count,
  color,
  small = false,
}: {
  count: number;
  color?: string;
  small?: boolean;
}) {
  return (
    <div
      className={`exercise-blocks ${small ? "small-blocks" : ""}`}
      aria-label={`${count} khối`}
    >
      {count === 0 ? (
        <span className="empty-quantity">0 · Nhóm trống</span>
      ) : (
        Array.from({ length: Math.min(count, 40) }, (_, i) => (
          <svg key={i} viewBox="0 0 60 64">
            <NumberBlock color={color ?? colorFor(count)} face={i === 0} />
          </svg>
        ))
      )}
    </div>
  );
}
export function FractionCircle({
  numerator,
  denominator,
  onSelect,
  selected,
}: {
  numerator: number;
  denominator: number;
  onSelect?: (i: number) => void;
  selected?: number[];
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label={`${numerator} phần ${denominator}`}
      className="fraction-circle"
    >
      {Array.from({ length: denominator }, (_, i) => {
        const start = -Math.PI / 2 + (i * 2 * Math.PI) / denominator,
          end = start + (2 * Math.PI) / denominator;
        const path = `M60 60 L${60 + 52 * Math.cos(start)} ${60 + 52 * Math.sin(start)} A52 52 0 ${denominator === 1 ? 1 : 0} 1 ${60 + 52 * Math.cos(end)} ${60 + 52 * Math.sin(end)}Z`;
        const active = selected ? selected.includes(i) : i < numerator;
        return (
          <path
            key={i}
            d={path}
            fill={active ? "#e5b865" : "#f6f4e9"}
            stroke="#a28e5e"
            strokeWidth="2"
            onClick={() => onSelect?.(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.(i);
              }
            }}
            role={onSelect ? "button" : undefined}
            tabIndex={onSelect ? 0 : undefined}
            aria-label={onSelect ? `Phần bánh ${i + 1}` : undefined}
            aria-pressed={onSelect ? active : undefined}
          />
        );
      })}
    </svg>
  );
}
export function ClockPicture({
  hour,
  minute,
}: {
  hour: number;
  minute: number;
}) {
  return (
    <svg
      viewBox="0 0 220 220"
      className="exercise-clock"
      role="img"
      aria-label={`Đồng hồ ${hour}:${String(minute).padStart(2, "0")}`}
    >
      <circle cx="110" cy="110" r="102" fill="#f5e8c7" />
      <circle cx="110" cy="110" r="92" fill="#fffefa" />
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1,
          a = ((n * 30 - 90) * Math.PI) / 180;
        return (
          <text
            key={n}
            x={110 + 74 * Math.cos(a)}
            y={116 + 74 * Math.sin(a)}
            textAnchor="middle"
            fontSize="17"
            fontWeight="800"
            fill="#536b4b"
          >
            {n}
          </text>
        );
      })}
      <g transform={`rotate(${hour * 30 + minute * 0.5} 110 110)`}>
        <path
          d="M110 110V65"
          stroke="#cc914f"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </g>
      <g transform={`rotate(${minute * 6} 110 110)`}>
        <path
          d="M110 110V43"
          stroke="#7c9d76"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <circle cx="110" cy="110" r="7" fill="#8f7953" />
    </svg>
  );
}
function NumberLine({
  a,
  b,
  target,
}: {
  a: number;
  b: number;
  target?: number;
}) {
  const end = Math.max(a, b, target ?? 0) + 2,
    start = Math.max(0, Math.min(a, b) - 1),
    numbers = Array.from({ length: end - start + 1 }, (_, i) => i + start);
  return (
    <div className="math-numberline">
      {numbers.map((n) => (
        <span
          key={n}
          className={
            n === target ? "target" : n === a || n === b ? "marked" : ""
          }
        >
          <i />
          {n}
        </span>
      ))}
    </div>
  );
}
export function RuleVisual({
  rule,
  revealed = false,
}: {
  rule: Rule;
  revealed?: boolean;
}) {
  switch (rule.kind) {
    case "arithmetic":
      return (
        <div className={`arithmetic-visual ${revealed ? "revealed" : ""}`}>
          <div>
            <Blocks count={rule.a} />
            <strong>{rule.a}</strong>
          </div>
          <b className="math-operator">
            {rule.ask === "operator" ? "?" : rule.op === "-" ? "−" : rule.op}
          </b>
          <div className={rule.op === "-" ? "removed-group" : ""}>
            {rule.ask === "missing" ? (
              <span className="math-unknown">?</span>
            ) : (
              <Blocks count={rule.b} />
            )}
            <strong>{rule.ask === "missing" ? "?" : rule.b}</strong>
          </div>
          {rule.ask === "repair" && (
            <b className="math-claim">= {rule.claimed} ?</b>
          )}
        </div>
      );
    case "quantity_compare":
      return (
        <>
          <div className="ex-side-labels">
            <b>Bên trái</b>
            <b>Bên phải</b>
          </div>
          <RuleVisual
            rule={{ kind: "relation", a: rule.a, b: rule.b }}
            revealed={revealed}
          />
        </>
      );
    case "relation":
      return (
        <div className="comparison-model">
          <div
            className="comparison-groups"
            style={{
              transform: `rotate(${revealed ? Math.max(-8, Math.min(8, (rule.b - rule.a) * 2)) : 0}deg)`,
            }}
          >
            <div>
              <Blocks count={rule.a} />
              <b>{rule.a}</b>
            </div>
            <div>
              <Blocks count={rule.b} />
              <b>{rule.b}</b>
            </div>
          </div>
          <span className="comparison-beam" />
          <span className="comparison-pivot" />
        </div>
      );
    case "balance":
      return (
        <div className="balance-equation">
          <span>
            {rule.a} + {rule.b}
          </span>
          <b>=</b>
          <span>
            <i>?</i> + {rule.c}
          </span>
          <div className="balance-demo">
            <Blocks count={rule.a + rule.b} small />
          </div>
        </div>
      );
    case "closest":
      return (
        <>
          <p className="visual-label">
            Ngôi sao mục tiêu: <b>{rule.target}</b>
          </p>
          <NumberLine
            a={Math.min(...rule.candidates)}
            b={Math.max(...rule.candidates)}
            target={rule.target}
          />
        </>
      );
    case "neighbor":
      return (
        <div className="neighbor-model">
          <span>{rule.direction === -1 ? "?" : rule.n - 1}</span>
          <strong>{rule.n}</strong>
          <span>{rule.direction === 1 ? "?" : rule.n + 1}</span>
        </div>
      );
    case "distance":
      return (
        <>
          <NumberLine a={rule.a} b={rule.b} />
          <p className="small center">
            Đếm đoạn giữa hai vạch, mỗi đoạn là một bước.
          </p>
        </>
      );
    case "pattern":
      return (
        <div className="sequence-model">
          {rule.sequence.map((n, i) => (
            <div key={i}>
              {typeof n === "number" ? (
                <>
                  <Blocks count={n} small />
                  <b>{n}</b>
                </>
              ) : (
                <span className={`pattern-symbol symbol-${n}`} aria-label={n}>
                  {n === "Đỏ" ? "●" : n === "Vàng" ? "★" : n}
                </span>
              )}
            </div>
          ))}
          <span className="math-unknown">?</span>
        </div>
      );
    case "chain":
      return (
        <div className="chain-model">
          <b>{rule.start}</b>
          {rule.operations.map((o, i) => (
            <span key={i}>
              →{" "}
              <strong>
                {o.op}
                {o.value}
              </strong>
            </span>
          ))}
          <span>→ ?</span>
        </div>
      );
    case "estimate":
      return (
        <div className="estimate-model">
          <b>{rule.a}</b>
          <span>+</span>
          <b>{rule.b}</b>
          <span>≈ ?</span>
          <p>Chọn mốc chục gần nhất trong các lựa chọn.</p>
        </div>
      );
    case "shape":
      return (
        <div className="large-shape">
          <ShapePicture shape={rule.shape} />
        </div>
      );
    case "solid":
      return (
        <div className="large-shape">
          <SolidPicture solid={rule.solid} />
        </div>
      );
    case "measure":
      return (
        <div className="measure-model">
          {rule.quantities.map((n, i) => (
            <div key={i}>
              <b>Vật {i + 1}</b>
              {rule.axis === "capacity" ? (
                <div className="measure-cup">
                  <i
                    style={{
                      height: `${(n / Math.max(...rule.quantities)) * 80}%`,
                    }}
                  />
                  <strong>{n}</strong>
                </div>
              ) : rule.axis === "weight" ? (
                <div className="weight-object">
                  <ShapePicture
                    shape={i ? "circle" : "square"}
                    color={i ? "#e5bc65" : "#8b9be5"}
                  />
                  <span>{n} đơn vị cân</span>
                </div>
              ) : (
                <Blocks count={n} small />
              )}
            </div>
          ))}
        </div>
      );
    case "money":
      return (
        <div className="shop-model">
          <div className="toy-coin">
            {rule.budget}
            <small>xu đồ chơi</small>
          </div>
          {rule.ask === "change" && (
            <div className="shop-price">
              <ShapePicture shape="triangle" />
              <b>Giá: {rule.price} xu</b>
            </div>
          )}
        </div>
      );
    case "calendar":
      return (
        <div className="calendar-model">
          {days.map((day, i) => (
            <span key={day} className={i === rule.day ? "today" : ""}>
              {day}
              {i === rule.day && <small>Hôm nay</small>}
            </span>
          ))}
        </div>
      );
    case "clock":
      return (
        <div className="clock-model">
          <ClockPicture hour={rule.hour} minute={rule.minute} />
          {rule.elapsed !== undefined && (
            <>
              <span>→</span>
              <ClockPicture
                hour={((rule.hour + rule.elapsed - 1) % 12) + 1}
                minute={rule.minute}
              />
            </>
          )}
        </div>
      );
    case "odd":
      return (
        <div className="odd-model">
          {rule.items.map((item, i) => (
            <div key={i}>
              <ShapePicture shape={item.shape} color={item.color} />
              <b>Vật {i + 1}</b>
            </div>
          ))}
        </div>
      );
    case "constraints":
      return (
        <div className="constraint-cards">
          <span>Lớn hơn {rule.min}</span>
          <span>Nhỏ hơn {rule.max}</span>
          {rule.parity && <span>{rule.parity === "even" ? "Chẵn" : "Lẻ"}</span>}
          <p>Chọn tất cả số thỏa các thẻ điều kiện.</p>
        </div>
      );
    case "claims":
      return (
        <div className="claims-model">
          {rule.claims.map((c, i) => (
            <div key={c.id}>
              <NumberCharacter value={i + 1} />
              <b>{c.id}</b>
              <span>
                {c.a} {c.relation} {c.b}
              </span>
            </div>
          ))}
        </div>
      );
    case "code":
      return (
        <div className="code-model">
          <div>
            {rule.codes.map((c) => (
              <span key={c.symbol}>
                {c.symbol} = {c.value}
              </span>
            ))}
          </div>
          <strong>{rule.symbols.join(` ${rule.op} `)} = ?</strong>
        </div>
      );
    case "hidden":
      return (
        <div className="hidden-model">
          {[...rule.rows, [rule.a, rule.b, "?"]].map((row, i) => (
            <div key={i}>
              {row.map((n, j) => (
                <span key={j}>{n}</span>
              ))}
            </div>
          ))}
        </div>
      );
    case "fraction_compare":
      return (
        <div className="fraction-comparison">
          <div>
            <FractionCircle
              numerator={rule.left[0]}
              denominator={rule.left[1]}
            />
            <b>{rule.left.join("/")}</b>
          </div>
          <span>?</span>
          <div>
            <FractionCircle
              numerator={rule.right[0]}
              denominator={rule.right[1]}
            />
            <b>{rule.right.join("/")}</b>
          </div>
        </div>
      );
    case "chart":
      return (
        <div className="chart-model">
          <div className="chart-bars">
            {rule.bars.map((bar, i) => (
              <div key={bar.label}>
                <strong>{bar.value}</strong>
                <span
                  style={{
                    height: `${(bar.value / Math.max(...rule.bars.map((b) => b.value))) * 140}px`,
                    background: colorFor(i + 1),
                  }}
                />
                <b>{bar.label}</b>
                {rule.additional && <small>Thêm {rule.additional[i]}</small>}
              </div>
            ))}
          </div>
          {rule.ask === "difference" && (
            <p className="small center">So sánh độ cao cột Chuối và Táo.</p>
          )}
        </div>
      );
  }
}

export function Flower({ counted = false }: { counted?: boolean }) {
  return (
    <svg viewBox="0 0 60 64" aria-hidden="true">
      <path
        d="M30 58V30m0 18q-15-13-16-4 2 11 16 9m0-8q14-13 17-6-1 12-17 14"
        stroke="#6f995e"
        strokeWidth="3"
        fill="#a5c489"
      />
      {Array.from({ length: 6 }, (_, i) => (
        <ellipse
          key={i}
          cx="30"
          cy="13"
          rx="7"
          ry="11"
          fill={counted ? "#e8b653" : "#dc9cb6"}
          transform={`rotate(${i * 60} 30 25)`}
        />
      ))}
      <circle cx="30" cy="25" r="9" fill="#f7df8a" />
      {counted && (
        <path
          d="m24 25 4 4 8-9"
          fill="none"
          stroke="#567747"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
export function AnimalPicture({
  animal,
}: {
  animal: "fish" | "rabbit" | "bird";
}) {
  return (
    <svg
      viewBox="0 0 100 90"
      role="img"
      aria-label={
        animal === "fish" ? "Cá" : animal === "rabbit" ? "Thỏ" : "Chim"
      }
    >
      {animal === "fish" ? (
        <>
          <path d="M66 43 91 22v45Z" fill="#85b8c6" />
          <ellipse cx="42" cy="45" rx="31" ry="23" fill="#a6d6dc" />
          <path d="m37 24 15-12 8 22m-22 29 18 12-1-19" fill="#78aebb" />
          <circle cx="25" cy="39" r="4" fill="#3c626b" />
          <path
            d="M17 50q6 6 12 0"
            stroke="#477e85"
            fill="none"
            strokeWidth="2"
          />
        </>
      ) : animal === "rabbit" ? (
        <>
          <ellipse
            cx="34"
            cy="22"
            rx="10"
            ry="22"
            fill="#e0b2c6"
            transform="rotate(-15 34 22)"
          />
          <ellipse
            cx="64"
            cy="22"
            rx="10"
            ry="22"
            fill="#e0b2c6"
            transform="rotate(15 64 22)"
          />
          <circle cx="49" cy="56" r="31" fill="#f1d6df" />
          <circle cx="36" cy="51" r="4" fill="#755366" />
          <circle cx="62" cy="51" r="4" fill="#755366" />
          <path d="m45 62 5 5 5-5Z" fill="#cf8daa" />
          <path
            d="M39 72q10 10 20 0"
            fill="none"
            stroke="#b7829a"
            strokeWidth="2"
          />
        </>
      ) : (
        <>
          <ellipse cx="50" cy="48" rx="30" ry="28" fill="#ebcb7d" />
          <path d="M36 37q30 0 16 28-30 1-16-28" fill="#d8ac52" />
          <circle cx="68" cy="36" r="4" fill="#856b3b" />
          <path d="m76 43 19 7-19 8Z" fill="#cf9650" />
          <path
            d="m38 75-4 10m24-10 4 10"
            stroke="#b28c42"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
