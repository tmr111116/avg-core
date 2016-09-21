
export default class Flow {
  constructor(text) {
    this.text = text;
  }
  execute(params, flags, name) {
    if (flags.includes('wait')) {
      return {
        waitClick: false,
        promise: new Promise((resolve, reject) => {
          setTimeout(resolve, params.time || 0);
        }),
      };
    } else {
      return {
        waitClick: false,
        promise: Promise.resolve(),
      };
    }
  }
  reset() {}
  getData() {}
  setData() {}
}
