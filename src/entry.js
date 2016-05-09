require("./assets/css/style.css");
// require("babel-polyfill");

var Iceleaf = require('./iceleaf');
var iceleaf = new Iceleaf(document.body);

iceleaf.start();

iceleaf.sprite(10,'assets/res/bg1.png',[0,0,500,720]);
iceleaf.addto(10,-1,10,[200,0],255);

var SoundManager = require('./Classes/SoundManager');

//iceleaf.bgm('assets/res/op_cut.mp3',true,50,0,5000);


PIXI.loader.add('animate', 'assets/res/LineBreak_a.png').load((loader,resources)=>{

iceleaf.animate_horizontal({
    index: 91,
    file: 'assets/res/LineBreak_a.png',
    frame: 16,
    loop: 'bouncing',
    interval: 33
});

iceleaf.addto(91,-1);

iceleaf.textcursor({
    index: 91,
    follow: true,
    pos: [0,0]
});

})

iceleaf.sprite(90,"assets/res/BG32a_1280.jpg");
iceleaf.addto(90,-1);


iceleaf.textsprite(100,"TextSprite 测试",0xffcc00,20,"思源黑体 Regular,思源黑体");
iceleaf.addto(100,10,100,[745,25],255)

iceleaf.textwindow("assets/res/textwindow.png",0.8,[126,450],[20,55,1008,231]);
iceleaf.texton();

iceleaf.textstyle({
    name: "思源黑体 Regular,思源黑体",
    size: 24,
    color: 0x000000,
    bold: false,
    italic: false,
    shadow: false,
    shadowColor: 0xffffff,
    stroke: false,
})

iceleaf.text('你好，世界！');

// iceleaf.locate({
//     x: 20,
//     y: 200
// })


iceleaf.textspeed(50);


//iceleaf.text('abcde,ABCD, 这是一段测试文字，用于测试打印速度和文字换行、间距等各种参数是否正确。这是一段测试文字，用于测试打印速度和文字换行、间距等各种参数是否正确。这是一段测试文字，用于测试打印速度和文字换行、间距等各种参数是否正确。');

var SpriteManager = require('./Classes/SpriteManager');

import * as ActionManager from './Classes/ActionManager';
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

// ActionManager.start({
//     times: 2
// })

setTimeout(() => {
    let sprite = SpriteManager.fromIndex(-1);
    sprite.prepareTransition(iceleaf.renderer);
    iceleaf.remove(10);
},300)

import {CrossFadeFilter} from './Classes/Transition/Filters';
setTimeout(() => {

    let sprite = SpriteManager.fromIndex(-1);
    sprite.startTransition(iceleaf.renderer, new CrossFadeFilter);

},1000)
