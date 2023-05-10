import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { sfPro, inter } from "../fonts";
import cx from "classnames";

import { api } from "~/utils/api";
import { Balancer } from "react-wrap-balancer";
import Spotify from "~/components/shared/icons/spotify";
import { useEffect, useState } from "react";
import NavBar from "~/components/shared/navbar";

function AuthSection({ isHidden }: { isHidden: boolean }) {
  const onSignInClick = () => {
    signIn()
      .then((res) => {
        console.log("signIn, then", res);
      })
      .catch((err) => {
        console.log("signIn, catch", err);
      });
  };
  return (
    <>
      <div
        className={
          "flex w-full justify-center " +
          (isHidden ? "animate-fade-up-reverse" : "")
        }
        style={{ animationDelay: "0.15s" }}
      >
        <div className="mt-5 flex h-min w-1/4 animate-fade-up justify-evenly opacity-0">
          <button className="flex items-center rounded-full bg-black px-4 py-2 text-green-500 shadow-none transition-all duration-500 hover:shadow-2xl">
            <Spotify className="mr-3 h-5 w-5" />
            <div>Join</div>
          </button>
          <button
            onClick={onSignInClick}
            className="flex items-center rounded-full bg-black px-4 py-2 text-green-500 shadow-none transition-all duration-500 hover:shadow-2xl"
          >
            <Spotify className="mr-3 h-5 w-5" />
            <div>Sign in</div>
          </button>
        </div>
      </div>
    </>
  );
}

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { data: session } = useSession();
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  useEffect(() => {
    if (session) {
      window.setTimeout(() => {
        setShowWelcome(true);
      }, 1500);
    }
  }, [session]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const fontClass: string = cx(sfPro.variable, inter.variable);

  return (
    <>
      <Head>
        <title>Spotify Alternate UI</title>
        <meta
          name="description"
          content="Spotify alternate UI built by Sameer Basil"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar session={session} />
      <main
        className={
          "flex min-h-screen flex-col items-center justify-center " + fontClass
        }
      >
        <div className="flex h-56 w-full flex-wrap justify-center">
          <div className="max-content flex w-full justify-center">
            <span
              className="absolute w-max animate-minimize-logo text-4xl md:text-7xl"
              style={{
                animationDelay: "4s",
                left: "50%",
                top: "30%",
                transform: "translateX(-50%)",
              }}
            >
              <h1 className="animate-fade-up bg-gradient-to-br from-black to-green-700 bg-clip-text text-center font-display font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm">
                <Balancer>Spotify Alternate UI</Balancer>
              </h1>
            </span>
          </div>

          {showWelcome ? (
            <h1
              className="animate-fade-up bg-gradient-to-br from-black to-green-700 bg-clip-text py-5 text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-7xl md:leading-[5rem]"
              style={{ animationDelay: "0.15s" }}
            >
              <Balancer>Welcome {session?.user.name}</Balancer>
            </h1>
          ) : null}

          <AuthSection isHidden={!!session} />
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
