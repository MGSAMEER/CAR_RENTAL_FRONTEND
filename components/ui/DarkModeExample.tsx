'use client';

/**
 * Dark Mode Example Component
 * Demonstrates all UI/UX improvements for dark mode
 * Used as reference for updating other components
 */

export default function DarkModeExample() {
  return (
    <div className="page-container bg-white dark:bg-[#0f172a] min-h-screen">
      {/* Section 1: Typography Hierarchy */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Typography Hierarchy
        </h1>
        <p className="text-gray-600 dark:text-slate-300 mb-6">
          Demonstrating text contrast improvements in dark mode
        </p>

        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Heading 2 - White (#ffffff)
            </h2>
            <p className="text-gray-700 dark:text-slate-100 mb-2">
              Primary text - Slate-100 for main content
            </p>
            <p className="text-gray-600 dark:text-slate-300">
              Secondary text - Slate-300 for subtext
            </p>
            <p className="text-gray-500 dark:text-slate-400">
              Muted text - Slate-400 for tertiary info
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Button Variations */}
      <section className="mb-12">
        <h2 className="section-title mb-6">Button Variations</h2>

        <div className="card p-6 space-y-6">
          {/* Primary Buttons */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Primary Buttons
            </h3>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary">
                Primary Button
              </button>
              <button className="btn-primary hover:opacity-80">
                Hover State
              </button>
              <button className="btn-primary opacity-50 cursor-not-allowed">
                Disabled
              </button>
            </div>
          </div>

          {/* Secondary Buttons */}
          <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Secondary Buttons
            </h3>
            <div className="flex flex-wrap gap-3">
              <button className="btn-secondary">
                Secondary Button
              </button>
              <button className="btn-secondary opacity-80">
                Hover State
              </button>
            </div>
          </div>

          {/* Ghost Buttons */}
          <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Ghost Buttons
            </h3>
            <div className="flex flex-wrap gap-3">
              <button className="btn-ghost">
                Ghost Button
              </button>
              <button className="btn-ghost bg-slate-100 dark:bg-slate-700/60">
                Hover State
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Input Fields */}
      <section className="mb-12">
        <h2 className="section-title mb-6">Input Fields</h2>

        <div className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Standard Input
            </label>
            <input
              type="text"
              className="input"
              placeholder="Enter text..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Focused Input
            </label>
            <input
              type="text"
              className="input"
              placeholder="Click to focus..."
              defaultValue="Focus state visible"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Disabled Input
            </label>
            <input
              type="text"
              className="input"
              placeholder="Disabled..."
              disabled
            />
          </div>
        </div>
      </section>

      {/* Section 4: Badge System */}
      <section className="mb-12">
        <h2 className="section-title mb-6">Badge System</h2>

        <div className="card p-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <span className="badge-available">✓ Available</span>
            <span className="badge-unavailable">✕ Unavailable</span>
            <span className="badge-confirmed">✓ Confirmed</span>
            <span className="badge-cancelled">✕ Cancelled</span>
            <span className="badge-completed">✓ Completed</span>
          </div>
        </div>
      </section>

      {/* Section 5: Card Variations */}
      <section className="mb-12">
        <h2 className="section-title mb-6">Card Variations</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Standard Card */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Standard Card
            </h3>
            <p className="text-gray-600 dark:text-slate-300 mb-4">
              This card uses enhanced dark mode styling with better contrast and separation.
            </p>
            <button className="btn-primary text-sm">
              Action
            </button>
          </div>

          {/* Card with Border */}
          <div className="card-flat p-6 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Card with Border
            </h3>
            <p className="text-gray-600 dark:text-slate-300 mb-4">
              This card has an explicit border for better visual separation.
            </p>
            <button className="btn-secondary text-sm">
              Action
            </button>
          </div>
        </div>
      </section>

      {/* Section 6: Color Palette */}
      <section className="mb-12">
        <h2 className="section-title mb-6">Color Palette</h2>

        <div className="card p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Background */}
            <div className="space-y-2">
              <div className="w-full h-20 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-lg shadow-md" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Dark Background
              </p>
              <p className="text-xs text-gray-600 dark:text-slate-400">
                #0f172a - #1e293b
              </p>
            </div>

            {/* Text */}
            <div className="space-y-2">
              <div className="w-full h-20 bg-[#f1f5f9] rounded-lg shadow-md flex items-center justify-center">
                <span className="text-[#0f172a] font-semibold">Text</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Primary Text
              </p>
              <p className="text-xs text-gray-600 dark:text-slate-400">
                #f1f5f9
              </p>
            </div>

            {/* Secondary Text */}
            <div className="space-y-2">
              <div className="w-full h-20 bg-[#cbd5e1] rounded-lg shadow-md flex items-center justify-center">
                <span className="text-[#0f172a] font-semibold text-sm">Secondary</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Secondary Text
              </p>
              <p className="text-xs text-gray-600 dark:text-slate-400">
                #cbd5e1
              </p>
            </div>

            {/* Primary Action */}
            <div className="space-y-2">
              <div className="w-full h-20 bg-blue-600 rounded-lg shadow-md flex items-center justify-center">
                <span className="text-white font-semibold">Action</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Primary Action
              </p>
              <p className="text-xs text-gray-600 dark:text-slate-400">
                #2563EB
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Form Example */}
      <section className="mb-12">
        <h2 className="section-title mb-6">Complete Form Example</h2>

        <div className="card p-8 max-w-md">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Booking Form
          </h3>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Start Date
              </label>
              <input
                type="date"
                className="input"
                defaultValue="2026-05-13"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                End Date
              </label>
              <input
                type="date"
                className="input"
                defaultValue="2026-05-23"
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mt-6">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                Total: ₹45,000
              </p>
            </div>

            <button type="submit" className="btn-primary w-full mt-6">
              Complete Booking
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
