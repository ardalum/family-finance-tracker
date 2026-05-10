export default function Select({ label, children, className = "", ...props }) {
  return (
    <label className="grid min-w-0 gap-1.5 text-sm font-medium text-gray-700">
      {label}
      <select
        className={`h-10 w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition focus:border-gray-950 focus:ring-2 focus:ring-gray-950/10 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
