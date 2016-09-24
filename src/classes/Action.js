/**
 * @file        Main export of the AVG core actions
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

import ErrorHandler from './ErrorHandler';

import MoveByAction from './Actions/MoveByAction';
import MoveToAction from './Actions/MoveToAction';
import FadeToAction from './Actions/FadeToAction';
import ScaleByAction from './Actions/ScaleByAction';
import ScaleToAction from './Actions/ScaleToAction';
import RotateByAction from './Actions/RotateByAction';
import RotateToAction from './Actions/RotateToAction';
import DelayAction from './Actions/DelayAction';
import RemoveAction from './Actions/RemoveAction';
import VisibleAction from './Actions/VisibleAction';
import TintToAction from './Actions/TintToAction';
import TintByAction from './Actions/TintByAction';

const Action = {
  MoveByAction,
  MoveToAction,
  FadeToAction,
  ScaleByAction,
  ScaleToAction,
  RotateByAction,
  RotateToAction,
  DelayAction,
  RemoveAction,
  VisibleAction,
  TintToAction,
  TintByAction,
};

export default Action;
