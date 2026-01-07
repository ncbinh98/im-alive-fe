// pages/api/auth/refresh.ts
import { getCache, setNX } from "@/lib/cache";
import axios from "axios";
async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
export async function POST(request: Request) {
  await sleep(10);
  const body = await request.json();
  const { refreshToken, userId } = body;
  const redisRefreshTokenKey = `refreshToken:${userId}`;
  const cachedRefreshToken: any = await getCache(redisRefreshTokenKey);
  if (cachedRefreshToken) {
    return new Response(JSON.stringify(cachedRefreshToken), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE}/auth/refresh-token`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const isSuccess = await setNX(redisRefreshTokenKey, response.data, 1);
    console.log("@@@isSuccess", isSuccess);
    if (!isSuccess) {
      const cachedRefreshToken: any = await getCache(redisRefreshTokenKey);
      if (cachedRefreshToken) {
        return new Response(JSON.stringify(cachedRefreshToken), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
    return new Response(JSON.stringify(response.data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return new Response(JSON.stringify({ message: "Refresh failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
