var PIXI = require('./Library/pixi.js/src/index');
var fps = require('./Utils/fps.js');

var Sprite = require('./Classes/Sprite');
var TextSprite = require('./Classes/TextSprite');
var TextWindow = require('./Classes/TextWindow');
var SpriteManager = require('./Classes/SpriteManager');
var SoundManager = require('./Classes/SoundManager');
var Animation = require('./Classes/Animation');
var Err = require('./Classes/ErrorHandler');

class Iceleaf {
    constructor(view){
        this.renderer = new PIXI.WebGLRenderer(1280, 720);
        view.appendChild(this.renderer.view);
        this.stage = new PIXI.Container();
        SpriteManager.insert(-1,this.stage);

        let tw = new TextWindow();
        tw.setIndex(-2);
        SpriteManager.insert(-2,tw);
        this.textWindowIndex = -2;
        this.textwindow(0x0,1.0,[0,0],[0,0,1180,620],0,12);
        this.stage.addChild(tw);
        SpriteManager.setZorder(-2,50);
    }

    update(){
        window.requestAnimationFrame(this.update.bind(this));
        this.renderer.render(this.stage);
    }

    // test(){
    //     // PIXI.loader.add('asserts/res/bg1.png').load((loader, resources) => {
    //     //     var bg = new PIXI.Sprite(resources["asserts/res/bg1.png"].texture);
    //     //     this.stage.addChild(bg);
    //     // });
    //     let bg = new Sprite();
    //     bg.file('asserts/res/bg1.png').execSync();
    //     this.stage.addChild(bg);
    // }

    start(){
        fps.installFPSView(this.stage);
        this.update();
    }


    //精灵类
    //此处rect与bke不同，默认值为null，bke默认值为[0,0,0,0]
    sprite(index,file,rect=null){
        let sp = new Sprite();
        sp.setFile(file).setIndex(index).setRect(rect).execSync();
        SpriteManager.insert(index,sp);
    }
    addto(index,target,zorder=0,pos=[0,0],opacity=255,modal=false){
        let srcSp = SpriteManager.fromIndex(index);
        if(!srcSp)
            return Err.warn("源精灵(index="+index+")不存在，此命令忽略执行");
        let tarSp = (target===-1)?this.stage:SpriteManager.fromIndex(target);
        if(!tarSp)
            return Err.warn("目标精灵(index="+target+")不存在，此命令忽略执行");
        srcSp.x = pos[0];
        srcSp.y = pos[1];
        srcSp.alpha = opacity/255;
        /*modal 未能实现*/
        tarSp.addChild(srcSp);
        SpriteManager.setZorder(index,zorder);
    }
    layer(index,width,height,color=0xffffff,opacity=0){

    }
    remove(index,_delete=false){
        let sp = SpriteManager.fromIndex(index);
        if(!sp)
            return Err.warn("精灵(index="+index+")不存在，此命令忽略执行");
        let parent = sp.parent;
        if(!parent)
            return Err.warn("精灵(index="+index+")不在屏幕上，此命令忽略执行");
        parent.removeChild(sp);
        if(_delete){
            SpriteManager.remove(index);
        }
    }
    removeall(index,_delete=false,recursive=false){
        let sp = (index===-1)?this.stage:SpriteManager.fromIndex(index);
        if(!sp)
            return Err.warn("精灵(index="+index+")不存在，此命令忽略执行");
        removeRecursive(sp);
        sp.removeChildren();
    }
    info(file,get){

    }
    infoex(file,get){

    }
    anchor_set(index,set,keep=false){
        let sp = SpriteManager.fromIndex(index);
        if(!sp)
            return Err.warn("精灵(index="+index+")不存在，此命令忽略执行");
        if(typeof set==='string')
            switch(set){
                case 'center': set=[0.5,0.5];break;
                case 'topleft': set=[0,0];break;
                case 'topright': set=[1,0];break;
                case 'topcenter': set=[0.5,0];break;
                case 'leftcenter': set=[0,0.5];break;
                case 'rightcenter': set=[1,0.5];break;
                case 'bottomcenter': set=[0.5,1];break;
                case 'bottomleft': set=[0,1];break;
                case 'bottomright': set=[1,1];break;
            }
        else
            set = [set[0]/sp.width,set[1]/sp.height]
        sp.anchor = new PIXI.Point(set[0],set[1]);
        /*keep未实现*/
    }
    zorder_set(index,set){

    }
    spriteopt(index,disable,recursive=true){

    }

    //音频类
    bgm(file,loop=true,vol=100,fadein=0,loopto=0){
        let query = SoundManager.file(-1,file).loop(-1,loop).volume(-1,0).autoPlay(-1,false)
        if(loopto&&loop){
            let firstLoop = true;
            query.onEnd(-1,() => {
                if(firstLoop)
                    firstLoop = false;
                else
                    SoundManager.setPosition(-1,loopto/1000);
            });
        }
        query.exec(-1);
        SoundManager.play(-1);
        SoundManager.fadeTo(-1,vol/100,fadein);

    }
    se(file,channel=0,loop=false,vol=100,fadein=0){
        SoundManager.file(channel,file).loop(channel,loop).volume(channel,0).autoPlay(channel,false).exec(channel);
        SoundManager.play(channel);
        SoundManager.fadeTo(channel,vol/100,fadein);
    }
    voice(file,vol=100){
        SoundManager.file(-2,file).loop(-2,false).volume(-2,vol/100).autoPlay(-2,true).exec(-2);
    }
    stop(channel,fadeout=0){
        if(typeof channel==='undefined')
            SoundManager.stopAll();
        else
            SoundManager.fadeTo(channel,0,fadeout,()=>{
                SoundManager.stop(channel);
            })
    }
    volume_set(channel,set){
        SoundManager.setVolume(channel,set/100);
    }
    pause(channel){
        if(SoundManager.status(channel)==='play')
            SoundManager.pause(channel);
    }
    resume(channel){
        if(SoundManager.status(channel)==='pause')
            SoundManager.pause(channel);
    }
    fade(channel,time,to,stop=false){
        if(stop)
            SoundManager.fadeTo(channel,to/100,time,()=>SoundManager.stop(channel));
        else
            SoundManager.fadeTo(channel,to/100,time);
    }

    //动画类
    animate_horizontal(index,file,frame,row=1,interval=33,loop='forward'){
        let ani = new Animation();
        ani.setType('horizontal').setIndex(index).setFile(file)
           .setFrame(frame).setRow(row).setInterval(interval)
           .setLoopType(loop)
           .exec();
        SpriteManager.insert(index,ani);
    }
    animate_vertical(index,file,frame,column=1,interval=33,loop='forward'){
        let ani = new Animation();
        ani.setType('vertical').setIndex(index).setFile(file)
           .setFrame(frame).setColumn(column).setInterval(interval)
           .setLoopType(loop)
           .exec();
        SpriteManager.insert(index,ani);
    }
    animate_multifiles(index,files,interval=33,loop=true,delay=0){
        let ani = new Animation();
        ani.setType('multifiles').setIndex(index).setFile(files)
           .setInterval(interval).setLoop(loop).setDelay(delay)
           .exec();
        SpriteManager.insert(index,ani);
    }
    animate_start(index){
        let sp = SpriteManager.fromIndex(index);
        if(!sp)
            return Err.warn("精灵(index="+index+")不存在，此命令忽略执行");
        sp.start();
    }
    animate_cell(index,frame){
        let sp = SpriteManager.fromIndex(index);
        if(!sp)
            return Err.warn("精灵(index="+index+")不存在，此命令忽略执行");
        sp.cell(frame);
    }
    animate_stop(index){
        let sp = SpriteManager.fromIndex(index);
        if(!sp)
            return Err.warn("精灵(index="+index+")不存在，此命令忽略执行");
        sp.stop();
    }

    //文本类
    textsprite(index,text,color=0xffffff,size=24,font="sans-serif",width=-1,height=-1,xinterval=0,yinterval=3,extrachar="...",bold=false,italic=false,strike=false,under=false,shadow=false,shadowcolor=0x0,stroke=false,strokecolor=0x0){
        var tsp = new TextSprite();
        tsp.setIndex(index).setText(text).setColor(color).setSize(size).setFont(font)
           .setTextWidth(width).setTextHeight(height).setXInterval(xinterval).setYInterval(yinterval)
           .setExtraChar(extrachar).setBold(bold).setItalic(italic)/*.setStrike(strike).setUnder(under)*/
           .setShadow(shadow).setShadowColor(shadowcolor).setStroke(stroke).setStrokeColor(strokecolor)
           .exec();
        SpriteManager.insert(index,tsp);
    }

    textwindow(fileOrColor,opacity,pos,rect,xInterval,yInterval) {
        let tw = SpriteManager.fromIndex(this.textWindowIndex);
        if(!tw || !(tw instanceof TextWindow))
            return Err.warn("文字框(index="+this.textWindowIndex+")不存在或该Index对应的不是一个文字框，此命令忽略执行");


        if(typeof pos !== 'undefined') tw.setPosition(pos);
        if(typeof rect !== 'undefined') tw.setTextRectangle(rect);
        if(typeof xInterval !== 'undefined') tw.setXInterval(xInterval);
        if(typeof yInterval !== 'undefined') tw.setYInterval(yInterval);

        if(typeof fileOrColor === 'number')
            tw.setBackgroundColor(fileOrColor);
        else if(fileOrColor)
            tw.setBackgroundFile(fileOrColor);

        if(typeof opacity !== 'undefined') tw.setOpacity(opacity);
    }

    messagelayer(index,active=true){
        let currentWindow = SpriteManager.fromIndex(this.textWindowIndex);
        let targetWindow = SpriteManager.fromIndex(index);
        if(!targetWindow || targetWindow.name!='TextWindow')    //未找到文字框或不是文字框
        {
            if(targetWindow) targetWindow.destroy();
            let tw = currentWindow.clone();
            tw.setIndex(index);
            tw.clearText();
            SpriteManager.insert(index,tw);
            this.textWindowIndex = index;

            this.stage.addChild(tw);
            SpriteManager.setZorder(index,tw.zorder);
        }

        if(active){
            this.textWindowIndex = index;
        }
    }

    texton(){
        let tw = SpriteManager.fromIndex(this.textWindowIndex);
        if(!tw || !(tw instanceof TextWindow))
            return Err.warn("文字框(index="+this.textWindowIndex+")不存在或该Index对应的不是一个文字框，此命令忽略执行");

        tw.setVisible(true);
    }

    textoff(){
        let tw = SpriteManager.fromIndex(this.textWindowIndex);
        if(!tw || !(tw instanceof TextWindow))
            return Err.warn("文字框(index="+this.textWindowIndex+")不存在或该Index对应的不是一个文字框，此命令忽略执行");

        tw.setVisible(false);
    }

    text(text){
        let tw = SpriteManager.fromIndex(this.textWindowIndex);
        if(!tw || !(tw instanceof TextWindow))
            return Err.warn("文字框(index="+this.textWindowIndex+")不存在或该Index对应的不是一个文字框，此命令忽略执行");

        tw.drawText(text);
    }

}


function removeRecursive(sprite){
    for (var i = sprite.children.length - 1; i >= 0; i--) {
        removeRecursive(sprite.children[i])
    };
    SpriteManager.remove(sprite.index);
}


const Y = f =>
    (x => f(y => x(x)(y)))
    (x => f(y => x(x)(y)))


module.exports = Iceleaf;