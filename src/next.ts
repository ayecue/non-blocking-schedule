import { Callback } from "./types";

export const next = globalThis.queueMicrotask ?? globalThis.process?.nextTick ?? function (callback: Callback) {
  try { callback(); } catch (err) { console.error(`Error while executing callback`, err); }
};