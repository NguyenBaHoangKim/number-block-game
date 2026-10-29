import { useEffect, useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  getNarrationSnapshot,
  narrate,
  subscribeNarration,
  unlockNarration,
} from "../services/narrationService";
export function useNarration(text: string | null) {
  const enabled = useSyncExternalStore(
    subscribeNarration,
    () => getNarrationSnapshot().enabled,
  );
  useEffect(() => {
    if (!text || !enabled) return;
    return narrate(text);
  }, [text, enabled]);
}
export function NarrationButton({ text }: { text: string }) {
  const state = useSyncExternalStore(subscribeNarration, getNarrationSnapshot);
  return (
    <button
      className={`narration-button ${state.speaking ? "speaking" : ""}`}
      disabled={!state.enabled}
      aria-label="Nghe lại hướng dẫn"
      title={
        state.enabled ? "Nghe lại hướng dẫn" : "Bật giọng đọc trong cài đặt"
      }
      onClick={() => {
        unlockNarration();
        narrate(text);
      }}
    >
      {state.enabled ? <Volume2 size={21} /> : <VolumeX size={21} />}
      <span>{state.blocked ? "Chạm để nghe" : "Nghe lại"}</span>
    </button>
  );
}
