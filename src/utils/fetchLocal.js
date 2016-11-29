export default function fetchLocal(url) {
  return new Promise(function(resolve, reject) {
    resolve({
      json: function() {
        return new Promise(function(resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.onload = function() {
            resolve(JSON.parse(xhr.responseText));
          }
          xhr.onerror = function() {
            reject(new TypeError('Local request failed'));
          }
          xhr.open('GET', url);
          xhr.send(null);
        });
      },
      text: function() {
        return new Promise(function(resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.onload = function() {
            resolve(xhr.responseText);
          }
          xhr.onerror = function() {
            reject(new TypeError('Local request failed'));
          }
          xhr.open('GET', url);
          xhr.send(null);
        });
      }
    });
  });
}
