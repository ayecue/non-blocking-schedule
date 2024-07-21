import { next } from '../next';
import { Callback } from '../types';

export abstract class ScheduleHelper {
  static SLEEP_LIMIT = 1000 as const;
  static QUEUE_LIMIT = 1024 as const;

  static isApplicable() {
    return false;
  }

  static createCallback(): (cb: Callback) => void {
    throw new Error('Cannot create callback from base schedule helper!');
  }

  private queue: Callback[] = [];
  private sleep: number = 0;

  protected abstract isTickActive(): boolean;
  protected abstract startTick(): void;
  protected abstract resumeTick(): void;
  protected abstract endTick(): void;

  protected tick() {
    const q = this.queue;
    const m = Math.min(q.length, ScheduleHelper.QUEUE_LIMIT);
    this.queue = this.queue.slice(ScheduleHelper.QUEUE_LIMIT);
    for (let i = 0; i < m; i++) next(q[i]);
    if (this.queue.length > 0) this.sleep = 0;
    if (this.sleep++ <= ScheduleHelper.SLEEP_LIMIT) {
      this.resumeTick();
      return;
    }
    this.endTick();
  }

  protected start() {
    if (this.isTickActive()) return;
    this.sleep = 0;
    this.startTick();
  }

  add(callback: Callback) {
    this.queue.push(callback);
    this.start();
  }
}
