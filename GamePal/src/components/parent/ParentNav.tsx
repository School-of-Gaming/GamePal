import type { Parent } from "../../App";

type ParentNavProps = {
  parent: Parent;
};

export function ParentNav({ parent }: ParentNavProps) {
  return (
    <nav className="bg-gray-100 shadow-sm border-b w-full">
        <div className="px-6 py-4 flex items-center gap-3">
          <div className="text-3xl">👨‍👩‍👧‍👦</div>
          <div>
            <h2 className="text-purple-700 text-xl font-bold">GamerPal</h2>
            <p className="text-gray-600 text-sm">Welcome, {parent.name}</p>
          </div>
        </div>
      </nav>
  );
}
