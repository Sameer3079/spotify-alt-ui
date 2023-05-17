import { type Session } from "next-auth";
import NavBarMenu from "./navBarMenu";

export default function NavBar({ session }: { session: Session | null }) {
  return (
    <>
      <div className="flex h-14 w-full items-center bg-white shadow-lg">
        <div className="ml-auto">
          <NavBarMenu session={session} />
        </div>
      </div>
    </>
  );
}
