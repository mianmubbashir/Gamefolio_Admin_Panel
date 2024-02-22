export interface Credit {
  credits: number;
  lastUsedAt: string;
}

export interface UserData {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilePicture: string;
}

export interface ImageResponse {
  content: string;
  imageUrls: string[];
}

export interface INextLegImgResp {
  progress: number;
  response: ImageResponse;
}

export interface IGalleryResponse {
  items: ImageResponse[];
  limit?: number;
  page: number;
  total_pages?: number;
}
