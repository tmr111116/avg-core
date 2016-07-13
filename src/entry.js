require("./assets/css/style.css");
// require("babel-core/register");
// require("babel-polyfill");

// var Iceleaf = require('./iceleaf');
// var iceleaf = new Iceleaf(document.body);

// iceleaf.start();

// require('./Controller.js')


import * as SpriteManager from './Classes/SpriteManager';
import * as SoundManager from './Classes/SoundManager';
import * as ActionManager from './Classes/ActionManager';
import {registerHandler} from './Classes/EventManager';
import * as Flow from './Classes/Flow';
import TWMInit from './Classes/TextWindowManager';
import fps from './Utils/fps';

import {CrossFadeFilter} from './Classes/Transition/Filters';

let GlobalSystem = (function*() {



    let viewNode = SpriteManager.init();
    const TextWindowManager = TWMInit(SpriteManager);
    document.body.appendChild(viewNode);

    let stage = SpriteManager.getStage();
    let renderer = SpriteManager.getRenderer();

    fps.installFPSView(stage);
    update();

    function update(time) {
        window.requestAnimationFrame(update.bind(this));
        renderer.render(stage);
        ActionManager.update(time);
    }


    SpriteManager.create(10,'assets/res/bg1.png',[0,0,500,720])
    SpriteManager.addto(10,-1,10,[200,0], 1);

    SoundManager.setChannel(-1, {
        file: 'assets/res/op_cut.mp3',
        loop: true,
        volume: 0.5,
        onEnd: () => {
            SoundManager.setPosition(-1, 10);
        }
    });

    // SoundManager.play(-1);
    SoundManager.fadeTo(-1, 0.5, 1000);

    // await SoundManager.wait(-1);


    PIXI.loader.add('animate', 'assets/res/LineBreak_a.png').load((loader,resources)=>{

    // iceleaf.animate_horizontal({
    //     index: 91,
    //     file: 'assets/res/LineBreak_a.png',
    //     frame: 16,
    //     loop: 'bouncing',
    //     interval: 33
    // });
    SpriteManager.createAnimation({
        direction: 'horizontal',
        index: 91,
        file: 'assets/res/LineBreak_a.png',
        frame: 16,
        loop: 'bouncing',
        interval: 33
    });
    //
    // iceleaf.addto(91,-1);
    //
    // iceleaf.textcursor({
    //     index: 91,
    //     follow: true,
    //     pos: [0,0]
    // });
    TextWindowManager.setTextCursor(SpriteManager.fromIndex(91), true, [0,0]);
    })

    SpriteManager.create(90,"assets/res/BG32a_1280.jpg")
    SpriteManager.addto(90,-1);

    SpriteManager.createText(100,"TextSprite 测试", {
        color: 0xffcc00,
        size: 20,
        font: "思源黑体 Regular,思源黑体"
    })
    SpriteManager.addto(100,10,100,[745,25],255);

    TextWindowManager.setPosition([126,450]);
    TextWindowManager.setTextRectangle([20,55,1008,231]);
    TextWindowManager.setXInterval(0)
    TextWindowManager.setYInterval(12)
    TextWindowManager.setBackgroundFile("assets/res/textwindow.png");
    TextWindowManager.setOpacity(0.8);
    TextWindowManager.setVisible(true);
    TextWindowManager.setTextFont("思源黑体 Regular,思源黑体");
    TextWindowManager.setTextSize(24);
    TextWindowManager.setTextColor(0x000000);
    TextWindowManager.setTextBold(false);
    TextWindowManager.setTextItalic(false);
    // TextWindowManager.setTextStrike(strike);
    // TextWindowManager.setTextUnderline(underline);
    TextWindowManager.setTextShadow(false, 0xffffff);
    TextWindowManager.setTextStroke(false);
    // TextWindowManager.relocate(100, 60);
    yield TextWindowManager.drawText('你好，世界！');
    TextWindowManager.setTextSpeed(20);

    // let f = new Function(`await setTimeout(() => {
    //     console.log(123)
    //     return Promise.resolve();
    // }, 5000)`)
    // f()

    //iceleaf.text('abcde,ABCD, 这是一段测试文字，用于测试打印速度和文字换行、间距等各种参数是否正确。这是一段测试文字，用于测试打印速度和文字换行、间距等各种参数是否正确。这是一段测试文字，用于测试打印速度和文字换行、间距等各种参数是否正确。');

    // await TextWindowManager.wait();

    ActionManager.tintBy({
        deltaColor: 0x333333,
        duration: 800,
        target: SpriteManager.fromIndex(10)
    })
    ActionManager.parallel();

        ActionManager.delay({
            duration: 1000
        })

        ActionManager.queue();
            ActionManager.fadeTo({
                duration: 500,
                targetOpacity: 0,
                target: SpriteManager.fromIndex(100)
            })
            ActionManager.fadeTo({
                duration: 500,
                targetOpacity: 1,
                target: SpriteManager.fromIndex(100)
            })
        ActionManager.end({});

        ActionManager.queue();
        ActionManager.moveBy({
            deltaX: -600,
            deltaY: 250,
            duration: 1000,
            target: SpriteManager.fromIndex(100)
        });

        ActionManager.moveBy({
            deltaX: 600,
            deltaY: -250,
            duration: 1000,
            target: SpriteManager.fromIndex(100)
        });
        ActionManager.end({});

    ActionManager.end({});

    ActionManager.start({
        times: 2
    })

    yield Flow.wait(700);
    SpriteManager.prepareTransition(-1);
    SpriteManager.remove(10);

    yield Flow.wait(700);
    yield SpriteManager.applyTransition(-1, new CrossFadeFilter);

    yield ActionManager.wait();
    yield TextWindowManager.drawText('你好，世界！');
    yield TextWindowManager.drawText('这是一段文字');
    yield TextWindowManager.drawText('点击可以继续下一句');
    yield TextWindowManager.drawText('啊啊啊啊啊啊啊啊啊啊啊啊啊');
    yield TextWindowManager.drawText('有什么要说呢');
    yield TextWindowManager.drawText('………………');
    yield TextWindowManager.drawText('没了吧，演示就到这了23333');

})()

registerHandler((e) => {
    if (e.type !== 'mousemove')
        console.log(`事件[${e.type}] index=${e.index} gx=${e.global.x} gy=${e.global.y} lx=${e.local.x} ly=${e.local.y}`);
    if (["click", "tap"].includes(e.type)) {
        GlobalSystem.next();
    }
})

// window.ontouchend = window.onclick = () => GlobalSystem.next();
//
// window.GlobalSystem = GlobalSystem;

GlobalSystem.next();
