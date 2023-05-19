import { useQuery } from "@tanstack/react-query";
import { UsersTopTracksResponse } from "SpotifyApi";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { api } from "~/utils/api";

type SpotifyResult = {
  href: string;
  items: Array<any>;
};

export default function Dashboard() {
  const session = useSession();

  const query = useQuery({
    queryKey: ["playlists"],
    queryFn: async () => {
      if (!token) {
        throw `Token is missing.`;
      }
      const response = await fetch(
        "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "GET",
        }
      );
      const jsonRes: UsersTopTracksResponse =
        (await response.json()) as UsersTopTracksResponse;
      return jsonRes;
    },
  });

  const { data: token, isFetched } = api.user.getToken.useQuery();

  useEffect(() => {
    console.log(`useEffect, isFetched: ${isFetched.toString()}`);
    if (isFetched) {
      query.refetch().catch(() => console.error);
    }
  }, [query, isFetched]);

  return (
    <>
      <h1 className="p-5 text-4xl"> Dashboard</h1>
      <div className="flex w-full flex-wrap p-5">
        <div className="w-full">Token: {token}</div>
        {/* <div className="w-full">Response: {JSON.stringify(query.data)}</div> */}
        <div className="w-full">
          {query.data?.items.map((x, index) => (
            <>
              <div className="my-2 w-64 cursor-pointer rounded-md border border-gray-200 p-2 transition-all duration-500 hover:shadow-md">
                {x.name}
                {x.artists.map((x) => (
                  <div key={x.id}>{x.name}</div>
                ))}
              </div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
