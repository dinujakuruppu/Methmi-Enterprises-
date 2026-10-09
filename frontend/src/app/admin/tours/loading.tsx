export default function Loading() {
  return (
    <main
      className="container-page py-10"
      aria-label="Loading admin tours"
      aria-busy="true"
    >
      <div className="animate-pulse">
        <div className="h-8 w-48 rounded bg-gray-200" />

        <div className="mt-4 h-4 w-72 rounded bg-gray-200" />

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl bg-white shadow"
              >
                <div className="h-36 bg-gray-200" />

                <div className="space-y-4 p-4">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />

                  <div className="h-4 w-1/2 rounded bg-gray-200" />

                  <div className="h-4 w-full rounded bg-gray-200" />

                  <div className="flex gap-3">
                    <div className="h-9 flex-1 rounded bg-gray-200" />

                    <div className="h-9 flex-1 rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}