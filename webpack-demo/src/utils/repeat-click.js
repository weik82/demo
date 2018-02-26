import { on, once } from './utils';
import { clearInterval } from 'timers';
export default {
  bind(el, handle) {
    let interval = null;
    let startTime;
    const clear = () => {
      if (new Date() - startTime < 100) {
        handle();
      }
      clearInterval(interval);
      interval = null;
    };
    on(el, 'mousedown', e => {
      startTime = new Date();
      once(document, 'mouseup', clear);
      clearInterval(interval);
      interval = setInterval(handle, 100);
    });
  }
};
