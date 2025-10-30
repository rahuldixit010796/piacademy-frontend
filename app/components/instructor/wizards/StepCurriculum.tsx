// components/instructor/wizard/StepCurriculum.tsx
export default function StepCurriculum({ data, setData, next, back }: any) {
  const addLesson = () => setData({ ...data, lessons: [...data.lessons, { title: "" }] });
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">Lessons</div>
        <button onClick={addLesson} className="px-3 py-1 rounded border">+ Add Lesson</button>
      </div>
      {data.lessons.map((l: any, i: number) => (
        <input key={i} className="w-full rounded border p-2" placeholder={`Lesson ${i + 1} title`}
          value={l.title}
          onChange={(e) => {
            const copy = [...data.lessons];
            copy[i].title = e.target.value;
            setData({ ...data, lessons: copy });
          }}
        />
      ))}
      <div className="flex justify-between">
        <button onClick={back} className="px-4 py-2 rounded border">Back</button>
        <button onClick={next} className="px-4 py-2 rounded bg-black text-white">Next</button>
      </div>
    </div>
  );
}
