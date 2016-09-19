/**
 * wait for some time
 * @method wait
 * @param  {Number} time how long you want to block script flow, in miliionseconds.
 * @return {Promise}
 */
export function wait(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), time);
  });
}
