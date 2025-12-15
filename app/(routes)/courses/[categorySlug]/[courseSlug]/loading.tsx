/**
 * Loading state for course detail page
 * Displayed during SSR/ISR data fetching
 */

export default function Loading() {
  return (
    <div className="w-full min-h-screen">
      {/* Breadcrumb Skeleton */}
      <section className="bg-gray-50 py-4">
        <div className="container-xl">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </section>

      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-br from-myPrimary/5 to-mySecondary/5 py-12 sm:py-16 md:py-20">
        <div className="container-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Content Skeleton */}
            <div className="space-y-6">
              <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-12 w-4/5 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="flex items-center gap-4">
                <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-40 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Right: Image Skeleton */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-200 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Details Section Skeleton */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6" />
                <div className="space-y-4">
                  <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
                <div className="space-y-4">
                  <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-6">
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-4">
                  <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
