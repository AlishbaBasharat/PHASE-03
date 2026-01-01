/**
 * StreamingIndicator Component
 *
 * Displays a typing animation while the AI assistant is generating a response
 */

'use client';

export default function StreamingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="max-w-[70%] rounded-lg px-4 py-3 bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Assistant
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <div
            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}
