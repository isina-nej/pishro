"use client";

import { cn } from "@/lib/utils";
import { curatedCollections } from "./data";

export const CollectionsRow = () => {
  return (
    <div className="mt-10 grid gap-4 lg:grid-cols-3">
      {curatedCollections.map((collection) => (
        <div
          key={collection.id}
          className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white"
        >
          <div
            className={cn(
              "absolute inset-0 opacity-80 blur-2xl transition-opacity group-hover:opacity-100",
              `bg-gradient-to-br ${collection.accent}`
            )}
          />
          <div className="relative z-10 space-y-3 p-6">
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/80">
              مجموعه منتخب
            </span>
            <h4 className="text-lg font-bold leading-7">{collection.title}</h4>
            <p className="text-sm text-slate-200/90">
              {collection.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
