/**
 * @file        Show fps in screen
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

const PIXI = require('pixi.js');

const FPS = {
  TOPLEFT: 0,
  TOPRIGHT: 1,
  BOTTOMLEFT: 2,
  BOTTOMRIGHT: 3,
  showFPS: true,
  installFPSView(stage) {
    this.m_text = new PIXI.Text('fps initing...', { font: '24px Arial', fill: 0xFFD700, align: 'center' });
    this.m_text.x = 10;
    this.m_text.y = 10;
    this.m_text.zorder = 9999;
    this.m_ticker = new PIXI.ticker.Ticker();
    this.m_lasttime = Date.now();
    if (stage)
      stage.addChild(this.m_text);
    else
      console.log('ERROR: ' + stage + ' is not a stage/container/sprite.');
    this.m_ticker.add(this.update.bind(this));
    this.m_ticker.start();
  },
  update(ticker) {
    if (Date.now() - this.m_lasttime >= 300)
    {
      this.m_text.text = this.m_ticker.FPS << 0;
      this.m_lasttime = Date.now();
    }
  },
};

export default FPS;
