/**
 * @file        Main export of the AVG.js library
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

/**
 * @namespace AVG
 */
import * as components from 'components';
import * as ui from 'components/ui';
import * as plugins from 'plugins';

import React, { Component } from 'react';
import core from 'core/core';
import findPixiNode from './components/findPixiNode';

import componentify from './components/pixi/componentify';
import * as properties from './components/pixi/properties';
const pixi = { componentify, properties };

export {
  React,
  Component,
  core,
  components,
  ui,
  plugins,
  findPixiNode,
  pixi,
};
