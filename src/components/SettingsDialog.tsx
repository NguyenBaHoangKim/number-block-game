import { useEffect, useRef, useState } from "react";
import {
  Music2,
  Volume2,
  Speech,
  AppWindow,
  X,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import type { Progress } from "../types/lesson";
export function SettingsDialog({
  settings,
  onChange,
  onClose,
  onReset,
}: {
  settings: Progress["settings"];
  onChange: (settings: Progress["settings"]) => void;
  onClose: () => void;
  onReset: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [confirm, setConfirm] = useState(false);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="settings-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) {
          const r = ref.current.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
      aria-labelledby="settings-title"
    >
      <div className="dialog-heading">
        <h2 id="settings-title">
          <SlidersHorizontal size={23} /> Cài đặt của bé
        </h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Đóng cài đặt"
        >
          <X size={22} />
        </button>
      </div>
      <p>Chọn âm thanh theo cách bé thích.</p>
      <label className="setting-row">
        <span>
          <Speech size={21} />
          Giọng hướng dẫn tiếng Việt
        </span>
        <input
          type="checkbox"
          className="switch"
          checked={settings.voice}
          onChange={(e) => onChange({ ...settings, voice: e.target.checked })}
        />
      </label>
      <label className="setting-row">
        <span>
          <Volume2 size={21} />
          Hiệu ứng âm thanh
        </span>
        <input
          type="checkbox"
          className="switch"
          checked={settings.effects}
          onChange={(e) => onChange({ ...settings, effects: e.target.checked })}
        />
      </label>
      <label className="setting-row">
        <span>
          <Music2 size={21} />
          Nhạc nền
        </span>
        <input
          type="checkbox"
          className="switch"
          checked={settings.music}
          onChange={(e) => onChange({ ...settings, music: e.target.checked })}
        />
      </label>
      <label className="setting-row">
        <span>
          <AppWindow size={21} />
          Tiếp tục phát khi chuyển tab
        </span>
        <input
          type="checkbox"
          className="switch"
          checked={settings.background}
          onChange={(e) =>
            onChange({ ...settings, background: e.target.checked })
          }
        />
      </label>
      <p className="small background-help">
        Áp dụng khi chuyển tab hoặc thu nhỏ cửa sổ. Thiết bị có thể hạn chế âm
        thanh khi khóa màn hình.
      </p>
      <label className="volume-label">
        Âm lượng <span>{Math.round(settings.volume * 100)}%</span>
        <input
          aria-label="Âm lượng"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={settings.volume}
          onChange={(e) =>
            onChange({ ...settings, volume: Number(e.target.value) })
          }
        />
      </label>
      <p className="small">
        Giai điệu và hiệu ứng tự tạo bằng Web Audio. Nhạc chỉ phát sau thao tác
        của bé.
      </p>
      <div className="reset-section">
        {confirm ? (
          <>
            <p>Xóa toàn bộ sao và bài đã học trên thiết bị này?</p>
            <div className="actions">
              <button
                className="button secondary"
                onClick={() => setConfirm(false)}
              >
                Giữ lại
              </button>
              <button
                className="button danger"
                onClick={() => {
                  onReset();
                  setConfirm(false);
                }}
              >
                Xóa tiến độ
              </button>
            </div>
          </>
        ) : (
          <button className="text-button" onClick={() => setConfirm(true)}>
            <RotateCcw size={17} /> Đặt lại tiến độ
          </button>
        )}
      </div>
    </dialog>
  );
}
