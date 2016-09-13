require("./assets/css/style.css");

import { React, Component, render, Surface } from 'iceleaf';
import CustomScene from './scene';

class Game extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Surface width={1280} height={720}>
        <CustomScene />
      </Surface>
    )
  }
}

render(<Game />, document.getElementById('app'));
