import {
  unstable_IdlePriority,
  unstable_ImmediatePriority,
  unstable_LowPriority,
  unstable_NormalPriority,
  unstable_now,
  unstable_runWithPriority,
  unstable_UserBlockingPriority,
} from "../../src";

const noop = () => null;
unstable_runWithPriority(unstable_IdlePriority, noop);
unstable_runWithPriority(unstable_LowPriority, noop);
unstable_runWithPriority(unstable_NormalPriority, noop);
unstable_runWithPriority(unstable_UserBlockingPriority, noop);
unstable_runWithPriority(unstable_ImmediatePriority, noop);

if (typeof unstable_now() === "number") {
}
