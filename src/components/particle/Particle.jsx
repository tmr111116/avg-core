/**
 * @file        Particle component
 * @author      Icemic Jia <bingfeng.web@gmail.com>
 * @copyright   2015-2017 Icemic Jia
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

import deepEqual from 'deep-equal';
import Logger from 'core/logger';
import createComponent from 'components/createComponent';
import ContainerMixin from 'components/ContainerMixin';
import NodeMixin from 'components/NodeMixin';
import { mountNode, updateNode, setValue, updateValue } from '../pixi/properties';

import ParticleContainer from './ParticleContainer';

const logger = Logger.create('Particle');

const Particle = createComponent('Particle', ContainerMixin, NodeMixin, {

  createNode() {
    this.node = new ParticleContainer();
  },
  mountNode(props) {
    const node = this.node;

    setValue.call(node, 'interactiveChildren', props.interactiveChildren, false);
    mountNode(node, props);

    props.art && node.init(props.art, props.config);

    return node;
  },
  updateNode(prevProps, props) {
    const node = this.node;

    updateValue.call(node, 'interactiveChildren', prevProps.interactiveChildren, props.interactiveChildren);
    updateNode(node, prevProps, props);

    if (!deepEqual(prevProps.art, props.art) || !deepEqual(prevProps.config, props.config)) {
      node.init(props.art, props.config);
    }
  }
});

export default Particle;
