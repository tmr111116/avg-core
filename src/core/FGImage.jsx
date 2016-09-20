import React from 'react';
import { Layer } from './Layer';
import { Image } from './Image';
import { transition } from './decorators/transition';

export class FGImage extends React.Component {
  static propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      x: 0,
      y: 0,
    };
  }
  @transition
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
  getData() {
    return this.state;
  }
  setData(state) {
    this.setState(state);
  }
  render() {
    return (
      <Layer ref={node => this.node = node}>
        <Image file={this.state.file || ''} x={this.props.width / 2} y={this.props.height} anchor={[0.5, 1]} />
      </Layer>
    );
  }
}
