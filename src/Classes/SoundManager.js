var Howler = require('../Library/howler.js/howler');
var Err = require('./ErrorHandler');

/*By default, audio on iOS is locked until a sound is played within a user interaction,
* and then it plays normally the rest of the page session (Apple documentation).
* The default behavior of howler.js is to attempt to silently unlock audio playback by
* playing an empty buffer on the first touchend event.
* This behavior can be disabled by calling:
*/
Howler.iOSAutoEnable = false;

let Channels = [],
    Resolve = [];

export function getChannel(index) {
    return new Promise((resolve, reject) => {
        let ch = Channels[index];
        if (ch)
            resolve(ch);
        else {
            Err.warn('通道'+channel+'未初始化，请先调用.load()方法');
            reject();
        }
    })
}

export function setChannel(index, options) {
    return new Promise((resolve, reject) => {
        if (!options.file) {
            Err.error('[setChannel] file needed in options');
        }

        options = Object.assign({
            autoplay: true,
            buffer: false,
            loop: true,
            volume: 1,
            onEnd: () => {},
            onPlay: () => {},
            onLoad: () => {}
        }, options);

        let ch = Channels[index];
        if (ch) {
            ch.stop();
            ch.unload();
            Channels[index] = ch = null
        }
        Channels[index] = ch = new Howler.Howl({
            urls: (options.file instanceof Array)?options.file:[options.file],
            autoplay: options.autoplay,
            buffer: options.buffer,
            loop: options.loop,
            volume: options.volume,
            onend: () => {
                if (Resolve[index]) {
                    Resolve[index]();
                    Resolve[index] = null;
                }
                options.onEnd && options.onEnd()
            },   //如何处理？
            onplay: options.onPlay, //如何处理？ waitButton
            onload: () => {
                resolve(ch);
            }
        })
    })
}

// methods
export function setVolume(channel, value) {    //value区间0-1
    return getChannel(channel)
    .then(ch => ch.volume(value))
}
export function setPosition(channel, value) {  //value单位是秒
    return getChannel(channel)
    .then(ch => ch.pos(value))
}
export function play(channel) {
    return getChannel(channel)
    .then(ch => {
        ch.play();
        ch.m_status = 'play';
    })
}

export function pause(channel) {
    return getChannel(channel)
    .then(ch => {
        ch.pause();
        ch.m_status = (ch.m_status==='pause')?'play':'pause';
    })
}
export function stop(channel) {
    return getChannel(channel)
    .then(ch => {
        ch.stop();
        ch.unload();
    })
}
export function fade(channel,from,to,duration,cb) {
    return getChannel(channel)
    .then(ch => {
        from != null && ch.volume(from);
        if (ch.m_status !== 'play') {
            ch.play();
        }
        if (cb) {
            ch.fade(ch.volume(),to,duration,cb);
        } else {
            return new Promise((resolve, reject) => {
                ch.fade(ch.volume(),to,duration,resolve);
            });
        }
    })
}
export function stopAll() {
    if(Channels.length)
        for(let ch of Channels){
            ch.stop();
            ch.unload();
        }
}
export function state(channel) {
    return getChannel(channel)
    .then(ch => {
        return ch.m_status;
    })
}
export function wait(channel) {
    return new Promise((resolve, reject) => {
        Resolve[channel] = resolve;
    })
}
