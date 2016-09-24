/**
 * @file        General error/warn logger
 * @author      Icemic Jia <bingfeng.web@gmail.com>
 * @copyright   2013-2016 Icemic Jia
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

export function error(text, isThrow = true) {
  console.error('Error: ' + text + '.');
  if (isThrow) throw 'Error: ' + text + '.';
}

export function warn(text, isThrow = false) {
  console.warn('Warning: ' + text + '.');
  if (isThrow) throw 'Warning: ' + text + '.';
}

module.exports = {
  error,
  warn,
};
