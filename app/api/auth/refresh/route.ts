// pages/api/auth/refresh.ts
import axios from "axios";

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();

  const { refreshToken } = body;
  // const { name } = body;
  console.log("@@@refreshToken",refreshToken);

  // // e.g. Insert new user into your DB
  // const newUser = { id: Date.now(), name };
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