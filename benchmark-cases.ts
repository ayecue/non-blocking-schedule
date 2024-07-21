import { schedule } from "./src/index";
require("setimmediate");

const testCase = (label: string, size: number, schedule: (cb: () => void) => void, done: (...args: any[]) => void) => {
  const MAX_OPS = 10;

  const processInChunks = (ops: Function[]) => {
    for (let i = 0; i < MAX_OPS; i++) {
      ops[i]();
    }
    const remaining = ops.slice(MAX_OPS);
    if (remaining.length === 0) {
      done({
        label,
        items,
        time: Date.now() - start
      });
      return;
    }
    schedule(processInChunks.bind(null, remaining));
  };

  const items: number[] = [];
  let count = 0;

  const exampleOps = new Array(size).fill(0).map(() => {
    const nr = count++;

    return () => {
      items.push(nr);
    };
  });
  const start = Date.now();
  processInChunks(exampleOps);
};

const testCasePromisified = (label: string, size: number, schedule: (cb: () => void) => void): Promise<{ label: string, items: number[], time: number }> => {
  return new Promise((resolve) => {
    testCase(label, size, schedule, resolve);
  });
}

const testCasePromisifiedMulti = async (label: string, size: number, schedule: (cb: () => void) => void): Promise<void> => {
  const promises: ReturnType<typeof testCasePromisified>[] = [];

  console.log('start with', label);

  for (let i = 0; i < 100; i++) {
    promises.push(testCasePromisified(label + i, size, schedule));
  }

  const results = await Promise.all(promises);
  const isMissing = results.some((it) => it.items.length !== size);
  if (isMissing) throw new Error('Error in test case. Invalid end size!');
  const sum = results.reduce((r, it) => it.time + r, 0);
  console.log('Avg', sum / results.length);
}

export const runSetImmediate = () => testCasePromisifiedMulti('setImmediate', 5000, setImmediate);
export const runSetTimeout = () => testCasePromisifiedMulti('setTimeout', 5000, (cb: () => void) => setTimeout(cb, 0));
export const runNonBlockingSchedule = () => testCasePromisifiedMulti('non-blocking-schedule', 5000, schedule);