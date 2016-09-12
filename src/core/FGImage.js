import React from 'react';
import { Container } from './Container';
import { Image } from './Image';

export class FGImage extends React.Component {
    static propTypes = {
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired
    };
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
        return (
            <Container>
                <Image file={this.state.file || ""} x={this.props.width/2} y={this.props.height} anchor={[0.5, 1]}/>
            </Container>
        )
    }
}
