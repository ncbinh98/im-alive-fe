import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
    async jwt({ token, user }) {
      // Initial sign in
      //STEP 2: Here, we gonna set information to jwt token
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      // Send properties to the client
      //STEP 3: Here, we gonna set information session
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        accessToken: token.accessToken as string,
        ...(token.user as object),
      };
      session.accessToken = token.accessToken as string;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login", // Error code passed in query string as ?error=
  },

  session: {
    strategy: "jwt", // Use JWT for session (recommended)
    maxAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
