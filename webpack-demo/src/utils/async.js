export default function async(gen, ...rest) {
  let it = gen.apply(this, rest);
  return Promise.resolve().then(function handleNext(value) {
    let next = it.next(value);
    return (function handleResult(next) {
      if (next.done) {
        return next.value;
      } else {
        return Promise.resolve(next.value).then(
          handleNext,
          function handleError(err) {
            return Promise.resolve(it.throw(err)).then(handleResult);
          }
        );
      }
    })(next);
  });
}
