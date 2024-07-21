export function wait(delay = 1000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delay));
}