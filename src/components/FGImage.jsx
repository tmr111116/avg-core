import React from 'react';
import { Layer } from './Layer';
import { Image } from './Image';
import { transition } from 'decorators/transition';

export class FGImage extends React.Component {
  static propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  };
  state = {
    left: null,
    center: null,
    right: null,
  };
  @transition
  execute(params, flags, name) {
    // this.setState({ ...params });
    let pos = 'center';
    if (flags.includes('left')) {
      pos = 'left';
    } else if (flags.includes('right')) {
      pos = 'right';
    }
    if (['left', 'center', 'right'].includes(params.pos)) {
      pos = params.pos;
    }

    const state = {};
    if (flags.includes('clear')) {
      state[pos] = null;
    } else {
      state[pos] = params.file;
    }
    this.setState(state);

    return {
      promise: Promise.resolve(),
    };
  }
  reset() {
    this.setState({
      left: null,
      center: null,
      right: null,
    });
  }
  getData() {
    return this.state;
  }
  setData(state) {
    this.setState(state);
  }
  render() {
    return (
      <Layer ref={node => this.node = node}>
        {this.state.center ? <Image file={this.state.center} x={this.props.width * 0.5} y={this.props.height} anchor={[0.5, 1]} key="center" /> : null}
        {this.state.left ? <Image file={this.state.left} x={this.props.width * 0.25} y={this.props.height} anchor={[0.5, 1]} key="left" /> : null}
        {this.state.right ? <Image file={this.state.right} x={this.props.width * 0.75} y={this.props.height} anchor={[0.5, 1]} key="right" /> : null}
      </Layer>
    );
  }
}
