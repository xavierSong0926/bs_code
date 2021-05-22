const { generateKeyPair } = require('crypto');

var ret = generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret'
  }
}, (err, publicKey, privateKey) => {
  // Handle errors and use the generated key pair.
  console.log("err",err)
  console.log("publicKey:\n",publicKey)
  console.log("privateKey:\n",privateKey)
});
console.log("ret",ret)