export default function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-gray-950 text-white hover:bg-gray-800",
    secondary: "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
