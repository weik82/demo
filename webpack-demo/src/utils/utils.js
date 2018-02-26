// const isServer = Vue.prototype.$isServer;

const UA = navigator.userAgent.toLowerCase(),
  isArray = Array.isArray,
  isNaN = Number.isNaN,
  isFunction = fn => typeof fn === 'function',
  noop = function() {};
//addEventListener
export const on = (function on() {
  let listener = document.addEventListener ? 'addEventListener' : 'attachEvent';
  return function(el, event, handle) {
    if (el && event) {
      el[listener](event, handle, false);
    }
  };
})();
//removeEventListener
export const off = (function on() {
  let listener = document.removeEventListener
    ? 'removeEventListener'
    : 'detachEvent';
  return function(el, event, handle) {
    if (el && event) {
      el[listener](event, handle, false);
    }
  };
})();
//绑定一次事件
export const once = function(el, event, handle) {
  let listener = function() {
    if (handle) {
      handle.apply(this, arguments);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
};

export const isFirefox = UA.indexOf('firefox') > -1;

//生成guid
function S4(repeat = 1) {
  let _fnRepeat = (fn, n) => {
    let str = '';
    for (let i = 0; i < n; i++) {
      str += fn();
    }
    return str;
  };
  let _s4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return _fnRepeat(_s4, repeat);
}
export const guid = () => {
  return S4(2) + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4(3);
};

const SPECIAL_CHARS_REGEXP = /(\-+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
export function camelCase(name) {
  return name
    .replace(SPECIAL_CHARS_REGEXP, function(_, eparator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    })
    .replace(MOZ_HACK_REGEXP, 'Moz$1');
}

export function calledOnce(fn, ...rest) {
  let call = false;
  return function(...rest1) {
    if (!call) {
      call = true;
      fn.apply(this, [...rest, ...rest1]);
    }
  };
}

export function flattenArray(arr) {
  return arr.reduce((a, b) => a.concat(isArray(b) ? flattenArray(b) : b), []);
}
//[1, 2, [3, 4, [5, [7]]], 6]
export function arrayLevel(arr) {
  let result = [];
  function _arrayLevel(arr, level, result) {
    arr.forEach((item, index) => {
      if (isArray(item)) {
        result[index] = [];
        _arrayLevel(item, level + 1, result[index]);
      } else {
        result.push(level);
      }
    });
  }
  _arrayLevel(arr, 1, result);
  return Math.max.apply(null, flattenArray(result));
}

export function workFlow(works) {
  if (!isArray(works)) {
    return Promise.resolve(works);
  }
  if (!works.length) {
    return Promise.resolve();
  }
  let index = 0,
    len = works.length;
  return Promise.resolve().then(function callNext(value) {
    if (index < len - 1) {
      return (function callResult(next) {
        index++;
        let item = works[index];
        if (isArray(item)) {
          var _arr = [];
          item.forEach(element => {
            _arr.push(
              Promise.resolve(isFunction(element) ? element(next) : element)
            );
          });
          return Promise.all(_arr).then(val => {
            callNext(val);
          });
        }
        return Promise.resolve(isFunction(item) ? item(next) : item).then(
          val => {
            callNext(val);
          }
        );
      })(next);
    }
  });
}

export const root = { timer: null };
export function interval(fn = noop, delay = 16, ...rest) {
  let start;
  function _interval(timestamp) {
    if (!start) start = timestamp;
    let progress = timestamp - start;
    if (progress >= delay) {
      start = timestamp;
      fn.apply(this, rest);
    }
    root.timer = window.requestAnimationFrame(_interval);
  }
  root.timer = window.requestAnimationFrame(_interval);
}
export function clearInterval(timer) {
  window.cancelAnimationFrame(timer);
}
