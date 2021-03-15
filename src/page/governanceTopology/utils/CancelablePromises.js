export class CancelablePromise {
  promise
  next
  hasCanceled = false;

  constructor(promise) {
    this.promise = new Promise((resolve, reject) => {
      promise.then(
        val => (this.hasCanceled ? reject({ isCanceled: true }) : resolve(val)),
        error => (this.hasCanceled ? reject({ isCanceled: true }) : reject(error))
      )
    })
  }

  cancel() {
    this.hasCanceled = true
    if (this.next) {
      this.next.cancel()
    }
  }

  chain(mapper = (t) => Promise) {
    let last = this
    while (last.next) {
      last = last.next
    }
    last.next = new CancelablePromise(this.promise.then(t => (this.hasCanceled ? t : mapper(t))))
    this.promise = last.next.promise
    return last.next
  }
}

export const makeCancelablePromise = (promise) => {
  return new CancelablePromise(promise)
}

export class PromisesRegistry {
  promises = new Map();

  register(key, promise) {
    const previous = this.promises.get(key)
    if (previous) {
      previous.cancel()
    }
    const cancelable = makeCancelablePromise(promise)
    this.promises.set(key, cancelable)
    return promise
  }

  registerChained(key, initial, mapper = (t) => Promise) {
    const previous = this.promises.get(key)
    if (previous) {
      previous.chain(mapper)
      return previous.promise
    } else {
      const cancelable = new CancelablePromise(mapper(initial))
      this.promises.set(key, cancelable)
      return cancelable.promise
    }
  }

  registerAll(key, promises) {
    return this.register(key, Promise.all(promises))
  }

  cancelAll() {
    this.promises.forEach(promise => promise.cancel())
    this.promises.clear()
  }

  cancel(key) {
    const previous = this.promises.get(key)
    if (previous) {
      previous.cancel()
      this.promises.delete(key)
    }
  }

  has(key) {
    return this.promises.has(key)
  }
}
