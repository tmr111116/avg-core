
let HOST = '/';
let IMAGEQUEUE = [];
let loadedUrl = [];

let CALLBACKS = {
    loading: null
}

export function setHost(host) {
    HOST = host;
}

export function addImage(url) {
    if (IMAGEQUEUE.indexOf(url) === -1 && loadedUrl.indexOf(url) === -1) {
        IMAGEQUEUE.push(url);
    }
}

export function imageLoop() {
    let url = IMAGEQUEUE.pop();
    downloadImage(url)
    .then(() => setTimeout(imageLoop, 200));
}

export function downloadImage(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = HOST + url;
        img.onload = () => {
            loadedUrl.push(url);
            resolve(url);
        }
    });
}

// export function getImage(url) {
//     if (loadedUrl.hasOwnProperty(url)) {
//         return Promise.resolve(loadedUrl[url]);
//     } else {
//         return Promise.resolve()
//         .then(() => {
//             CALLBACKS.callback && CALLBACKS.callback();
//         })
//         .then(() => {
//             return new Promise((resolve, reject) => {
//                 let img = new Image();
//                 img.src = HOST + url;
//                 img.onload = () => {
//                     loadedUrl[url] = img;
//                     resolve(img);
//                 }
//             });
//         });
//     }
// }

export function registerLoadingCallback(callback) {
    CALLBACKS.callback = callback;
}

export async function ensureLoaded(url) {
    if (loadedUrl.indexOf(url) !== -1) {
        return url;
    } else {
        let x = await downloadImage(url);
        console.log(x)
        return x;
    }
}
