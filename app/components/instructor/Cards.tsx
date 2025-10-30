// components/instructor/Cards.tsx
export default function Cards() {
  const items = [
    { label: "Earnings Today", value: "₹12,400" },
    { label: "New Enrollments", value: "37" },
    { label: "Pending Reviews", value: "5" },
    { label: "Watch Time (hrs)", value: "182" },
  ];
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((x) => (
        <div key={x.label} className="rounded-lg border bg-white dark:bg-gray-800 p-4">
          <div className="text-sm text-gray-500">{x.label}</div>
          <div className="text-2xl font-semibold mt-1">{x.value}</div>
        </div>
      ))}
    </section>
  );
}
