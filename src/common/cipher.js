import CryptoJS from 'crypto-js'
import { JSEncrypt } from 'jsencrypt';

function sha1(plaintext) {
  return  CryptoJS.SHA1(plaintext).toString();
}

function sha1WithBase64(plaintext) {
  return  CryptoJS.SHA1(plaintext).toString(CryptoJS.enc.Base64);
}

function aesWithBase64Encrypt(plaintext, key) {
  let utf8Key = CryptoJS.enc.Utf8.parse(key);
  
  let encrypted = CryptoJS.AES.encrypt(plaintext, utf8Key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).ciphertext

  let base64Encrypted = encrypted.toString(CryptoJS.enc.Base64)
  return base64Encrypted
}

function aesWithBase64Decrypt(ciphertext, key) {
  let utf8Key = CryptoJS.enc.Utf8.parse(key);
  let decrypted = CryptoJS.AES.decrypt(ciphertext, utf8Key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })

  return decrypted.toString(CryptoJS.enc.Utf8)
}

function rsaWithBase64Encrypt(plaintext, publicKey) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);
  let ciphertext = encryptor.encrypt(plaintext);
  return ciphertext
}

function rsaWithBase64Decrypt(ciphertext, privateKey) {
  const encryptor = new JSEncrypt();
  encryptor.setPrivateKey(privateKey);
  let plaintext = encryptor.decrypt(ciphertext);
  return plaintext
}


function sha1WithRsaWithBase64Sign(plaintext, privateKey) {
  const sign = new JSEncrypt();
  sign.setPrivateKey(privateKey);
  let signature = sign.sign(plaintext, CryptoJS.SHA1, "sha1");
  return signature
}

function sha1WithRsaWithBase64Verify(plaintext, signature, publicKey) {
  let verify = new JSEncrypt();
  verify.setPublicKey(publicKey);
  return verify.verify(plaintext, signature, CryptoJS.SHA1);
}

function sha1WithRsaWithBase64Encrypt(plaintext, publicKey) {
  let encrypted = sha1(plaintext)
  // console.log("sha1", encrypted)
  return rsaWithBase64Encrypt(encrypted, publicKey)
}

function sha1WithBase64WithRsaWithBase64Encrypt(plaintext, publicKey) {
  let encrypted = sha1WithBase64(plaintext)
  // console.log("sha1", encrypted)
  return rsaWithBase64Encrypt(encrypted, publicKey)
}

export default {
  sha1,
  aesWithBase64Encrypt,
  aesWithBase64Decrypt,
  rsaWithBase64Encrypt,
  rsaWithBase64Decrypt,
  sha1WithRsaWithBase64Sign,
  sha1WithRsaWithBase64Verify,
  sha1WithRsaWithBase64Encrypt,
  sha1WithBase64WithRsaWithBase64Encrypt,
}