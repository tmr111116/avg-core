/**@jsx createElement*/

import {createElement, render, Component, Sprite, Text} from 'Iceleaf';

class FakeText extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <Text text="sdfsdfds" {...this.props}/>
    }
}

class SpriteWithText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deltaX: 0,
            show: false,
            show2: false,
            color: 0x0
        }
    }
    handleClick() {
        this.setState({
            deltaX: this.state.deltaX + 50,
            show: !this.state.show
        })
    }
    handleMouseOver() {
        this.setState({
            color: 0xff0000
        })
    }
    handleMouseLeave() {
        this.setState({
            color: 0x0
        })
    }
    componentWillMount() {
        this.setState({
            deltaX: 100
        })
    }
    componentDidMount() {
        setTimeout(() => this.setState({
            show2: true
        }), 1000)
    }
    render() {
        return (
            <Sprite file="assets/res/textwindow.png" x={this.props.x+this.state.deltaX||0} y={this.props.y||0}>
                <Text text={'文字框内文字颜色是：0x'+this.state.color.toString(16)}
                      color={this.state.color} size={20} x={50+this.state.deltaX} y={50}
                      font="思源黑体 Regular,思源黑体" onClick={this.handleClick} onMouseOver={this.handleMouseOver}>
                      {this.state.show ? <Text text="sdfsdfds" color={0xff0000} size={20} x={0} y={50}
                      font="思源黑体 Regular,思源黑体"/> : null}
                </Text>
                {this.state.show ? <Text text='！！！'
                      color={0xff0000} size={20} x={0} y={50}
                      font="思源黑体 Regular,思源黑体" onClick={this.handleClick} /> : null}
                {this.props.children}
            </Sprite>
        )
    }
}

module.exports = (
    <Sprite file="assets/res/BG32a_1280.jpg">
        <SpriteWithText x={100} y={450}>
        <Sprite file="assets/res/ch-1.png" x={100} y={100} />
            <Sprite file="assets/res/ch-2.png" x={130} y={100} />
            <Sprite file="assets/res/ch-3.png" x={160} y={100} />
        </SpriteWithText>
    </Sprite>
)
