export default function StatCard({
  title,
  value,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-4xl font-bold text-gray-800 mt-2">
        {value}
      </h2>
    </div>
  );
}