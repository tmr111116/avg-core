require("./asserts/css/style.css");

var Iceleaf = require('./iceleaf');
var iceleaf = new Iceleaf(document.body);

iceleaf.start();

iceleaf.sprite(10,'asserts/res/bg1.png',[0,0,900,300]);
iceleaf.addto(10,-1,10,[200,0],255);


setTimeout(()=>{
    iceleaf.remove(10)  
},1500)

setTimeout(()=>{
    iceleaf.anchor_set(10,'bottomcenter')
    iceleaf.addto(10,-1,10,[640,360],255);
},5000)

setTimeout(()=>{
    //iceleaf.removeall(-1)
},6000)


//test

var SoundManager = require('./Classes/SoundManager');

// SoundManager
// .file(0,'asserts/res/bgm089.ogg')
// .volume(0,0.8)
// .buffer(0,true)
// .autoPlay(0,false)
// .exec(0);

iceleaf.bgm('asserts/res/op_cut.mp3',true,50,0,5000);
//SoundManager.setPosition(-1,10)
//iceleaf.se('asserts/res/op_cut.mp3');

setTimeout(()=>{
    //iceleaf.bgm('asserts/res/op_cut.mp3');
    //iceleaf.stop(-1,2000)
    //iceleaf.fade(-1,5000,100,true)
    //SoundManager.setPosition(-1,5)
},2000)

//SoundManager.play(0);

// SoundManager
// .file(1,'asserts/res/op_cut.mp3')
// .volume(1,1)
// .buffer(1,true)
// .autoPlay(1,false)
// .exec(1);

// let clipImages = [{
//     texture: "asserts/res/ch-1.png",
//     time: 300},{
//     texture: "asserts/res/ch-2.png",
//     time: 300},{
//     texture: "asserts/res/ch-3.png",
//     time: 300}];
// for (var i = 0; i < clipImages.length; i++) {
//     var texture = PIXI.Texture.fromImage(clipImages[i].texture);
//     clipImages[i].texture = texture;
// }

// let movieClip = new PIXI.extras.MovieClip(clipImages);

// iceleaf.stage.addChild(movieClip);

// movieClip.play()

PIXI.loader.add('animate', 'asserts/res/LineBreak_a.png').load((loader,resources)=>{

let Animation = require('./Classes/Animation');

let ani = new Animation();

ani
// .setFile(["asserts/res/ch-1.png","asserts/res/ch-2.png","asserts/res/ch-3.png"])
// .setType('multifiles')
.setFile('asserts/res/LineBreak_a.png')
.setType('horizontal')
.setFrame(16)
.setLoopType('bouncing')
.setInterval(33)
.setIndex(100)
.setLoop(true)
//.setDelay(2000)
.exec();


iceleaf.stage.addChild(ani);


    
})

// let TextSprite = require('./Classes/TextSprite');

// //var text = new PIXI.Text('Th测试，竟1然支持汉字了？is is a pixi text',{font : 'bold italic 24px Arial', fill : 0xff1010, align : 'center'});
// var text = new TextSprite();
// text.setIndex(100).setText("sdfsd");
// iceleaf.stage.addChild(text)

iceleaf.textsprite(100,"测a试.内容sdfsdf",0xffcc00,20,"思源黑体 CN Light");
iceleaf.addto(100,-1,100,[500,600],255)

iceleaf.textwindow(0x333333,0.8,[50,50]);
iceleaf.texton();



