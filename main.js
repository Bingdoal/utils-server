const express = require('express');
const rsa = require("./rsa")
const ed25519 = require("./ed25519")
const base64 = require("./base64")

const app = express();
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    console.log(req.method + ": " + req.path);
    if (req.body !== undefined &&
        req.body != null) {

    }
    console.log("input: ");
    console.log(req.body);
    next()
})

app.post('/ed25519', async (req, res) => {
    body = req.body;
    if (body.privateKey === undefined ||
        body.message === undefined) {
        res.status(400).json({
            "message": "Request body [privateKey] or [message] is missing"
        })
        return
    }

    ed25519.sign(body.message, body.privateKey).then((sign) => {
        res.status(201).json({
            "signature": base64.encode(sign)
        })
    }).catch((err) => {
        res.status(400).json({
            "message": err.toString()
        })
    })
});

app.post('/rsaPubEncrypt', async (req, res) => {
    let body = req.body
    if (body.publicKey === undefined ||
        body.encStr === undefined) {
        res.status(400).json({
            "message": "Request body [publicKey] or [encStr] is missing"
        })
        return
    }
    var result = rsa.encrypt(JSON.stringify(body.encStr), body.publicKey)
    console.log(result);
    res.status(201).json({
        "data": result
    })
});

app.listen(3000, () => {
    console.log(`Utils server listening on port ${port}`)
})