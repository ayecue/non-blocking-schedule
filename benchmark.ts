import { runNonBlockingSchedule, runSetImmediate, runSetTimeout } from './benchmark-cases.ts';

const main = async () => {
  await runNonBlockingSchedule();
  await runSetImmediate();
  await runSetTimeout();
}

main();
