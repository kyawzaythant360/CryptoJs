const express = require("express");
const CryptoJs = require("crypto-js");
const cors = require("cors")
const bodyParser = require("body-parser");

const app = express();

app.use(cors());

app.use(bodyParser.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}))

app.get('/',(req,res)=>{
    res.send("Hello World!");
})


// Encryption

function encrypt(data,key){
    const ChiperText = CryptoJs.AES.encrypt(data,key).toString();
    return ChiperText;
}

// Decryption

function decrypt(ChiperText,key){
    try {
        const bytes = CryptoJs.AES.decrypt(ChiperText,key);

        if(bytes.sigBytes > 0){
            const decryptedData = bytes.toString(CryptoJs.enc.Utf8);
            return decryptedData;
        }

    } catch (error) {
        console.error(error.message)
    }
}
app.post("/post",(req,res)=>{
    const { data,key } = req.body;
    const encryptedData = encrypt(data,key);
    res.json({encryptedData});
})

app.post("/data",(req,res)=>{
    const {encryptedData,key} = req.body;

    const decryptedData = decrypt(encryptedData,key);
    res.json({ decryptedData })
})

module.exports = app;
