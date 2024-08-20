const CryptoJS = require("crypto-js");

const pageNumber = 1;
const pageSize = 1;
const INTERNAL_SERVER_ERROR = "Internal server error";
const DATA_NOT_FOUND = "Data not found";
const VALIDATION_ERROR = "Validation error";

const TEMPLATE = {
    RESET_PASSWORD: "Reset Password"
}

function cryptoEncript(val){
    return CryptoJS.AES.encrypt(val, process.env.CRYPTO_SECRET_KEY).toString();
}

function cryptoDecrypt(val){
    return CryptoJS.AES.decrypt(val, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8);
}

const Common = {
    TEMPLATE,
    pageNumber,
    pageSize,
    cryptoEncript,
    cryptoDecrypt,
    INTERNAL_SERVER_ERROR,
    DATA_NOT_FOUND,
    VALIDATION_ERROR
}
module.exports = Common