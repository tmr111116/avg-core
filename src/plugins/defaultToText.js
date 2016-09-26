/**
 * @file        Bind default command handler to Textwindow
 * @author      Icemic Jia <bingfeng.web@gmail.com>
 * @copyright   2015-2016 Icemic Jia
 * @link        https://www.avgjs.org
 * @license     Apache License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
