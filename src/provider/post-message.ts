import { Callback } from '../types';
import { ScheduleHelperCore } from './core';

const isInWorkerContext = () => {
  try {
    return (
      // @ts-expect-error
      typeof WorkerGlobalScope !== 'undefined' &&
      // @ts-expect-error
      self instanceof WorkerGlobalScope
    );
  } catch (err) {}
  return false;
};

export class SchedulePostMessageHelper extends ScheduleHelperCore {
  static isApplicable() {
    return (
      !isInWorkerContext() && !!self.postMessage && !!self.addEventListener
    );
  }

  static createCallback(): (cb: Callback) => void {
    const helper = new SchedulePostMessageHelper();
    return helper.add.bind(helper);
  }

  private id: string = (Math.random() + 1).toString(36).substring(7);
  private active: boolean = false;

  constructor() {
    super();
    self.addEventListener('message', this.onMessage.bind(this));
  }

  protected onMessage(event: MessageEvent<any>) {
    if (event.source !== self || event.data !== this.id) return;
    this.tick();
  }

  protected isTickActive(): boolean {
    return this.active;
  }

  protected startTick(): void {
    this.active = true;
    self.postMessage(this.id);
  }

  protected nextTick(): void {
    self.postMessage(this.id);
  }

  protected endTick(): void {
    this.active = false;
  }
}
