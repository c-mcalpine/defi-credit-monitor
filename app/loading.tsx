export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-zinc-100">
      {/* Sticky header skeleton */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]">
        <div className="mx-auto flex h-12 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-52 animate-pulse rounded bg-[var(--bg-elevated)]" />
          <div className="h-3 w-24 animate-pulse rounded bg-[var(--bg-elevated)]" />
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent-blue)]/30 to-transparent" />
      </header>

      <div className="mx-auto w-full max-w-[1440px] space-y-6 px-4 py-5 sm:px-6 lg:px-8">
        {/* Signal banner skeleton */}
        <div className="h-11 animate-pulse rounded-md border border-[var(--border)] bg-[var(--bg-card)]" />

        {/* Metric cards skeleton */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-[var(--border)] border-l-2 border-l-[var(--accent-blue)]/30 bg-[var(--bg-card)] p-5"
            >
              <div className="h-3 w-20 rounded bg-[var(--bg-elevated)]" />
              <div className="mt-3 h-8 w-28 rounded bg-[var(--bg-elevated)]" />
              <div className="mt-2 h-2.5 w-36 rounded bg-[var(--bg-elevated)]" />
            </div>
          ))}
        </div>

        {/* Main content grid skeleton */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Table skeleton */}
          <div className="animate-pulse rounded-lg border border-[var(--border)] bg-[var(--bg-card)] lg:col-span-2">
            <div className="border-b border-[var(--border)] px-4 py-3">
              <div className="h-4 w-64 rounded bg-[var(--bg-elevated)]" />
            </div>
            <div className="space-y-0 divide-y divide-[var(--border)]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3">
                  <div className="h-4 w-4 rounded-full bg-[var(--bg-elevated)]" />
                  <div className="h-3.5 w-24 rounded bg-[var(--bg-elevated)]" />
                  <div className="h-3.5 w-16 rounded bg-[var(--bg-elevated)]" />
                  <div className="ml-auto h-3.5 w-14 rounded bg-[var(--bg-elevated)]" />
                  <div className="h-3.5 w-14 rounded bg-[var(--bg-elevated)]" />
                  <div className="h-3.5 w-20 rounded bg-[var(--bg-elevated)]" />
                </div>
              ))}
            </div>
          </div>

          {/* Right column skeleton */}
          <div className="flex flex-col gap-6">
            <div className="h-[240px] animate-pulse rounded-lg border border-[var(--border)] bg-[var(--bg-card)]" />
            <div className="h-[240px] animate-pulse rounded-lg border border-[var(--border)] bg-[var(--bg-card)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
