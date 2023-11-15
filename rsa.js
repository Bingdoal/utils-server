const NodeRSA = require('node-rsa');
const crypto = require('crypto');
const rs = require('jsrsasign');

const Rsa = {
    encryptByPublic(message, publicKey) {
        if (publicKey.startsWith("-----BEGIN PUBLIC KEY-----")) {
            publicKey = publicKey.replace("-----BEGIN PUBLIC KEY-----", "")
        }
        if (publicKey.endsWith("-----END PUBLIC KEY-----")) {
            publicKey = publicKey.replace("-----END PUBLIC KEY-----", "")
        }
        publicKey = publicKey.trim();

        const key = new NodeRSA(publicKey, "public", {
            encryptionScheme: "pkcs1"
        });
        console.log("rsa encrypt message: ", message);
        const encrypted = key.encrypt(message, 'base64');
        return encrypted
    },
    signByPrivateKey(message, privateKey, alg) {
        privateKey = privateKey.trim();
        if (!privateKey.startsWith("-----BEGIN PRIVATE KEY-----")) {
            privateKey = "-----BEGIN PRIVATE KEY-----\n" + privateKey;
        }
        if (!privateKey.endsWith("-----END PRIVATE KEY-----")) {
            privateKey = privateKey + "\n-----END PRIVATE KEY-----\n";
        }
        if (alg == undefined || alg == null){
            alg = "SHA1withRSA";
        }
        let key = rs.KEYUTIL.getKey(privateKey);
        const sign = new rs.KJUR.crypto.Signature({alg: alg})
        sign.init(key);
        sign.updateString(message);
        let originSignStr = sign.sign();
        return rs.hextob64(originSignStr);
    }
}

module.exports = Rsa