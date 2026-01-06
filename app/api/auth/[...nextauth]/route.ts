import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
interface JwtPayload {
  exp: number;
  iat: number;
  sub: string;
  // Add other fields from your token if needed
  [key: string]: any;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Call your existing BE login API
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const dataLogin = await res.json();

          if (res.ok && dataLogin) {
            const resMe = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/me`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${dataLogin.accessToken}`,
              },
            });
            const user = await resMe.json();
            // STEP 1: Here, we gonna set information to jwt callback functions(this token is next auth token, not BE token)
            return {
              id: user.id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
              accessToken: dataLogin.accessToken,
              refreshToken: dataLogin.refreshToken,
              ...user, // Include all user data
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    //Server-side storage (what gets saved in the encrypted token)
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      //STEP 2: Here, we gonna set information to jwt token
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.id = user.id;
        token.user = user;

        // Decode and store expiration
        if (user.accessToken) {
          try {
            const decoded = jwtDecode<JwtPayload>(user.accessToken);
            token.accessTokenExpires = decoded.exp * 1000; // Convert to milliseconds
          } catch (error) {
            console.error("Failed to decode token:", error);
            // Fallback: 15 minutes from now
            token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
          }
        }
        return token;
      }
      // If trigger is 'update' (for manual session updates)
      if (trigger === "update" && session?.accessToken) {
        token.accessToken = session.accessToken;
        token.refreshToken = session.refreshToken || token.refreshToken;

        // Recalculate expiration
        if (session.accessToken) {
          try {
            const decoded = jwtDecode<JwtPayload>(session.accessToken);
            token.accessTokenExpires = decoded.exp * 1000;
          } catch (error) {
            console.error("Failed to decode updated token:", error);
          }
        }
        return token;
      }
      // Check if token is expired (with 30-second buffer)
      const now = Date.now();
      const expiresAt: any = token.accessTokenExpires || 0;
      console.log("@@@expiresAt", expiresAt);
      console.log("@@@now", now);

      if (now < expiresAt - 60000 ) {
        // Token still valid
        console.log("still valid");
        return token;
      }

      // Token expired or about to expire, refresh it
      const newToken = await refreshAccessToken(token);
      console.log("@@@newToken", newToken);
      return newToken;
    },

    async session({ session, token }) {
      // Send properties to the client
      //STEP 3: Here, we gonna set information session
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
        ...(token.user as object),
      };
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      if (token) {
        session.error = token.error;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
  },

  session: {
    strategy: "jwt", // Use JWT for session (recommended)
    // maxAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// Refresh token function
async function refreshAccessToken(token: any) {
  try {
    if (!token.refreshToken) {
      throw new Error("No refresh token available");
    }

    // Call your refresh endpoint
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    // Decode the new access token
    let accessTokenExpires = Date.now() + 15 * 60 * 1000; // Default fallback
    if (refreshedTokens.accessToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(refreshedTokens.accessToken);
        accessTokenExpires = decoded.exp * 1000;
      } catch (error) {
        console.error("Failed to decode refreshed token:", error);
        return error;
      }
    }

    return {
      ...token,
      user:{
        ...token.user,
        accessToken: refreshedTokens.accessToken,
        refreshToken: refreshedTokens.refreshToken
      },
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires,
      refreshToken: refreshedTokens.refreshToken || token.refreshToken,
    };
  } catch (error) {
    console.error("RefreshAccessTokenError", error);

    return {
      // ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
