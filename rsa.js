const NodeRSA = require('node-rsa');
const crypto = require('crypto');
const rs = require('jsrsasign');

const Rsa = {
    decryptByPrivate(message, privateKey) {
        if (!privateKey.startsWith("-----BEGIN PRIVATE KEY-----")) {
            privateKey = "-----BEGIN PRIVATE KEY-----\n" + privateKey;
        }
        if (!privateKey.endsWith("-----END PRIVATE KEY-----")) {
            privateKey = privateKey + "\n-----END PRIVATE KEY-----";
        }
        privateKey = privateKey.trim();

        // 建立 key 實例
        const key = new NodeRSA(privateKey);
        key.setOptions({ encryptionScheme: 'pkcs1' }); // 或 'pkcs1_oaep'，依加密方設定

        // 解密
        const decrypted = key.decrypt(message, 'utf8');

        return decrypted;
    },
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
        if (alg == undefined || alg == null) {
            alg = "SHA1withRSA";
        }
        let key = rs.KEYUTIL.getKey(privateKey);
        const sign = new rs.KJUR.crypto.Signature({ alg: alg })
        sign.init(key);
        sign.updateString(message);
        let originSignStr = sign.sign();
        return rs.hextob64(originSignStr);
    },
    signWithMD5(data, appKey, privateKeyBase64) {
        if (!data) throw new Error("Data cannot be null.");
        if (!privateKeyBase64 || privateKeyBase64.trim() === '') throw new Error("Key cannot be blank.");

        const message = getCombinationBytes(data, appKey);

        // 解析 base64 私鑰
        const privateKeyPem = `-----BEGIN PRIVATE KEY-----\n${privateKeyBase64}\n-----END PRIVATE KEY-----`;

        const signer = crypto.createSign('RSA-MD5');
        signer.update(message);
        signer.end();

        const signature = signer.sign(privateKeyPem);
        return signature.toString('base64');
    },
    genPriKeyFromPem(pem, type) {
        let pk = crypto.createPrivateKey({
            key: pem, // PEM 字串
            format: 'pem',
            type: type == undefined ? 'pkcs1' : type, // 或 'pkcs1'，取決於你的 key 類型
        });

        return pk.export({
            format: 'pem',
            type: 'pkcs8',
        })
    }
}

function getCombinationBytes(data, appKey) {
    let dataStr = typeof data === 'string' ? data : JSON.stringify(data);
    const combined = dataStr + appKey;
    return Buffer.from(combined, 'utf8');
}

module.exports = Rsa