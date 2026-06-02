export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorFactory: () => Error
): Promise<T> {
  if (timeoutMs <= 0) return promise

  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(errorFactory()), timeoutMs)

    promise
      .then((result) => {
        clearTimeout(timer)
        resolve(result)
      })
      .catch((err) => {
        clearTimeout(timer)
        reject(err)
      })
  })
}
