import { ScheduleSetImmmediateHelper } from '../src/provider/set-immediate';
import { wait } from './utils';

describe('set-immediate', () => {
  let schedule: ReturnType<typeof ScheduleSetImmmediateHelper.createCallback>;

  beforeEach(() => {
    schedule = ScheduleSetImmmediateHelper.createCallback();
  });

  test('should execute task', async () => {
    const callback = jest.fn();

    schedule(callback);
    await wait(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});