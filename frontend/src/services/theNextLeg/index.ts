import { INextLegImgResp } from "@/types/ApiResponse";

export const getImageResponse = async (
  messageId: string
): Promise<INextLegImgResp> => {
  try {
    const response = await fetch(
      `https://api.thenextleg.io/v2/message/${messageId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer 73feee55-9c74-4615-88a7-e5339222bff5`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) throw new Error();

    return await response.json();
  } catch (error: any) {
    throw new Error(error);
  }
};
