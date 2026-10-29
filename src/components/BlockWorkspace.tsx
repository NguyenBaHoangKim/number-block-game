import type { WorkspaceProps } from "./activities/types";
import { MeetCharactersActivity } from "./activities/MeetCharactersActivity";
import { CountActivity } from "./activities/CountActivity";
import { BalanceActivity } from "./activities/BalanceActivity";
import { MatchActivity } from "./activities/MatchActivity";
import { MissingActivity } from "./activities/MissingActivity";
import { PatternActivity } from "./activities/PatternActivity";
import { NumberLineActivity } from "./activities/NumberLineActivity";
import { TransformActivity } from "./activities/TransformActivity";
import { MemoryActivity } from "./activities/MemoryActivity";
import {
  GroupingActivity,
  SharingActivity,
  ParityActivity,
} from "./activities/GroupActivities";
import { ShapesActivity, BridgeActivity } from "./activities/BuildActivities";
import { ClockActivity } from "./activities/ClockActivity";
export function BlockWorkspace(props: WorkspaceProps) {
  switch (props.step.activity) {
    case "memory":
      return <MemoryActivity {...props} />;
    case "grouping":
      return <GroupingActivity {...props} />;
    case "sharing":
      return <SharingActivity {...props} />;
    case "parity":
      return <ParityActivity {...props} />;
    case "shapes":
      return <ShapesActivity {...props} />;
    case "bridge":
      return <BridgeActivity {...props} />;
    case "clock":
      return <ClockActivity {...props} />;
    case "meet":
      return <MeetCharactersActivity {...props} />;
    case "count":
      return <CountActivity {...props} />;
    case "compare":
      return <BalanceActivity {...props} />;
    case "match":
      return <MatchActivity {...props} />;
    case "missing":
      return <MissingActivity {...props} />;
    case "pattern":
      return <PatternActivity {...props} />;
    case "numberline":
      return <NumberLineActivity {...props} />;
    default:
      return <TransformActivity {...props} />;
  }
}
