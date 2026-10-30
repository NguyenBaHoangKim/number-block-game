import { useState } from "react";
import { createRoot } from "react-dom/client";
import { BlockWorkspace } from "../../src/components/BlockWorkspace";
import type { LessonStep } from "../../src/types/lesson";

export function mountActivity(step: LessonStep) {
  const host = document.createElement("div");
  host.id = "activity-audit-host";
  document.body.replaceChildren(host);
  function Harness() {
    const [ready, setReady] = useState(false);
    return (
      <main className="page lesson-page">
        <h1>{step.instruction}</h1>
        <section className="lesson-board">
          <BlockWorkspace
            step={step}
            onReady={(value = true) => setReady(value)}
          />
        </section>
        <button id="audit-next" disabled={!ready}>
          Tiếp tục kiểm tra
        </button>
      </main>
    );
  }
  createRoot(host).render(<Harness />);
}
