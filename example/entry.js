require("./assets/css/style.css");

import { React, Component, render, Surface } from 'iceleaf';
import { Router, Route, IndexRoute, IndexRedirect, Link } from 'react-router'
// import CustomScene from './scene';
import Title from './kodoyuri/title';
import Story from './kodoyuri/story';

class Game extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Router>
        <Route path="/" component={Stage}>
          <Route path="title" component={Title} />
          <Route path="story" component={Story} />
          <IndexRedirect from="*" to="title" />
        </Route>
      </Router>
    )
  }
}

class Stage extends Component {
  render() {
    return (
      <Surface width={800} height={600}>
        {this.props.children}
      </Surface>
    )
  }
}
render(<Game />, document.getElementById('app'));
