import React from 'react';
import { Image } from './Image';
import { transition } from './decorators/transition';

export class BGImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      x: 0,
      y: 0,
    };
  }
  @transition
  getData() {
    return this.state;
  }
  setData(state) {
    this.setState(state);
  }
  execute(params, flags, name) {
    this.setState({ ...params });
    return {
      promise: Promise.resolve(),
    };
  }
  reset() {
    this.setState({
      file: null,
      x: 0,
      y: 0,
    });
  }
  render() {
    return <Image file={this.state.file || ''} x={0} y={0} ref={node => this.node = node} />;
  }
}
