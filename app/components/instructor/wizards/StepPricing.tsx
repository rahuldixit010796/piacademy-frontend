// components/instructor/wizard/StepPricing.tsx
export default function StepPricing({ data, setData, next, back }: any) {
  return (
    <div className="space-y-4">
      <input type="number" className="w-full rounded border p-2" placeholder="Price (INR)"
        value={data.price} onChange={(e) => setData({ ...data, price: Number(e.target.value) })} />
      <div className="flex items-center gap-2">
        <input type="checkbox" id="hasCoupon" />
        <label htmlFor="hasCoupon" className="text-sm">Enable coupons later</label>
      </div>
      <div className="flex justify-between">
        <button onClick={back} className="px-4 py-2 rounded border">Back</button>
        <button onClick={next} className="px-4 py-2 rounded bg-black text-white">Next</button>
      </div>
    </div>
  );
}
