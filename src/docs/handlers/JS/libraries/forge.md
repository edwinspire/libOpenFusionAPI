# `forge`

[External Documentation](https://github.com/digitalbazaar/forge) 

A native implementation of TLS (and various other cryptographic tools) in JavaScript.

*   Returns: Read documentation

#### Example

```javascript

const pki = forge.pki;
const keys = pki.rsa.generateKeyPair(2048);
const pem = pki.encryptRsaPrivateKey(keys.privateKey, 'password');
$_RETURN_DATA_ = pem;
      
```

