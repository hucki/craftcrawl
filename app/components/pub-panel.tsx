import type { OverpassNode } from "~/utils/types.server";
import { PubProfile } from "./pub-profile";
import { AuthButton } from "./auth-button";

interface PubPanelProps {
  pubs: OverpassNode[];
}
export const PubPanel = ({ pubs }: PubPanelProps) => {
  return (
    <div className="w-full lg:w-1/5 h-1/3 lg:h-full bg-orange-300 flex flex-col">
      <div className="text-center bg-amber-950 h-10 lg:h-20 flex items-center justify-center">
        <h2 className="text-xl text-orange-200 font-semibold">My Pubs</h2>
      </div>
      <div className="flex-1 overflow-y-scroll px-1 py-4 flex flex-col gap-y-4">
        {pubs.map((p, i) => (
          <PubProfile key={i} pub={p} />
        ))}
      </div>
      <div className="text-center p-2 lg:p-6 bg-amber-950">
        <AuthButton
          type="submit"
          className="rounded-xl bg-orange-500 font-semibold text-orange-200 px-3 py-2 transition duration-300 ease-in-out hover:bg-orange-400 hover:-translate-y-1"
        >
          Sign Out
        </AuthButton>
      </div>
    </div>
  );
};
