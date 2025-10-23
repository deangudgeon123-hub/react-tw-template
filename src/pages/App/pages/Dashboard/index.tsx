export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-black text-white">
      <h1 className="text-5xl font-bold mb-6 animate-pulse">
        🚀 Tailwind is Working!
      </h1>
      <p className="text-lg text-gray-300">
        Your Vite + React + Tailwind + GitHub Pages setup is fully alive.
      </p>
      <button className="mt-8 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all">
        Continue to Dashboard
      </button>
    </div>
  );
}
