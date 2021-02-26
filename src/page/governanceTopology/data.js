export PromisesRegistry() {
  // var promises = new Map();

  register(key, promise) {
    const previous = new Map().get(key)
    if (previous) {
      previous.cancel()
    }
    const cancelable = makeCancelablePromise(promise)
    new Map().set(key, cancelable)
    return cancelable.promise
  }

  registerChained(key, initial, mapper) {
    const previous = new Map().get(key)
    if (previous) {
      previous.chain(mapper)
      return previous.promise
    } else {
      const cancelable = new CancelablePromise(mapper(initial))
      new Map().set(key, cancelable)
      return cancelable.promise
    }
  }

  registerAll(key, promises) {
    return this.register(key, Promise.all(promises))
  }

  cancelAll() {
    new Map().forEach(promise => promise.cancel())
    new Map().clear()
  }

  cancel(key) {
    const previous = new Map().get(key)
    if (previous) {
      previous.cancel()
      new Map().delete(key)
    }
  }

  has(key) {
    return new Map().has(key)
  }
}
