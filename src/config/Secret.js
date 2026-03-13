import CryptoJS from "crypto-js";

export const deCryptData = (data) => {
  const value =
    (data &&
      CryptoJS.AES.decrypt(data, "lljhdskjhdghjdfklsghdslkkjldfghds8934574jhbnj345b4kjhdyufdbnr345h34u5nbmebfhdui")?.toString(CryptoJS.enc.Utf8)) ||
    null;
  return value && JSON.parse(value);
};
export const enCryptData = (data) => {
  const value =
    data && CryptoJS.AES.encrypt(JSON.stringify(data), "lljhdskjhdghjdfklsghdslkkjldfghds8934574jhbnj345b4kjhdyufdbnr345h34u5nbmebfhdui")?.toString();
  return value;
};
