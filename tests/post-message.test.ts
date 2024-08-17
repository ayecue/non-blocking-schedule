import { SchedulePostMessageHelper } from '../src/provider/post-message';
import { wait } from './utils';
import { EventEmitter } from 'events';

describe('post-message', () => {
  let eventEmitter: EventEmitter;
  let schedule: ReturnType<typeof SchedulePostMessageHelper.createCallback>;

  beforeEach(() => {
    const globalRef = globalThis as any;

    eventEmitter = new EventEmitter();

    globalRef.self = {};

    globalRef.self.addEventListener = jest.fn((type, cb) => {
      eventEmitter.addListener(type, cb);
    });

    globalRef.self.postMessage = jest.fn((id) => {
      setImmediate(() => {
        eventEmitter.emit('message', {
          data: id,
          source: globalRef.self
        });
      });
    });

    schedule = SchedulePostMessageHelper.createCallback();
  });

  afterEach(() => {
    const globalRef = globalThis as any;

    globalRef.self = null;
    delete globalRef.self;
  })

  test('should execute task', async () => {
    const callback = jest.fn();

    schedule(callback);
    await wait(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});