import type { WorkspaceProps } from "./activities/types";
import { legacyRegistry } from "../features/exercises/legacyRegistry";
export function BlockWorkspace(props: WorkspaceProps) {
  const Renderer = legacyRegistry[props.step.activity];
  if (!Renderer)
    return (
      <p role="alert">
        Hoạt động chưa sẵn sàng. Bé quay lại chọn bài khác nhé.
      </p>
    );
  return <Renderer {...props} />;
}
