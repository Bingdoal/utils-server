const Rsa = {
    encrypt(message, pk) {
        const NodeRSA = require('node-rsa');
        if (pk.startsWith("-----BEGIN PUBLIC KEY-----")){
            pk = pk.replace("-----BEGIN PUBLIC KEY-----","")
        }
        if (pk.endsWith("-----END PUBLIC KEY-----")) {
            pk = pk.replace("-----END PUBLIC KEY-----", "")
        }
        pk = pk.trim();

        const key = new NodeRSA(pk, "public",{
            encryptionScheme: "pkcs1"
        });
        const encrypted = key.encrypt(message, 'base64');
        return encrypted
    }
}

module.exports = Rsa