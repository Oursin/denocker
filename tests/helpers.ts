export function sleep(ms: number) {
  return new Promise((resolve => setTimeout(resolve, ms)));
}

type RetryCallback = () => Promise<boolean>;

export async function retry(func: RetryCallback, times: number, delay_ms: number) {
  for (let i = 0; i < times; i++) {
    if (await func()) {
      return
    }
    await sleep(delay_ms)
  }
  throw Error("retry failed")
}
