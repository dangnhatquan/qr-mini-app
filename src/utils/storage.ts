import { nativeStorage } from "zmp-sdk/apis";

const NODE_ENV = import.meta.env.VITE_NODE_ENV || "development";

export const setString = (key: string, value: string): void => {
  try {
    if (NODE_ENV === "testing") {
      nativeStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn(`[storage] set ${key} failed:`, e);
  }
};

export const getString = (key: string): string | null => {
  try {
    if (NODE_ENV === "testing") {
      const result = nativeStorage.getItem(key);
      return result === null ? null : String(result);
    } else {
      return localStorage.getItem(key);
    }
  } catch (e) {
    console.warn(`[storage] get ${key} failed:`, e);
    return null;
  }
};

export const removeItem = (key: string): void => {
  try {
    if (NODE_ENV === "testing") {
      nativeStorage.removeItem(key);
    } else {
      localStorage.removeItem(key);
    }
  } catch (e) {
    console.warn(`[storage] remove ${key} failed:`, e);
  }
};

export const clearStorage = (): void => {
  try {
    if (NODE_ENV === "testing") {
      nativeStorage.clear();
    } else {
      localStorage.clear();
    }
  } catch (e) {
    console.warn(`[storage] clear failed:`, e);
  }
};
