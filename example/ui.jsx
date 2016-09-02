/**@jsx createElement*/

import {createElement, render, Component, Sprite, Text, Scene, Layer, FGImage} from 'iceleaf';

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
            color: 0x0000ff
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
    handleMouseOut() {
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
        // setTimeout(() => this.setState({
        //     show2: true
        // }), 1000)
    }
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
    componentDidUpdate() {
        console.log('updated!');
    }
    render() {
        return (
            <Sprite file="assets/res/textwindow.png" x={this.props.x+this.state.deltaX||0} y={this.props.y||0} onClick={this.props.onClick}>
                <Text text={'文字框内文字颜色是：0x'+this.state.color.toString(16)}
                      color={this.state.color} size={20} x={50+this.state.deltaX} y={50}
                      font="思源黑体 Regular,思源黑体" onClick={this.handleClick} onTap={this.handleClick}
                      onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
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

export default class Story extends Component {
    constructor(props) {
        super(props);

        this.state = {
            file: "assets/res/BG32a_1280.jpg"
        }
    }
    handleClick(e) {
        e.stopPropagation();
        console.log('frame clicked!')
    }
    componentDidMount() {
        setTimeout(() => this.setState({
            file: "assets/res/ch-1.png"
        }), 1000)
    }
    render() {
        return (
            <Scene color={0xff6600} opacity={0.1} width={1280} height={720} script='script.bks'>
                <Sprite file={this.state.file || "assets/res/ch-3.png"}>
                    <FGImage commandName="fg"/>
                    <SpriteWithText x={100} y={450} onClick={() => console.log('textwindow clicked!')}>
                        <Sprite file="assets/res/ch-1.png" x={100} y={100} onClick={this.handleClick}/>
                        <Sprite file="assets/res/ch-2.png" x={130} y={100} />
                        <Sprite file={this.state.file || "assets/res/ch-3.png"} x={160} y={100} />
                    </SpriteWithText>
                </Sprite>
            </Scene>
        )
    }
}
