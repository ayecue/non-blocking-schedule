import { Callback } from '../types';
import { ScheduleHelper } from './default';

export class ScheduleSetImmmediateHelper extends ScheduleHelper {
  static isApplicable() {
    return !!globalThis.setImmediate;
  }

  static createCallback(): (cb: Callback) => void {
    const helper = new ScheduleSetImmmediateHelper();
    return helper.add.bind(helper);
  }

  private immediate: NodeJS.Immediate | null = null;
  private boundTick: () => void = this.tick.bind(this);

  protected isTickActive(): boolean {
    return this.immediate !== null;
  }

  protected startTick(): void {
    this.immediate = setImmediate(this.boundTick);
  }

  protected resumeTick(): void {
    this.immediate = setImmediate(this.boundTick);
  }

  protected endTick(): void {
    clearImmediate(this.immediate);
    this.immediate = null;
  }
}
