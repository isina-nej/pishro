"use client";

export const LoadingPlaceholder = () => {
  return (
    <div>
      {/* skeleton hero */}
      <section className="relative overflow-hidden bg-[#0d1b2a] pb-32 pt-36 text-white animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/40 to-slate-900/80" />
        <div className="container-xl relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="h-6 w-44 rounded-full bg-slate-700/50" />
            <div className="h-12 w-3/4 rounded-md bg-slate-700/50" />
            <div className="h-4 w-1/2 rounded-md bg-slate-700/50" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8">
            {new Array(4).fill(null).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-4"
              >
                <div className="h-10 w-10 rounded-full bg-slate-700/50" />
                <div className="flex flex-col">
                  <div className="h-5 w-24 rounded bg-slate-700/50 mb-2" />
                  <div className="h-4 w-20 rounded bg-slate-700/50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* skeleton filters and content */}
      <section className="container-xl -mt-16">
        <div className="rounded-3xl border border-white/30 bg-white px-5 py-8 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-6 border-b border-slate-200 pb-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="h-6 w-44 rounded bg-slate-200 animate-pulse" />
                <div className="h-4 w-64 rounded bg-slate-200 animate-pulse mt-2" />
              </div>

              <div className="flex gap-3">
                <div className="h-10 w-40 rounded-2xl bg-slate-200 animate-pulse" />
                <div className="h-10 w-40 rounded-2xl bg-slate-200 animate-pulse" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="h-12 rounded-2xl bg-slate-100 p-3 shadow-sm flex items-center gap-3">
                <div className="h-5 w-5 rounded bg-slate-200" />
                <div className="h-6 w-full rounded bg-slate-200" />
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1">
                {new Array(6).fill(null).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-28 rounded-full bg-slate-200 animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* featured skeleton */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-6 w-56 rounded bg-slate-200" />
                <div className="h-4 w-72 rounded bg-slate-100 mt-2" />
              </div>
              <div className="h-8 w-48 rounded bg-slate-200" />
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {new Array(3).fill(null).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[220px] rounded-3xl border bg-white p-4 shadow-sm"
                >
                  <div className="h-40 rounded-2xl bg-slate-200 mb-4" />
                  <div className="h-5 w-40 rounded bg-slate-200 mb-2" />
                  <div className="h-4 w-24 rounded bg-slate-200 mb-1" />
                  <div className="h-3 w-32 rounded bg-slate-100 mt-3" />
                </div>
              ))}
            </div>

            {/* grid skeleton */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {new Array(6).fill(null).map((_, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-3xl border bg-white p-4 shadow-sm"
                >
                  <div className="h-72 rounded-2xl bg-slate-200 mb-4" />
                  <div className="h-5 w-3/4 rounded bg-slate-200 mb-2" />
                  <div className="h-4 w-1/2 rounded bg-slate-100 mb-2" />
                  <div className="h-3 w-1/3 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
