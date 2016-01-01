require("./assets/css/style.css");
require("babel-polyfill");

var Iceleaf = require('./iceleaf');
var iceleaf = new Iceleaf(document.body);

iceleaf.start();

iceleaf.sprite(10,'assets/res/bg1.png',[0,0,900,300]);
iceleaf.addto(10,-1,10,[200,0],255);
// iceleaf.addto(10,-1,10,[200,300],255);

setTimeout(()=>{
    // iceleaf.remove(10)  
},1500)

// setTimeout(()=>{
//     iceleaf.anchor_set(10,'bottomcenter')
//     iceleaf.addto(10,-1,10,[640,360],255);
// },5000)


//test

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
iceleaf.addto(100,-1,100,[745,25],255)

iceleaf.textwindow("assets/res/textwindow.png",0.8,[126,450],[20,55,1008,231]);
//iceleaf.textwindow(0x333333,0.8,[50,50]);
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
// var ActionManager = require('./Classes/ActionManager');
import ActionManager from './Classes/ActionManager';

let ActMgr = ActionManager.instance();

// ActMgr.queue();

//     ActMgr.queue();
//         ActMgr.parallel();
//             ActMgr.moveBy({
//                 deltaX: -600,
//                 deltaY: 250,
//                 duration: 1000,
//                 target: SpriteManager.fromIndex(100)
//             })
//             ActMgr.queue();
//                 ActMgr.fadeTo({
//                     duration: 500,
//                     targetOpacity: 0,
//                     target: SpriteManager.fromIndex(100)
//                 })
//                 ActMgr.fadeTo({
//                     duration: 500,
//                     targetOpacity: 1,
//                     target: SpriteManager.fromIndex(100)
//                 })
//             ActMgr.end({});
//         ActMgr.end({})
//         ActMgr.remove({
//             target: SpriteManager.fromIndex(10),
//             _delete: false
//         })
//         ActMgr.queue();
//             ActMgr.rotateBy({
//                 deltaRadians: -Math.PI,
//                 duration: 500,
//                 target: SpriteManager.fromIndex(100)
//             });
//             //ActMgr.delay({duration: 1000});
//             ActMgr.rotateBy({
//                 deltaRadians: -Math.PI,
//                 duration: 1000,
//                 target: SpriteManager.fromIndex(100)
//             });
//         ActMgr.end({times:3})
        
//         ActMgr.moveBy({
//             deltaX: 600,
//             deltaY: -250,
//             duration: 1000,
//             target: SpriteManager.fromIndex(100)
//         })
//     ActMgr.end({});
//     ActMgr.visible({
//         target: SpriteManager.fromIndex(100),
//         visible: false
//     })
//     ActMgr.delay({duration: 1000});
//     ActMgr.visible({
//         target: SpriteManager.fromIndex(100),
//         visible: true
//     })
//     ActMgr.delay({duration: 1000});
// ActMgr.start({
//     times: 2
// })
// ActMgr.tintTo({
//     targetColor: 0x000000,
//     duration: 1000,
//     target: SpriteManager.fromIndex(10)
// })
ActMgr.parallel();

    ActMgr.delay({
        duration: 1000
    })

    ActMgr.queue();
        ActMgr.fadeTo({
            duration: 500,
            targetOpacity: 0,
            target: SpriteManager.fromIndex(100)
        })
        ActMgr.fadeTo({
            duration: 500,
            targetOpacity: 1,
            target: SpriteManager.fromIndex(100)
        })
    ActMgr.end({});

    ActMgr.queue();
    ActMgr.moveBy({
        deltaX: -600,
        deltaY: 250,
        duration: 1000,
        target: SpriteManager.fromIndex(100)
    });
    
    ActMgr.moveBy({
        deltaX: 600,
        deltaY: -250,
        duration: 1000,
        target: SpriteManager.fromIndex(100)
    });
    ActMgr.end({});

ActMgr.end({});

ActMgr.start({
    times: 4
})