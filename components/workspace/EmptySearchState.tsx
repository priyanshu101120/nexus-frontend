import { Search } from "lucide-react";
import React from "react";

const EmptySearchState = ({
  hasSearch,
  onClear,
  onCreate,
}: {
  hasSearch: boolean;
  onClear: () => void;
  onCreate: () => void;
}) => {
  return (
    <div className="rounded-2xl border border-dashed border-black/10 bg-white px-6 py-16 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-black/[0.035]">
        <Search size={20} className="text-black/35" />
      </div>

      {hasSearch ? (
        <>
          <h3 className="mt-4 font-bold">No workspaces found</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-black/40">
            Try searching for another workspace name.
          </p>
          <button
            onClick={onClear}
            className="mt-5 text-sm font-semibold text-[#6d5dfb]"
          >
            Clear search
          </button>
        </>
      ) : (
        <>
          <h3 className="mt-4 font-bold">No workspaces yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-black/40">
            Create your first workspace to get started.
          </p>
          <button
            onClick={onCreate}
            className="mt-5 text-sm font-semibold text-[#6d5dfb]"
          >
            Create workspace
          </button>
        </>
      )}
    </div>
  );
};

export default EmptySearchState;
