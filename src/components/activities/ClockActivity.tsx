import { useState } from "react";
import type { WorkspaceProps } from "./types";
import { playEffect } from "../../services/audioService";
export function ClockActivity({ step, onReady }: WorkspaceProps) {
  const target = step.values[0];
  const [hour, setHour] = useState(step.type === "quiz" ? target : 12);
  return (
    <div className="clock-workspace">
      <svg
        className="learning-clock"
        viewBox="0 0 220 220"
        role="img"
        aria-label={`Đồng hồ chỉ ${hour} giờ`}
      >
        <circle cx="110" cy="110" r="103" fill="#f8edd1" />
        <circle
          cx="110"
          cy="110"
          r="93"
          fill="#fffefa"
          stroke="#e2c98d"
          strokeWidth="2"
        />
        {Array.from({ length: 12 }, (_, i) => {
          const n = i + 1,
            angle = ((n * 30 - 90) * Math.PI) / 180;
          return (
            <text
              key={n}
              x={110 + 75 * Math.cos(angle)}
              y={116 + 75 * Math.sin(angle)}
              textAnchor="middle"
              fontSize="17"
              fontWeight="800"
              fill="#6d8058"
            >
              {n}
            </text>
          );
        })}
        <path
          d="M110 110V47"
          stroke="#a2b594"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <g
          className="hour-hand"
          style={{
            transform: `rotate(${hour * 30}deg)`,
            transformOrigin: "110px 110px",
          }}
        >
          <path
            d="M110 110V66"
            stroke="#ce9652"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </g>
        <circle cx="110" cy="110" r="7" fill="#cf9b58" />
      </svg>
      {step.type !== "quiz" && (
        <>
          <label className="clock-control">
            Chọn giờ: <b>{hour} giờ</b>
            <input
              type="range"
              aria-label="Chọn giờ trên đồng hồ"
              min="1"
              max="12"
              value={hour}
              onChange={(e) => {
                const n = Number(e.target.value);
                setHour(n);
                playEffect("tick");
                onReady?.(n === target);
                if (n === target) {
                  playEffect("correct");
                }
              }}
            />
          </label>
          <div className="clock-presets">
            {[3, 6, 9, 12].map((n) => (
              <button
                key={n}
                onClick={() => {
                  setHour(n);
                  playEffect("tick");
                  onReady?.(n === target);
                }}
              >
                {n} giờ
              </button>
            ))}
          </div>
        </>
      )}
      <p className="activity-feedback">
        Kim dài ở 12, kim ngắn ở {hour}: {hour} giờ đúng.
      </p>
    </div>
  );
}
