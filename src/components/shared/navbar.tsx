import { type Session } from "next-auth";
import Image from "next/image";

function AccountButton({ name, image }: { name: string; image: string }) {
  return (
    <div className="ml-auto mr-4 mt-1 flex h-min max-w-max cursor-pointer items-center rounded-full bg-stone-200 shadow-md transition-all duration-500 hover:bg-green-500">
      <div className="hidden items-center md:flex">
        <span className="px-3 align-middle font-bold">{name}</span>
      </div>
      <Image
        src={image}
        alt="Profile image"
        width="50"
        height="50"
        className="h-10 w-10 rounded-full"
      ></Image>
    </div>
  );
}

export default function NavBar({ session }: { session: Session | null }) {
  return (
    <>
      <div className="flex h-14 w-full items-center bg-white shadow-lg">
        {session && session.user.name && session.user.image ? (
          <AccountButton name={session.user.name} image={session.user.image} />
        ) : null}
      </div>
    </>
  );
}
