export interface DynamicObject {
  [key: string]: any;
}

export type HttpMethods = "POST" | "GET" | "PATCH" | "PUT" | "DELETE";

export type Accept = "application/json";
export type ContentType = "application/json" | "multipart/form-data";

export type Headers = {
  Accept?: Accept;
  "Content-Type"?: ContentType;
  Authorization?: string;
  [key: string]: string;
  
};

export type APIParams = {
  method: string;
  endpoint?: string;
  payload?: any;
  baseURL?: string;
  ContentType?: string;
  isToken?: boolean;
  headers?: Headers;
  isFormData?: boolean;
  file?: string;
  toJSON?: boolean;
};

export type APIOption = {
  method: string;
  headers: Headers;
  credentials?: RequestCredentials;
  body?: string | FormData | Blob;
};

export interface ActionParams {
  [index: string]: any;
  payload?: {};
  successCallback?: (response?: any) => void;
  errorCallback?: (response?: any) => void;
}
