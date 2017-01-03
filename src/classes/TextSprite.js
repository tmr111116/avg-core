/**
 * @file        Text sprite class
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

import { deprecated } from 'core-decorators';

const PIXI = require('pixi.js');
// import { TransitionPlugin } from './Transition/TransitionPlugin';
// import { TransitionFilter } from './Transition/TransitionFilter';

/**
 * Class representing a TextSprite. <br>
 * default font style is `normal 24px sans-serif`
 * @extends PIXI.Text
 * @param {string} text The string that you would like the text to display
 * @param {object} style The style parameters, see http://pixijs.download/v4.2.3/docs/PIXI.TextStyle.html
 */
class TextSprite extends PIXI.Text {
  constructor(text='', style={}) {
    super(text, {
      fontFamily: 'sans-serif',
      fontSize: 24,
      fill: 0xffffff,
      ...style
    });

    this.m_style = {};
    this.zorder = 0;
    // this.filters = [new TransitionFilter()];
  }

  /**
   * @deprecated
   */
  @deprecated
  setAnchor(anchor) {
    if (anchor) {
      this.anchor.x = anchor[0];
      this.anchor.y = anchor[1];
    }
    return this;
  }

  /**
   * Specify text content.
   * This method do not take effect until {@link TextSprite#exec} is called.
   * @param {string} text
   * @returns {TextSprite} - this
   * @deprecated
   */
  @deprecated
  setText(text) {
    this.text = text;
    return this;
  }

  /**
   * Specify text color.
   * This method do not take effect until {@link TextSprite#exec} is called.
   * @param {string} color - any valid color, like `red` `#ff6600`.
   * @returns {TextSprite} - this
   * @deprecated
   */
  @deprecated
  setColor(color) {
    // this.color = color;
    this.m_style.fill = color;
    return this;
  }

  /**
   * Specify text size.
   * This method do not take effect until {@link TextSprite#exec} is called.
   * @param {number} size
   * @returns {TextSprite} - this
   * @deprecated
   */
  @deprecated
  setSize(size) {
    const yInterval = this.m_style.lineHeight - this.m_fontSize;
    this.m_fontSize = size;
    this.m_style.font = this.m_fontStyle + this.m_fontSize + 'px ' + this.m_font;
    this.setYInterval(yInterval);
    this.m_style.dropShadowDistance = this.m_fontSize / 12;
    return this;
  }

  /**
   * Specify text font.
   * This method do not take effect until {@link TextSprite#exec} is called.
   * @param {string} font - the name of font
   * @returns {TextSprite} - this
   * @deprecated
   */
  @deprecated
  setFont(font) {
    this.m_font = font;
    this.m_style.font = this.m_fontStyle + this.m_fontSize + 'px ' + this.m_font;
    return this;
  }

  /**
   * Specify text width, the max width value before it is wrapped.
   * This method do not take effect until {@link TextSprite#exec} is called.
   * @param {number} value
   * @returns {TextSprite} - this
   * @deprecated
   */
  @deprecated
  setTextWidth(value) {
    // this.textWidth = value;
    this.m_style.wordWrap = (value === -1) ? false : true;
    this.m_style.wordWrapWidth = value;
    return this;
  }

  /**
   * Specify text height, the max height value before it is hidden.
   * This method do not take effect until {@link TextSprite#exec} is called.
   * @param {number} value
   * @returns {TextSprite} - this
   * @deprecated
   */
  @deprecated
  setTextHeight(value) {
    this.m_style.wordWrapHeight = value;
    return this;
  }

  /**
   * Specify intervals between letters.
   * This method do not take effect until {@link TextSprite#exec} is called.
   * @param {number} value
   * @returns {TextSprite} - this
   * @deprecated
   */
  @deprecated
  setXInterval(value) {
    this.m_style.xInterval = value;
    return this;
  }

  /**
   * Specify intervals between lines.
   * This method do not take effect until {@link TextSprite#exec} is called.
   * @param {number} value
   * @returns {TextSprite} - this
   * @deprecated
   */
  @deprecated
  setYInterval(value) {
    this.m_style.lineHeight = value + this.m_fontSize;
    return this;
  }

  /**
   * Specify ellipsis string when text is ellipsised.
   * This method do not take effect until {@link TextSprite#exec} is called.
   * @param {string} text
   * @returns {TextSprite} - this
   * @deprecated
   */
  @deprecated
  setExtraChar(str) {
    this.m_style.wordWrapChar = str;
    return this;
  }

  /**
   * Enable or disable bold style.
   * This method do not take effect until {@link TextSprite#exec} is called.
   * @param {boolean} enable
   * @returns {TextSprite} - this
   * @deprecated
   */
  @deprecated
  setBold(bool) {
    this.m_bold = bool;
    this.m_fontStyle = '';
    if (this.m_bold)
      this.m_fontStyle += 'bold ';
    if (this.m_italic)
      this.m_fontStyle += 'italic ';
    if (!this.m_bold && !this.m_italic)
      this.m_fontStyle = 'normal ';
    this.m_style.font = this.m_fontStyle + this.m_fontSize + 'px ' + this.m_font;
    return this;
  }

  /**
   * Enable or disable italic style.
   * This method do not take effect until {@link TextSprite#exec} is called.
   * @param {boolean} enable
   * @returns {TextSprite} - this
   * @deprecated
   */
  @deprecated
  setItalic(bool) {
    this.m_italic = bool;
    this.m_fontStyle = '';
    if (this.m_bold)
      this.m_fontStyle += 'bold ';
    if (this.m_italic)
      this.m_fontStyle += 'italic ';
    if (!this.m_bold && !this.m_italic)
      this.m_fontStyle = 'normal ';
    this.m_style.font = this.m_fontStyle + this.m_fontSize + 'px ' + this.m_font;
    return this;
  }

  // setStrike(bool){
  //   this.strike = bool;
  //   return this;
  // }

  // setUnder(bool){
  //   this.m_under = bool;
  //   return this;
  // }

  /**
   * Enable or disable text shadow.
   * This method do not take effect until {@link TextSprite#exec} is called.
   * @param {boolean} enable
   * @returns {TextSprite} - this
   * @deprecated
   */
  @deprecated
  setShadow(bool) {
    this.m_style.dropShadow = bool;
    return this;
  }

  /**
   * Specify shadow color.
   * This method do not take effect until {@link TextSprite#exec} is called.
   * @param {string} color
   * @returns {TextSprite} - this
   * @deprecated
   */
  @deprecated
  setShadowColor(color) {
    this.m_style.dropShadowColor = color;
    return this;
  }

  /**
   * Enable or disable text stroke.
   * This method do not take effect until {@link TextSprite#exec} is called.
   * @param {boolean} enable
   * @returns {TextSprite} - this
   * @deprecated
   */
  @deprecated
  setStroke(bool) {
    this.stroke = bool;
    return this;
  }

  /**
   * Specify stroke color.
   * This method do not take effect until {@link TextSprite#exec} is called.
   * @param {string} color
   * @returns {TextSprite} - this
   * @deprecated
   */
  @deprecated
  setStrokeColor(color) {
    this.strokeColor = color;
    return this;
  }

  /**
   * apply style changes.
   * @deprecated
   */
  @deprecated
  exec() {
    this.style = this.m_style;
  }


}

// TransitionPlugin(TextSprite);

module.exports = TextSprite;
