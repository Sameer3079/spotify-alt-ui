import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { type Session } from "next-auth";
import Image from "next/image";
import { signOut } from "next-auth/react";

export default function NavBarMenu({ session }: { session: Session | null }) {
  const onSignOutClick = () => {
    signOut().catch(console.error);
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <div
            className="ml-auto mr-4 mt-1 flex h-min max-w-max animate-fade-up cursor-pointer items-center rounded-full bg-stone-200 opacity-0 shadow-md transition-all duration-500 hover:bg-green-500"
            style={{ animationDelay: "4s" }}
          >
            <Image
              src={
                session?.user.image ??
                "https://cdn.cfr.org/sites/default/files/styles/full_width_xl/public/image/2023/02/Ukraine.jpg.webp"
              }
              alt="Profile image"
              width="50"
              height="50"
              className="h-10 w-10 rounded-full"
            ></Image>
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className="DropdownMenuContent">
            <DropdownMenu.Item className="DropdownMenuItem cursor-pointer">
              Settings
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="DropdownMenuItem cursor-pointer"
              onClick={onSignOutClick}
            >
              Sign out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
}
