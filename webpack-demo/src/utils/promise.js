class CPromise {
  constructor(callback) {
    this.__PromiseStatus__ = CPromise.PENDING;
    this.__PromiseValue__ = null;
    this.execute(callback);
  }
  execute(callback) {
    if (typeof callback !== 'function') {
      throw new Error(`Promise resolver ${executor} is not a function`);
    } else {
      try {
        callback(
          data => {
            this.__PromiseStatus__ = CPromise.RESOLVED;
            this.__PromiseValue__ = data;
          },
          data => {
            this.__PromiseStatus__ = CPromise.REJECTED;
            this.__PromiseValue__ = data;
          }
        );
      } catch (error) {
        this.__PromiseStatus__ = CPromise.REJECTED;
        this.__PromiseValue__ = error;
      }
    }
  }
  then(onfulfilled, onrejected) {
    let result = new CPromise(() => {}),
      timer = null,
      __RESULT__ = null;
    timer = setInterval(() => {
      if (
        this.__PromiseStatus__ === CPromise.RESOLVED ||
        this.__PromiseStatus__ === CPromise.REJECTED
      ) {
        clearInterval(timer);
        try {
          if (this.__PromiseStatus__ === CPromise.RESOLVED) {
            __RESULT__ = onfulfilled(this.__PromiseValue__);
          } else {
            __RESULT__ = onrejected(this.__PromiseValue__);
          }
          if (__RESULT__ instanceof CPromise) {
            timer = setInterval(() => {
              if (
                __RESULT__.__PromiseStatus__ === CPromise.RESOLVED ||
                __RESULT__.__PromiseStatus__ === CPromise.REJECTED
              ) {
                result.__PromiseStatus__ = __RESULT__.__PromiseStatus__;
                result.__PromiseValue__ = __RESULT__.__PromiseValue__;
              }
            });
          } else {
            result.__PromiseStatus__ = CPromise.RESOLVED;
            result.__PromiseValue__ = __RESULT__;
          }
        } catch (error) {
          result.__PromiseStatus__ = CPromise.REJECTED;
          result.__PromiseValue__ = error;
        }
      }
    }, 0);
    return result;
  }
  catch(onRejected) {
    return this.then(data => data, onRejected);
  }
}

CPromise.resolve = function(value) {
  if (!(value instanceof CPromise)) {
    return new CPromise(resolve => {
      resolve(value);
    });
  } else {
    return value;
  }
};

CPromise.reject = function(reason) {
  let result = new CPromise(() => {});
  result.__PromiseStatus__ = CPromise.REJECTED;
  result.__PromiseValue__ = reason;
  return result;
};

CPromise.all = function(promises = []) {
  let i = 0,
    result = [];
  return new CPromise((resolve, reject) => {
    return (function _resolveFn() {
      CPromise.resolve(promises[i++]).then(
        data => {
          result.push(data);
          if (i === promises.length) {
            resolve(result);
          } else {
            _resolveFn();
          }
        },
        data => {
          reject(data);
        }
      );
    })();
  });
};

CPromise.race = function(promises = []) {
  return new CPromise((resolve, reject) => {
    promises.forEach(pr => {
      CPromise.resolve(pr).then(
        data => {
          resolve(data);
        },
        data => {
          reject(data);
        }
      );
    });
  });
};

CPromise.PENDING = 'pending';
CPromise.RESOLVED = 'resolved';
CPromise.REJECTED = 'rejected';
// export default CPromise;
