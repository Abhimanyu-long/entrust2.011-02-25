import CryptoJS from 'crypto-js';
const SECRET_KEY = 'FOPS_SYNCENTRUST';

function encryptData(data) {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(SECRET_KEY), {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  const ivEncrypted = iv.concat(encrypted.ciphertext);
  const base64 = CryptoJS.enc.Base64.stringify(ivEncrypted);
  const urlSafe = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return urlSafe;
}

function decryptData(cipherText) {
  let base64 = cipherText.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }

  const ivEncrypted = CryptoJS.enc.Base64.parse(base64);
  const iv = CryptoJS.lib.WordArray.create(ivEncrypted.words.slice(0, 4));
  const ciphertext = CryptoJS.lib.WordArray.create(ivEncrypted.words.slice(4));

  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: ciphertext },
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    }
  );

  const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedStr);
}

// function decryptData(cipherText) {
//   let base64 = cipherText.replace(/-/g, '+').replace(/_/g, '/');
//   while (base64.length % 4) {
//     base64 += '=';
//   }

//   const ivEncrypted = CryptoJS.enc.Base64.parse(base64);
//   const iv = CryptoJS.lib.WordArray.create(ivEncrypted.words.slice(0, 4));
//   const ciphertext = CryptoJS.lib.WordArray.create(ivEncrypted.words.slice(4));

//   const decrypted = CryptoJS.AES.decrypt(
//     { ciphertext: ciphertext },
//     CryptoJS.enc.Utf8.parse(SECRET_KEY),
//     {
//       iv: iv,
//       padding: CryptoJS.pad.Pkcs7,
//       mode: CryptoJS.mode.CBC,
//     }
//   );

//   const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
//   // Decode URI components if needed
//   const originalData = JSON.parse(decryptedStr);
//   return decodeURIComponent(originalData);
// }

export { encryptData, decryptData };
