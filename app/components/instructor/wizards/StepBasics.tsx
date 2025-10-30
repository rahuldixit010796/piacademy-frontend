// components/instructor/wizard/StepBasics.tsx
export default function StepBasics({ data, setData, next }: any) {
  return (
    <div className="space-y-4">
      <input className="w-full rounded border p-2" placeholder="Course Title"
        value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
      <textarea className="w-full rounded border p-2" rows={5} placeholder="Description"
        value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
      <input className="w-full rounded border p-2" placeholder="Category"
        value={data.category} onChange={(e) => setData({ ...data, category: e.target.value })} />
      <div className="flex justify-end">
        <button onClick={next} className="px-4 py-2 rounded bg-black text-white">Next</button>
      </div>
    </div>
  );
}
