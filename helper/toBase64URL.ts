export const toBase64URL = (json: any | string) => {
  const jsonString = typeof json === "string" ? json : JSON.stringify(json);
  const byteArray = Buffer.from(jsonString);
  return byteArray.toString("base64").replace(/[\+\/=]/g, "-");
};
