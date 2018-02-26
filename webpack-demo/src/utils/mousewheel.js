import normalizeWheel from 'normalize-wheel';
import { isFirefox, on } from './utils';

const mousewheel = function(el, handle) {
  on(el, isFirefox ? 'DOMMouseScroll' : 'mousewheel', function(e) {
    const normalized = normalizeWheel(e);
    handle && handle.apply(this, [e, normalized]);
  });
};
export default {
  bind(el, handle) {
    mousewheel(el, handle);
  }
};