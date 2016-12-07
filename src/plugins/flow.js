/**
 * @file        Flow control commands
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

import core from 'core/core';

class Flow {
  constructor() {
    core.use('flow-init', this.init.bind(this));
  }
  async init(ctx, next) {
    core.use('script-exec', this.exec.bind(this));
  }
  /**
  * Supply flow-control commands:
  * `wait`: Prevents script execution for some time. ex.`[flow wait time=1000]`
  *
  * @method exec
  * @param  {object}   ctx  middleware context
  * @param  {Function} next execute next middleware
  * @return {Promise}
  */
  async exec(ctx, next) {
    const { command, flags, params } = ctx;
    if (command === 'flow') {
      if (flags.includes('wait')) {
        await new Promise((resolve, reject) => {
          setTimeout(resolve, params.time || 0);
        });
      }
    } else {
      await next();
    }
  }
}

const flow = new Flow();

export default flow;
