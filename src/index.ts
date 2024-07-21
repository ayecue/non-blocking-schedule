import { ScheduleIntervalHelper } from "./provider/interval";
import { SchedulePostMessageHelper } from "./provider/post-message";
import { ScheduleSetImmmediateHelper } from "./provider/set-immediate";

export function scheduleProvider() {
  if (ScheduleSetImmmediateHelper.isApplicable()) {
    return ScheduleSetImmmediateHelper.createCallback();
  } else if (SchedulePostMessageHelper.isApplicable()) {
    return SchedulePostMessageHelper.createCallback();
  } else if (ScheduleIntervalHelper.isApplicable()) {
    return ScheduleIntervalHelper.createCallback();
  }

  throw new Error('No schedule helper fulfills requirements!');
}

export const schedule = scheduleProvider();
export { ScheduleIntervalHelper } from "./provider/interval";
export { SchedulePostMessageHelper } from "./provider/post-message";
export { ScheduleSetImmmediateHelper } from "./provider/set-immediate";
