import React from 'react';
import { Image } from './Image';

export class BGImage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            file: null,
            x: 0,
            y: 0
        }
    }
    execute(params, flags, name) {
        this.setState({...params});
        return Promise.resolve;
    }
    render() {
        return <Image file={this.state.file || ""} x={0} y={0} />
    }
}
