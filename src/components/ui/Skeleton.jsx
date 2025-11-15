import React from "react";

export const CardsSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-white/70 border border-gray-100 shadow-sm animate-pulse"
        >
          <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
          <div className="h-7 w-20 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="animate-pulse">
          {Array.from({ length: cols }).map((__, c) => (
            <td key={c} className="px-6 py-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export const ListSkeleton = ({ count = 6 }) => {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-2 p-3 bg-white/70 border border-gray-100 rounded-xl animate-pulse"
        >
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          <div className="h-3 w-20 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default function Skeleton() {
  return null;
}
