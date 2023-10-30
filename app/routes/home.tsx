import { type LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ClientOnly } from "~/components/client-only";
import { Layout } from "~/components/layout";
import { Map } from "~/components/map.client";
import { PubPanel } from "~/components/pub-panel";
import { requireUserId } from "~/utils/auth.server";
import type { OverpassJson, OverpassNode } from "~/utils/types.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    // The body contains the query
    // to understand the query language see "The Programmatic Query Language" on
    // https://wiki.openstreetmap.org/wiki/Overpass_API#The_Programmatic_Query_Language_(OverpassQL)
    body:
      "data=" +
      encodeURIComponent(`
            [out:json]
            [timeout:90]
            ;
            node
              ["amenity"~"^(pub|bar)"]
              [~"^(brand|operator)"~"BrewDog"]
              ["addr:city"="London"];
            out geom;
        `),
  });
  return json(await res.json());
};

export default function Home() {
  const bars = useLoaderData<typeof loader>() as OverpassJson;
  const mapHeight = "400px";

  return (
    <Layout>
      <div className="h-full flex justify-center items-center flex-col-reverse lg:flex-row">
        <PubPanel pubs={bars.elements as OverpassNode[]} />
        <section className="w-full lg:w-4/5 h-full p-2">
          <h2 className="text-xl lg:text-5xl text-center font-extrabold text-slate-100">
            Welcome to CraftCrawl 🍻
          </h2>
          <ClientOnly
            fallback={
              <div
                id="skeleton"
                style={{ height: mapHeight, background: "#d1d1d1" }}
              />
            }
          >
            {() => <Map height={mapHeight} pois={bars} />}
          </ClientOnly>
        </section>
      </div>
    </Layout>
  );
}
