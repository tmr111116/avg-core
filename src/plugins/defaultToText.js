
export default class defaultToText {
  constructor(text) {
    this.text = text;
  }
  execute(params, flags, name) {
    let raw = params.raw;
    const lastCharacter = raw.substr(raw.length - 2);
    if (lastCharacter === '/c') {
      flags.push('continue');
      raw = raw.substr(0, raw.length - 2);
    }
    return this.text.execute({
      text: raw,
    }, flags, name);
  }
  reset() {}
  getData() {}
  setData() {}
}
