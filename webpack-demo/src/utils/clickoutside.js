import { on, guid } from './utils';

const nodeList = [];
const ctx = '$$clickoutside';

let _mouseDownStart;

on(document, 'mousedown', e => {
  _mouseDownStart = e;
});
on(document, 'mouseup', e => {
  nodeList.forEach(node => {
    node[ctx].callbackHandler(_mouseDownStart, e);
  });
});
function createCallbackHandler(el, binding, vnode) {
  return function(mousedown = {}, mouseup = {}) {
    if (
      !vnode ||
      !vnode.context ||
      !mousedown.target ||
      !mouseup.target ||
      el.contains(mousedown.target) ||
      el.contains(mouseup.target) ||
      el === mouseup.target
    )
      return;
    if (el[ctx].methodName) {
      vnode.context[el[ctx].methodName]();
    } else {
      el[ctx].boundFn && el[ctx].boundFn();
    }
  };
}
export default {
  bind(el, binding, vnode) {
    nodeList.push(el);
    el[ctx] = {
      id: guid(),
      callbackHandler: createCallbackHandler(el, binding, vnode),
      methodName: binding.expression,
      boundFn: binding.value
    };
  },
  update(el, binding, vnode) {
    el[ctx] = {
      callbackHandler: callbackHandler(el, binding, vnode),
      methodName: binding.expression,
      boundFn: binding.value
    };
  },
  unbind(el) {
    let len = nodeList.length;
    for (let i = 0; i < len; i++) {
      let node = nodeList[i];
      if (node[ctx].id === el[ctx].id) {
        nodeList.splice(i, i);
        break;
      }
    }
    delete el[ctx];
  }
};
