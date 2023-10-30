import type { OverpassNode } from "~/utils/types.server";

interface PubProfileProps {
  pub: OverpassNode;
}

export const PubProfile = ({ pub }: PubProfileProps) => {
  const { tags } = pub;

  return tags ? (
    <div className="rounded-md bg-orange-200 p-1 flex flex-row justify-between">
      <div>
        <div>{tags.name}</div>
        <div className="text-xs">
          {(tags["addr:unit"] ? tags["addr:unit"] + " " : "") +
            (tags["addr:street"] || "")}
        </div>
      </div>
      <div>
        <div className="rounded-full h-8 w-8 bg-red-400 text-center leading-8 cursor-pointer">
          🟩
        </div>
      </div>
    </div>
  ) : null;
};
