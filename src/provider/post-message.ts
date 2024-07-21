import { Callback } from '../types';
import { ScheduleHelper } from './default';

export class SchedulePostMessageHelper extends ScheduleHelper {
  static isApplicable() {
    return !!globalThis.postMessage && !!globalThis.addEventListener;
  }

  static createCallback(): (cb: Callback) => void {
    const helper = new SchedulePostMessageHelper();
    return helper.add.bind(helper);
  }

  private id: string = (Math.random() + 1).toString(36).substring(7);
  private active: boolean = false;

  constructor() {
    super();
    globalThis.addEventListener('message', this.onMessage.bind(this));
  }

  protected onMessage(event: MessageEvent<any>) {
    if (event.source !== window || event.data !== this.id) return;
    this.tick();
  }

  protected isTickActive(): boolean {
    return this.active;
  }

  protected startTick(): void {
    this.active = true;
    globalThis.postMessage(this.id);
  }

  protected nextTick(): void {
    globalThis.postMessage(this.id);
  }

  protected endTick(): void {
    this.active = false;
  }
}
