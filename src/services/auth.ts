import { authZaloLoginResource } from "@/resources";
import { LoginResponse } from "@/types/auth";
import request from "@/utils/axios";
import { BYPASS_ZALO_ACCESS_TOKEN } from "@/utils/constants/common";
import { isEmpty } from "radash";

import { getAccessToken } from "zmp-sdk";

async function loginWithZaloToken(zaloAccessToken: string): Promise<LoginResponse> {
  try {
    const response = await request.post<LoginResponse, { accessToken: string }>(
      authZaloLoginResource,
      {
        accessToken: isEmpty(zaloAccessToken) ? BYPASS_ZALO_ACCESS_TOKEN : zaloAccessToken,
      },
    );

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Login failed";

    throw new Error(message);
  }
}

async function getZaloAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    getAccessToken({
      success: (accessToken: string) => resolve(accessToken),
      fail: (err: unknown) => reject(err),
    });
  });
}

export async function loginWithZalo(): Promise<LoginResponse> {
  const zaloAccessToken = await getZaloAccessToken();
  const loginResponse = await loginWithZaloToken(zaloAccessToken);
  return loginResponse;
}
