import { useNavigate } from "react-router";
import { toastError, toastSuccess } from "../components/Toast/Toast";
import { ROUTES } from "../labels/routes";
import { removeFromLocal } from "./localStorage";

export const apiErrors = (
  endpoint: string,
  errorCallback: (errMsg: {}) => void,
  errMsg: any
) => {
  console.log(`❌ ERR ${[endpoint]} ====> `, errMsg);
  if (errMsg.message) {
    errorCallback(errMsg);
  }
};

export const apiResponses = (endpoint: string, resp: any) => {
  console.log(`✅ Response ${[endpoint]}`, resp);
};

export const getTime = (datetime: string) => {
  return new Date(datetime).toLocaleTimeString("en", {
    minute: "2-digit",
    hour: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
};

export const truncateText = (text: string, charLength: number = 50) => {
  if (text.length > charLength) {
    return `${text.slice(0, charLength - 3)}...`;
  }
  return text;
};

export const nFormatter = (num: number | string) => {
  num = Number(num);
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "G";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
};

declare type PlaceholderValue = "blur" | "empty";
type ImgPropsType = {
  src: string;
  alt: string;
  width: 0;
  height: 0;
  sizes: string;
  placeholder?: PlaceholderValue | undefined;
  blurDataURL?: string | undefined;
};

export const imgProps = (
  src: string,
  alt: string,
  blurDataURL?: string
): ImgPropsType => {
  return {
    src: src || "",
    alt: alt || "",
    width: 0,
    height: 0,
    sizes: "100%",
    // placeholder: "blur",
    blurDataURL: blurDataURL || src, // default will be src if not provided
  };
};

export const copyToClipboard = async (textToCopy: string) => {
  try {
    await navigator.clipboard.writeText(textToCopy);
    toastSuccess("Copied to clipboard");
  } catch (err) {
    console.error("Failed to copy:", err);
    toastError("Failed to copy");
  }
};

export const generateUniqueRoomId = () => {
  const uniqueNumber = Math.floor(Math.random() * 9000) + 1000;
  return uniqueNumber;
};

export const handleLogout = (navigate: Function) => {
  removeFromLocal("@token");
  removeFromLocal("@userData");
  navigate(ROUTES.login);
};
