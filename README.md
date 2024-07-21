# non-blocking-schedule

The non-blocking-schedule library is a robust utility designed to facilitate non-blocking task scheduling, ensuring efficient execution of queued tasks without hindering the performance of other operations. This library is particularly useful for applications that require precise control over task execution timing and concurrency.

## Installation

```sh
npm install --save non-blocking-schedule
```

## Example

```js
import { schedule } from "non-blocking-schedule";

const MAX_OPS = 10;

const processInChunks = (ops) => {
  for (let i = 0; i < MAX_OPS; i++) {
    ops[i]();
  }
  const remaining = ops.slice(MAX_OPS);
  if (remaining.length === 0) return;
  schedule(processInChunks.bind(null, remaining));
};

const exampleOps = new Array(1000).fill(() => {
  console.log('random test string', (Math.random() + 1).toString(36).substring(7));
});

processInChunks(exampleOps);
```

## Performance

