import { Callback } from '../types';
import { ScheduleHelper } from './default';

export class ScheduleIntervalHelper extends ScheduleHelper {
  static isApplicable() {
    return !!globalThis.setInterval;
  }

  static createCallback(): (cb: Callback) => void {
    const helper = new ScheduleIntervalHelper();
    return helper.add.bind(helper);
  }

  private timer: NodeJS.Timeout | null = null;
  private boundTick: () => void = this.tick.bind(this);

  protected isTickActive(): boolean {
    return this.timer !== null;
  }

  protected startTick(): void {
    this.timer = setInterval(this.boundTick, 0);
  }

  protected resumeTick(): void {}

  protected endTick(): void {
    clearInterval(this.timer);
    this.timer = null;
  }
}
