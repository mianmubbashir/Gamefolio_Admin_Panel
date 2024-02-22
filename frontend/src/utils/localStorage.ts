export type Key = "@token" | "@userData" | "@msgId";

export const setToLocal = (key: Key, value: string | Object) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    console.log(`❌ ERR [(setToLocal${key})] =====> `, e);
  }
};

export const getFromLocal = (key: Key) => {
  try {
    if (typeof window !== "undefined") {
      const value = localStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value);
      } else {
        return null; // or handle the absence of the key as needed
      }
    }
  } catch (e) {
    console.log(`❌ ERR [getFromLocal(${key})] =====> `, e);
  }
};

export const removeFromLocal = (key: Key) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  } catch (e) {
    console.log(`❌ ERR [removeFromLocal(${key})] =====> `, e);
  }
};

export const removeAllFromLocal = () => {
  try {
    if (typeof window !== "undefined") {
      const keys = localStorage.getAllKeys();
      keys.forEach((key: string) => {
        localStorage.removeItem(key);
      });
    }
  } catch (e) {
    console.log("❌ ERR [removeAllFromLocal] =====> ", e);
  }
};

export const getCookieValue = (cookieName: any) => {
  const name = cookieName + "=";
  if (typeof document !== "undefined") {
    const decodedCookie = document.cookie;
    const cookieArray = decodedCookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
  }
  // Return null if the cookie is not found
  return null;
};

export const removeCookie = (cookieName: any) => {
  if (typeof document !== "undefined") {
    // Check if the cookie exists
    if (getCookieValue(cookieName)) {
      const expirationDate = new Date(0); // Set the expiration date to the past
      document.cookie = `${cookieName}=; expires=${expirationDate.toUTCString()}`;
    }
  }
};
