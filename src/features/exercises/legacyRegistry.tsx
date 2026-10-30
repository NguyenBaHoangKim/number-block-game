import type { ComponentType } from "react";
import type { Activity } from "../../types/lesson";
import type { WorkspaceProps } from "../../components/activities/types";
import { CountActivity } from "../../components/activities/CountActivity";
import { BalanceActivity } from "../../components/activities/BalanceActivity";
import { MatchActivity } from "../../components/activities/MatchActivity";
import { MissingActivity } from "../../components/activities/MissingActivity";
import { PatternActivity } from "../../components/activities/PatternActivity";
import { NumberLineActivity } from "../../components/activities/NumberLineActivity";
import { TransformActivity } from "../../components/activities/TransformActivity";
import { MemoryActivity } from "../../components/activities/MemoryActivity";
import {
  GroupingActivity,
  SharingActivity,
  ParityActivity,
} from "../../components/activities/GroupActivities";
import {
  ShapesActivity,
  BridgeActivity,
} from "../../components/activities/BuildActivities";
import { ClockActivity } from "../../components/activities/ClockActivity";
import { MeetCharactersActivity } from "../../components/activities/MeetCharactersActivity";
export const legacyRegistry = {
  count: CountActivity,
  compare: BalanceActivity,
  match: MatchActivity,
  missing: MissingActivity,
  pattern: PatternActivity,
  numberline: NumberLineActivity,
  merge: TransformActivity,
  split: TransformActivity,
  memory: MemoryActivity,
  grouping: GroupingActivity,
  sharing: SharingActivity,
  parity: ParityActivity,
  shapes: ShapesActivity,
  bridge: BridgeActivity,
  clock: ClockActivity,
  meet: MeetCharactersActivity,
} satisfies Record<Activity, ComponentType<WorkspaceProps>>;
