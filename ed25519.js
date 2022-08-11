
const base64 = require("./base64")

module.exports = {
  sign(msg, privateKey) {
    ed = require('@noble/ed25519');
    var message = new TextEncoder("utf-8").encode(msg);
    var uintArray = base64.decode(privateKey);
    return ed.sign(message, uintArray.subarray(0, 32))
  }
}