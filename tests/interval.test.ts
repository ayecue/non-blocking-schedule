import { ScheduleIntervalHelper } from '../src/provider/interval';
import { wait } from './utils';

describe('interval', () => {
  let schedule: ReturnType<typeof ScheduleIntervalHelper.createCallback>;

  beforeEach(() => {
    schedule = ScheduleIntervalHelper.createCallback();
  });

  test('should execute task', async () => {
    const callback = jest.fn();

    schedule(callback);
    await wait(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});