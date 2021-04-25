var crypto = require('crypto')

const passphrase = 'sample-crypto-phrase' 

function encrypt ( string ) {
  const cipher = crypto.createCipher( 'aes-256-cbc', passphrase )
  let crypted = cipher.update(string, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

function decrypt ( string ) {
  const decipher = crypto.createDecipher( 'aes-256-cbc', passphrase)
  let decrypted = decipher.update(string, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

module.exports = { encrypt, decrypt }