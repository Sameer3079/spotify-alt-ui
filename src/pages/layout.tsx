import { useSession } from "next-auth/react";
import React from "react";
import NavBar from "~/components/NavBar/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  return (
    <>
      <NavBar session={session}></NavBar>
      {children}
    </>
  );
}
