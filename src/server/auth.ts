import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  TokenSet,
} from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, user }) {
      const [spotify] = await prisma.account.findMany({
        where: { userId: user.id, provider: "spotify" },
      })
      if (!spotify) { return session }
      if (spotify.expires_at! * 1000 < Date.now()) {
        console.debug(`Token has expired.`)
        // If the access token has expired, try to refresh it
        try {
          // https://accounts.google.com/.well-known/openid-configuration
          // We need the `token_endpoint`.
          const stringInput = env.SPOTIFY_CLIENT_ID + ':' + env.SPOTIFY_CLIENT_SECRET
          const buffer: Buffer = Buffer.from(stringInput);
          const authHeader = 'Basic ' + (buffer.toString('base64'));

          const jsonData = {
            grant_type: 'refresh_token',
            refresh_token: spotify.refresh_token!,
          };
          const formBody = [];
          type qwe = keyof typeof jsonData;
          let property: qwe;
          for (property in jsonData) {
            const encodedKey = encodeURIComponent(property);
            const encodedValue = encodeURIComponent(jsonData[property]);
            formBody.push(encodedKey + "=" + encodedValue);
          }
          const formData = formBody.join("&")

          const response = await fetch(`https://accounts.spotify.com/api/token?grant_type=${'authorization_code'}&refresh_token=${spotify.refresh_token!}`, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              'Authorization': 'Basic ' + (buffer.toString('base64'))
            },
            body: formData,
            method: "POST",
          })

          const tokens: TokenSet = await response.json() as TokenSet

          if (!response.ok) throw tokens
          console.debug(`Token has been refreshed.`)

          await prisma.account.update({
            data: {
              access_token: tokens.access_token,
              expires_at: Math.floor(Date.now() / 1000 + (tokens.expires_in as number)),
              refresh_token: tokens.refresh_token ?? spotify.refresh_token,
            },
            where: {
              provider_providerAccountId: {
                provider: "spotify",
                providerAccountId: spotify.providerAccountId,
              },
            },
          })
        } catch (error) {
          console.error("Error refreshing access token", error);
          // The error property will be used client-side to handle the refresh token error
          (<{ error: string }><unknown>session).error = "RefreshAccessTokenError"
        }
      }
      return session
    }
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    SpotifyProvider({
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: {
          redirect_uri: `${env.NEXTAUTH_URL}/api/auth/callback/spotify`,
          scope: [
            'user-read-playback-state',
            'user-modify-playback-state',
            'user-read-currently-playing',
            'app-remote-control',
            'streaming',
            'playlist-read-private',
            'playlist-read-collaborative',
            'playlist-modify-private',
            'playlist-modify-public',
            'user-read-playback-position',
            'user-top-read',
            'user-read-recently-played',
            'user-library-modify',
            'user-library-read'
          ].join(' '),
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
