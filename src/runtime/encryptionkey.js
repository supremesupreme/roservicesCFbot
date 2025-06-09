// encryptionkey.js
import { getGlobalConfig } from "./inital";

export function getEncryptionKey() {
  const { encryptionKey } = getGlobalConfig();
  return encryptionKey;
}
