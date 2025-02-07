const express = require('express');
const rsa = require("./rsa")
const ed25519 = require("./ed25519")
const base64 = require("./base64")
const path = require('path')
const bodyParser = require('body-parser');

const app = express();
const port = 3000

// app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/static', express.static(path.join(__dirname, 'static')))
app.set("view options", { layout: false });
app.engine('html', require('ejs').renderFile);


app.use(bodyParser.text({type: '*/*'}),(req, res, next) => {
    console.log(new Date().toISOString() + "| " + req.method + ": " + req.url);
    console.log(new Date().toISOString() + "| header: ");
    console.log(JSON.stringify(req.headers,null,4));
    console.log("| body: ");
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
    let msg = body.encStr
    if (typeof body.encStr === 'object') {
        msg = JSON.stringify(body.encStr)
    }
    var result = rsa.encryptByPublic(msg, body.publicKey)
    console.log(result);
    res.status(201).json({
        "data": result
    })
});

app.post('/rsaPriSign', async (req, res) => {
    let body = req.body
    if (body.privateKey === undefined ||
        body.message === undefined) {
        res.status(400).json({
            "message": "Request body [privateKey] or [message] is missing"
        })
        return
    }
    let msg = body.message
    if (typeof body.message === 'object') {
        msg = JSON.stringify(body.message)
    }
    var result = rsa.signByPrivateKey(msg, body.privateKey, body.alg)
    console.log(result);
    res.status(201).json({
        "data": result
    })
});

// 請搭配 ngrok 服用
app.post('/callbackTest', (req, res) => {
    res.status(200).json({
        "status": "callback success"
    })
})
app.put('/callbackTest', (req, res) => {
    
    res.status(200).json({
        "status": "callback success"
    })
})

app.get('/redirectTest', (req, res) => {
    res.render("redirect.html", {
        data: JSON.stringify(req.query)
    })
})

app.listen(3000, () => {
    console.log(`Utils server listening on port ${port}`)
})

function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
};
