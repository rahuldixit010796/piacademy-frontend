// components/instructor/wizard/StepPublish.tsx
export default function StepPublish({ data, back }: any) {
  const submit = () => alert("Submit for review with payload:\n" + JSON.stringify(data, null, 2));
  return (
    <div className="space-y-4">
      <div className="rounded border p-4 bg-white dark:bg-gray-800">
        <div className="font-medium mb-2">Publish checklist</div>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Quality checks passed</li>
          <li>No copyright issues</li>
          <li>Course landing page reviewed</li>
        </ul>
      </div>
      <div className="flex justify-between">
        <button onClick={back} className="px-4 py-2 rounded border">Back</button>
        <button onClick={submit} className="px-4 py-2 rounded bg-green-600 text-white">Submit for review</button>
      </div>
    </div>
  );
}
