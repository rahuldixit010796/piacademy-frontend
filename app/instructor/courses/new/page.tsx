"use client";
import React, { useEffect, useMemo, useState } from "react";

/**
 * Pi Academy — Responsive Course Builder + Student Preview
 * Steps: 1 Basics → 2 Curriculum → 3 Pricing → 4 Preview (student view) → 5 Publish
 * - Mobile: one section open at a time; collapsing a section collapses its lectures.
 * - Desktop: sections auto-expanded; no fixed bottom bar (Save/Publish at bottom).
 * - Optional add-ons at Section & Lecture: notes, resources, quiz, doubts (flags).
 * - VdoCipher free-preview playback in Preview step (requires backend to allow preview OTP).
 * - Draft autosave (localStorage).
 */

type QuizOption = { text: string };
type QuizQuestion = {
  question: string;
  options: QuizOption[]; // 2..6
  correctIndex: number;  // 0-based
  explanation?: string;
};

type ResourceItem = {
  title: string;
  type: "pdf" | "image" | "link";
  url: string;
};

type LectureDraft = {
  title: string;
  description?: string;
  file?: File | null;
  uploading?: boolean;
  vdocipherVideoId?: string;
  notes?: string;
  resources?: ResourceItem[];
  quiz?: QuizQuestion[];
  allowDoubts?: boolean;
  isFreePreview?: boolean;
  durationSec?: number;
};

type SectionDraft = {
  title: string;
  notes?: string;
  resources?: ResourceItem[];
  quiz?: QuizQuestion[];
  allowDoubts?: boolean;
  lectures: LectureDraft[];
};

type Pricing = {
  price: number;
  estimatedPrice?: number;
};

type Basics = {
  courseName: string;
  board: "CBSE" | "ICSE" | "STATE" | "UNIVERSITY" | "";
  klass: "9" | "10" | "11" | "12" | "UG" | "PG" | "";
  subject: string;
  syllabusRef?: string;
  language?: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "";
  outcomeBullets: string[];
  requirements: string[];
  tags: string[];
  demoUrl?: string;
};

const EMPTY_BASICS: Basics = {
  courseName: "",
  board: "",
  klass: "",
  subject: "",
  syllabusRef: "",
  language: "EN",
  level: "",
  outcomeBullets: [""],
  requirements: [""],
  tags: [],
  demoUrl: "",
};

const DEFAULT_SECTIONS: SectionDraft[] = [
  { title: "Section 1", lectures: [{ title: "Lecture 1", description: "" }] },
];

const STORAGE_KEY = "piacademy_course_builder_responsive_preview_v1";

export default function Page() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [basics, setBasics] = useState<Basics>(EMPTY_BASICS);
  const [sections, setSections] = useState<SectionDraft[]>(DEFAULT_SECTIONS);
  const [pricing, setPricing] = useState<Pricing>({ price: 0 });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Responsive behavior
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSectionIndex, setExpandedSectionIndex] = useState<number | null>(0);
  const [expandedLectures, setExpandedLectures] = useState<Record<number, Set<number>>>({});

  // Detect mobile width
  useEffect(() => {
    const mm = window.matchMedia("(max-width: 767px)");
    const set = () => setIsMobile(mm.matches);
    set();
    mm.addEventListener("change", set);
    return () => mm.removeEventListener("change", set);
  }, []);

  // Init expanded lectures per layout
  useEffect(() => {
    setExpandedLectures(() => {
      const next: Record<number, Set<number>> = {};
      sections.forEach((sec, si) => {
        next[si] = isMobile ? new Set<number>() : new Set<number>(sec.lectures.map((_, li) => li));
      });
      return next;
    });
    if (!isMobile) setExpandedSectionIndex(null);
    else if (expandedSectionIndex == null) setExpandedSectionIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // Load draft
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const d = JSON.parse(raw);
        if (d?.basics) setBasics(d.basics);
        if (d?.sections) setSections(d.sections);
        if (d?.pricing) setPricing(d.pricing);
      } catch {}
    }
  }, []);
  // Save draft
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ basics, sections, pricing }));
  }, [basics, sections, pricing]);

  const toast = (t: string) => {
    setMsg(t);
    setTimeout(() => setMsg(null), 2200);
  };

  /* ========== Basics helpers ========== */
  const setOutcome = (i: number, v: string) =>
    setBasics((b) => ({ ...b, outcomeBullets: b.outcomeBullets.map((x, idx) => (idx === i ? v : x)) }));
  const addOutcome = () => setBasics((b) => ({ ...b, outcomeBullets: [...b.outcomeBullets, ""] }));
  const removeOutcome = (i: number) =>
    setBasics((b) => ({ ...b, outcomeBullets: b.outcomeBullets.filter((_, idx) => idx !== i) }));

  const setReq = (i: number, v: string) =>
    setBasics((b) => ({ ...b, requirements: b.requirements.map((x, idx) => (idx === i ? v : x)) }));
  const addReq = () => setBasics((b) => ({ ...b, requirements: [...b.requirements, ""] }));
  const removeReq = (i: number) =>
    setBasics((b) => ({ ...b, requirements: b.requirements.filter((_, idx) => idx !== i) }));

  /* ========== Resource uploader (PDF/Image/Link) ========== */
  const uploadResourceFile = async (file: File): Promise<string> => {
    const r1 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/resource/upload-url`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name, mime: file.type }),
    });
    const j1 = await r1.json();
    if (!j1?.uploadUrl) throw new Error("No resource uploadUrl from server");
    const r2 = await fetch(j1.uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
    if (!r2.ok) throw new Error("Resource upload failed");
    const body = await r2.text();
    const maybeUrl = j1.url || body.match(/https?:\/\/[^\s"]+/)?.[0];
    if (!maybeUrl) throw new Error("Resource URL not returned");
    return maybeUrl;
  };

  /* ========== Section handlers ========== */
  const addSection = () => {
    setSections((s) => [...s, { title: `Section ${s.length + 1}`, lectures: [] }]);
    if (isMobile) setExpandedSectionIndex(sections.length);
  };
  const removeSection = (si: number) => {
    if (!confirm("Remove this section?")) return;
    setSections((s) => s.filter((_, idx) => idx !== si));
    setExpandedLectures((prev) => {
      const copy = { ...prev };
      delete copy[si];
      return copy;
    });
  };
  const renameSection = (si: number, t: string) =>
    setSections((s) => {
      const c = structuredClone(s);
      c[si].title = t;
      return c;
    });
  const moveSection = (si: number, dir: "up" | "down") =>
    setSections((s) => {
      const c = structuredClone(s);
      const ni = dir === "up" ? si - 1 : si + 1;
      if (ni < 0 || ni >= c.length) return s;
      const [tmp] = c.splice(si, 1);
      c.splice(ni, 0, tmp);
      return c;
    });

  // Mobile section open/collapse (collapsing clears lectures too)
  const toggleSectionOpen = (si: number) => {
    if (!isMobile) return;
    setExpandedSectionIndex((cur) => {
      if (cur === si) {
        setExpandedLectures((prev) => ({ ...prev, [si]: new Set<number>() }));
        return null;
      }
      // open new -> collapse other sections + their lectures
      const reset: Record<number, Set<number>> = {};
      sections.forEach((_, idx) => (reset[idx] = new Set<number>()));
      setExpandedLectures(reset);
      return si;
    });
  };

  // Section add-ons
  const setSectionNotes = (si: number, v: string) =>
    setSections((s) => { const c = structuredClone(s); c[si].notes = v || undefined; return c; });
  const addSectionResource = async (si: number, file: File, title?: string) => {
    const url = await uploadResourceFile(file);
    setSections((s) => { const c = structuredClone(s); c[si].resources = [...(c[si].resources || []), { title: title || file.name, type: "pdf", url }]; return c; });
    toast("Section resource uploaded");
  };
  const addSectionLink = (si: number, title: string, url: string) =>
    setSections((s) => { const c = structuredClone(s); c[si].resources = [...(c[si].resources || []), { title, type: "link", url }]; return c; });
  const removeSectionResource = (si: number, ri: number) =>
    setSections((s) => { const c = structuredClone(s); c[si].resources = (c[si].resources || []).filter((_, idx) => idx !== ri); if (!c[si].resources?.length) delete c[si].resources; return c; });
  const toggleSectionDoubts = (si: number) =>
    setSections((s) => { const c = structuredClone(s); c[si].allowDoubts = !c[si].allowDoubts; return c; });

  // Section quiz
  const addSectionQuestion = (si: number) =>
    setSections((s) => { const c = structuredClone(s); c[si].quiz = [...(c[si].quiz || []), { question: "", options: [{ text: "" }, { text: "" }], correctIndex: 0 }]; return c; });
  const editSectionQuestion = (si: number, qi: number, v: Partial<QuizQuestion>) =>
    setSections((s) => { const c = structuredClone(s); c[si].quiz![qi] = { ...(c[si].quiz![qi]), ...v }; return c; });
  const setSectionOption = (si: number, qi: number, oi: number, text: string) =>
    setSections((s) => { const c = structuredClone(s); c[si].quiz![qi].options[oi].text = text; return c; });
  const addSectionOption = (si: number, qi: number) =>
    setSections((s) => { const c = structuredClone(s); c[si].quiz![qi].options.push({ text: "" }); return c; });
  const removeSectionOption = (si: number, qi: number, oi: number) =>
    setSections((s) => { const c = structuredClone(s); c[si].quiz![qi].options = c[si].quiz![qi].options.filter((_, idx) => idx !== oi); return c; });
  const removeSectionQuestion = (si: number, qi: number) =>
    setSections((s) => { const c = structuredClone(s); c[si].quiz = c[si].quiz!.filter((_, idx) => idx !== qi); if (!c[si].quiz?.length) delete c[si].quiz; return c; });

  /* ========== Lecture handlers ========== */
  const addLecture = (si: number) =>
    setSections((prev) =>
      prev.map((sec, idx) =>
        idx !== si ? sec : { ...sec, lectures: [...sec.lectures, { title: `Lecture ${sec.lectures.length + 1}`, description: "" }] }
      )
    );
  const removeLecture = (si: number, li: number) => {
    if (!confirm("Remove this lecture?")) return;
    setSections((s) => { const c = structuredClone(s); c[si].lectures = c[si].lectures.filter((_, idx) => idx !== li); return c; });
    setExpandedLectures((prev) => {
      const copy = { ...prev };
      copy[si]?.delete(li);
      return copy;
    });
  };
  const renameLecture = (si: number, li: number, t: string) =>
    setSections((s) => { const c = structuredClone(s); c[si].lectures[li].title = t; return c; });
  const setLectureDesc = (si: number, li: number, d: string) =>
    setSections((s) => { const c = structuredClone(s); c[si].lectures[li].description = d || undefined; return c; });
  const toggleLecturePreview = (si: number, li: number) =>
    setSections((s) => { const c = structuredClone(s); c[si].lectures[li].isFreePreview = !c[si].lectures[li].isFreePreview; return c; });
  const toggleLectureDoubts = (si: number, li: number) =>
    setSections((s) => { const c = structuredClone(s); c[si].lectures[li].allowDoubts = !c[si].lectures[li].allowDoubts; return c; });

  const isLectureOpen = (si: number, li: number) => expandedLectures[si]?.has(li);
  const toggleLectureOpen = (si: number, li: number) =>
    setExpandedLectures((prev) => {
      const copy = { ...prev };
      copy[si] = new Set<number>(copy[si] || []);
      if (copy[si].has(li)) copy[si].delete(li); else copy[si].add(li);
      return copy;
    });

  const moveLecture = (si: number, li: number, dir: "up" | "down") =>
    setSections((s) => {
      const c = structuredClone(s);
      const arr = c[si].lectures;
      const ni = dir === "up" ? li - 1 : li + 1;
      if (ni < 0 || ni >= arr.length) return s;
      const [tmp] = arr.splice(li, 1);
      arr.splice(ni, 0, tmp);
      return c;
    });

  // Video upload (VdoCipher)
  const onPickVideo = (si: number, li: number, file: File) =>
    setSections((s) => { const c = structuredClone(s); c[si].lectures[li].file = file; return c; });

  const uploadLectureVideo = async (si: number, li: number) => {
    const lec = sections[si].lectures[li];
    if (!lec.file) return toast("Choose a video first");
    try {
      setSections((s) => { const c = structuredClone(s); c[si].lectures[li].uploading = true; return c; });

      const r1 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/video/upload-url`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: lec.file.name, mime: lec.file.type || "video/mp4" }),
      });
      const j1 = await r1.json();
      const uploadUrl = j1?.uploadUrl;
      const seedVideoId = j1?.videoId;
      if (!uploadUrl) throw new Error("No uploadUrl");

      const r2 = await fetch(uploadUrl, { method: "PUT", body: lec.file, headers: { "Content-Type": lec.file.type || "video/mp4" } });
      if (!r2.ok) throw new Error("Video upload failed");

      let finalVideoId = seedVideoId;
      if (!finalVideoId) {
        const txt = await r2.text();
        const m = txt.match(/videoId":"([^"]+)/);
        if (m) finalVideoId = m[1];
      }

      setSections((s) => {
        const c = structuredClone(s);
        c[si].lectures[li].vdocipherVideoId = finalVideoId || "PENDING";
        c[si].lectures[li].uploading = false;
        c[si].lectures[li].file = undefined;
        return c;
      });
      toast(`Uploaded ✅ videoId=${finalVideoId || "pending"}`);
    } catch (e: any) {
      console.error(e);
      setSections((s) => { const c = structuredClone(s); c[si].lectures[li].uploading = false; return c; });
      toast("Upload failed");
    }
  };

  // Lecture add-ons
  const setLectureNotes = (si: number, li: number, v: string) =>
    setSections((s) => { const c = structuredClone(s); c[si].lectures[li].notes = v || undefined; return c; });

  const addLectureResourceFile = async (si: number, li: number, file: File, title?: string, type: "pdf" | "image" = "pdf") => {
    const url = await uploadResourceFile(file);
    setSections((s) => { const c = structuredClone(s); c[si].lectures[li].resources = [...(c[si].lectures[li].resources || []), { title: title || file.name, type, url }]; return c; });
    toast("Lecture resource uploaded");
  };
  const addLectureResourceLink = (si: number, li: number, title: string, url: string) =>
    setSections((s) => { const c = structuredClone(s); c[si].lectures[li].resources = [...(c[si].lectures[li].resources || []), { title, type: "link", url }]; return c; });
  const removeLectureResource = (si: number, li: number, ri: number) =>
    setSections((s) => { const c = structuredClone(s); c[si].lectures[li].resources = (c[si].lectures[li].resources || []).filter((_, idx) => idx !== ri); return c; });

  const addLectureQuestion = (si: number, li: number) =>
    setSections((s) => { const c = structuredClone(s); c[si].lectures[li].quiz = [...(c[si].lectures[li].quiz || []), { question: "", options: [{ text: "" }, { text: "" }], correctIndex: 0 }]; return c; });
  const editLectureQuestion = (si: number, li: number, qi: number, v: Partial<QuizQuestion>) =>
    setSections((s) => { const c = structuredClone(s); c[si].lectures[li].quiz![qi] = { ...(c[si].lectures[li].quiz![qi]), ...v }; return c; });
  const setLectureOption = (si: number, li: number, qi: number, oi: number, text: string) =>
    setSections((s) => { const c = structuredClone(s); c[si].lectures[li].quiz![qi].options[oi].text = text; return c; });
  const addLectureOption = (si: number, li: number, qi: number) =>
    setSections((s) => { const c = structuredClone(s); c[si].lectures[li].quiz![qi].options.push({ text: "" }); return c; });
  const removeLectureOption = (si: number, li: number, qi: number, oi: number) =>
    setSections((s) => { const c = structuredClone(s); c[si].lectures[li].quiz![qi].options = c[si].lectures[li].quiz![qi].options.filter((_, idx) => idx !== oi); return c; });
  const removeLectureQuestion = (si: number, li: number, qi: number) =>
    setSections((s) => { const c = structuredClone(s); c[si].lectures[li].quiz = c[si].lectures[li].quiz!.filter((_, idx) => idx !== qi); if (!c[si].lectures[li].quiz?.length) delete c[si].lectures[li].quiz; return c; });

  /* ========== Validation & Save ========== */
  const totalLectures = useMemo(() => sections.reduce((a, sec) => a + sec.lectures.length, 0), [sections]);
  const publishChecks = useMemo(() => {
    const errs: string[] = [];
    if (!basics.courseName.trim()) errs.push("Course name required");
    if (!basics.board) errs.push("Board required");
    if (!basics.klass) errs.push("Class/Level required");
    if (!basics.subject.trim()) errs.push("Subject required");
    if ((pricing.price ?? 0) < 0) errs.push("Price cannot be negative");
    if (totalLectures < 5) errs.push("Minimum 5 lectures recommended");
    const anyUploaded = sections.some((s) => s.lectures.some((l) => !!l.vdocipherVideoId && l.vdocipherVideoId !== "PENDING"));
    if (!anyUploaded) errs.push("Upload at least one lecture video");
    return errs;
  }, [basics, pricing, sections, totalLectures]);

  const saveCourse = async (publish = false) => {
    try {
      setBusy(true);
      const payload = {
        basics,
        sections: sections.map((sec) => ({
          title: sec.title,
          notes: sec.notes || undefined,
          allowDoubts: !!sec.allowDoubts || undefined,
          resources: sec.resources?.length ? sec.resources : undefined,
          quiz: sec.quiz?.length ? sec.quiz : undefined,
          lectures: sec.lectures.map((l) => ({
            title: l.title,
            description: l.description || undefined,
            vdocipherVideoId: l.vdocipherVideoId || undefined,
            isFreePreview: !!l.isFreePreview || undefined,
            allowDoubts: !!l.allowDoubts || undefined,
            durationSec: l.durationSec || undefined,
            notes: l.notes || undefined,
            resources: l.resources?.length ? l.resources : undefined,
            quiz: l.quiz?.length ? l.quiz : undefined,
          })),
        })),
        pricing,
        status: publish ? "PUBLISHED" : "DRAFT",
      };

      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/instructor/create`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.message || "Save failed");
      toast(publish ? "Published 🎉" : "Draft saved ✅");
    } catch (e: any) {
      toast(e.message || "Error");
    } finally {
      setBusy(false);
    }
  };

  /* ========== UI ========== */
  return (
<div className="w-full px-6 space-y-6">
      {msg && <div className="rounded-md bg-green-50 border border-green-200 text-green-800 px-4 py-2">{msg}</div>}

      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-bold">Create Course</h1>
        <div className="flex gap-2">
          <button onClick={() => saveCourse(false)} disabled={busy} className="px-4 py-2 rounded-md border bg-white hover:bg-gray-50">Save Draft</button>
          <button
            onClick={() => {
              if (publishChecks.length) return alert("Fix before publish:\n- " + publishChecks.join("\n- "));
              saveCourse(true);
            }}
            disabled={busy}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >Publish</button>
        </div>
      </header>

      {/* Wizard Nav */}
      <nav className="flex flex-wrap items-center gap-2 text-sm">
        {[
          { id: 1, label: "Basics" },
          { id: 2, label: "Curriculum" },
          { id: 3, label: "Pricing" },
          { id: 4, label: "Preview" }, // NEW
          { id: 5, label: "Publish" },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setStep(s.id as any)}
            className={`px-3 py-1 rounded-md border ${step === s.id ? "bg-gray-900 text-white" : "bg-white hover:bg-gray-50"}`}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* STEP 1: BASICS */}
      {step === 1 && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Course Name *">
              <input className="w-full border rounded-md p-2" value={basics.courseName} onChange={(e) => setBasics({ ...basics, courseName: e.target.value })} />
            </Field>
            <Field label="Board *">
              <select className="w-full border rounded-md p-2" value={basics.board} onChange={(e) => setBasics({ ...basics, board: e.target.value as Basics["board"] })}>
                <option value="">Select</option><option value="CBSE">CBSE</option><option value="ICSE">ICSE</option><option value="STATE">State Board</option><option value="UNIVERSITY">University</option>
              </select>
            </Field>
            <Field label="Class/Level *">
              <select className="w-full border rounded-md p-2" value={basics.klass} onChange={(e) => setBasics({ ...basics, klass: e.target.value as Basics["klass"] })}>
                <option value="">Select</option><option value="9">Class 9</option><option value="10">Class 10</option><option value="11">Class 11</option><option value="12">Class 12</option><option value="UG">UG</option><option value="PG">PG</option>
              </select>
            </Field>
            <Field label="Subject *">
              <input className="w-full border rounded-md p-2" value={basics.subject} onChange={(e) => setBasics({ ...basics, subject: e.target.value })} />
            </Field>
            <Field label="Language">
              <input className="w-full border rounded-md p-2" value={basics.language || ""} onChange={(e) => setBasics({ ...basics, language: e.target.value })} />
            </Field>
            <Field label="Syllabus Ref">
              <input className="w-full border rounded-md p-2" value={basics.syllabusRef || ""} onChange={(e) => setBasics({ ...basics, syllabusRef: e.target.value })} />
            </Field>
          </div>

          {/* Outcomes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Learning Outcomes</label>
            {basics.outcomeBullets.map((x, i) => (
              <div key={i} className="flex gap-2 flex-col sm:flex-row">
                <input className="flex-1 border rounded-md p-2" value={x} onChange={(e) => setOutcome(i, e.target.value)} placeholder="e.g., Master vectors & kinematics" />
                <button onClick={() => removeOutcome(i)} className="px-2 rounded-md border text-red-600">✕</button>
              </div>
            ))}
            <button onClick={addOutcome} className="px-3 py-1 rounded-md border">+ Add Outcome</button>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Requirements</label>
            {basics.requirements.map((x, i) => (
              <div key={i} className="flex gap-2 flex-col sm:flex-row">
                <input className="flex-1 border rounded-md p-2" value={x} onChange={(e) => setReq(i, e.target.value)} placeholder="e.g., Basic algebra" />
                <button onClick={() => removeReq(i)} className="px-2 rounded-md border text-red-600">✕</button>
              </div>
            ))}
            <button onClick={addReq} className="px-3 py-1 rounded-md border">+ Add Requirement</button>
          </div>

          <div className="flex justify-end">
            <button onClick={() => setStep(2)} className="px-4 py-2 rounded-md bg-gray-900 text-white">Next: Curriculum →</button>
          </div>
        </section>
      )}

      {/* STEP 2: CURRICULUM */}
      {step === 2 && (
        <CurriculumEditor
          isMobile={isMobile}
          sections={sections}
          expandedSectionIndex={expandedSectionIndex}
          expandedLectures={expandedLectures}
          toggleSectionOpen={toggleSectionOpen}
          renameSection={renameSection}
          moveSection={moveSection}
          addSection={addSection}
          removeSection={removeSection}
          addLecture={addLecture}
          removeLecture={removeLecture}
          isLectureOpen={isLectureOpen}
          toggleLectureOpen={toggleLectureOpen}
          moveLecture={moveLecture}
          renameLecture={renameLecture}
          setLectureDesc={setLectureDesc}
          onPickVideo={onPickVideo}
          uploadLectureVideo={uploadLectureVideo}
          toggleLecturePreview={toggleLecturePreview}
          toggleLectureDoubts={toggleLectureDoubts}
          setSectionNotes={setSectionNotes}
          addSectionResource={addSectionResource}
          addSectionLink={addSectionLink}
          removeSectionResource={removeSectionResource}
          toggleSectionDoubts={toggleSectionDoubts}
          addSectionQuestion={addSectionQuestion}
          editSectionQuestion={editSectionQuestion}
          setSectionOption={setSectionOption}
          addSectionOption={addSectionOption}
          removeSectionOption={removeSectionOption}
          removeSectionQuestion={removeSectionQuestion}
          setLectureNotes={setLectureNotes}
          addLectureResourceFile={addLectureResourceFile}
          addLectureResourceLink={addLectureResourceLink}
          removeLectureResource={removeLectureResource}
          addLectureQuestion={addLectureQuestion}
          editLectureQuestion={editLectureQuestion}
          setLectureOption={setLectureOption}
          addLectureOption={addLectureOption}
          removeLectureOption={removeLectureOption}
          removeLectureQuestion={removeLectureQuestion}
          toast={toast}
          setStep={setStep}
        />
      )}

      {/* STEP 3: PRICING */}
      {step === 3 && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Price (₹) *">
              <input type="number" className="w-full border rounded-md p-2" value={pricing.price} onChange={(e) => setPricing({ ...pricing, price: parseFloat(e.target.value || "0") })} />
            </Field>
            <Field label="Estimated Price (₹)">
              <input type="number" className="w-full border rounded-md p-2" value={pricing.estimatedPrice || 0} onChange={(e) => setPricing({ ...pricing, estimatedPrice: parseFloat(e.target.value || "0") })} />
            </Field>
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="px-4 py-2 rounded-md border">← Back: Curriculum</button>
            <button onClick={() => setStep(4)} className="px-4 py-2 rounded-md bg-gray-900 text-white">Next: Preview →</button>
          </div>
        </section>
      )}

      {/* STEP 4: PREVIEW (student view) */}
      {step === 4 && (
        <StudentPreview
          basics={basics}
          sections={sections}
          pricing={pricing}
        >
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(3)} className="px-4 py-2 rounded-md border">← Back: Pricing</button>
            <button onClick={() => setStep(5)} className="px-4 py-2 rounded-md bg-gray-900 text-white">Proceed to Publish →</button>
          </div>
        </StudentPreview>
      )}

      {/* STEP 5: PUBLISH */}
      {step === 5 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Publish Checklist</h2>
          {publishChecks.length ? (
            <div className="rounded-md border bg-red-50 border-red-200 text-red-800 p-3">
              <div className="font-medium mb-1">Fix these before publishing:</div>
              <ul className="list-disc ml-5">{publishChecks.map((e, i) => (<li key={i}>{e}</li>))}</ul>
            </div>
          ) : (
            <div className="rounded-md border bg-green-50 border-green-200 text-green-800 p-3">All good! You can publish now.</div>
          )}

          <div className="flex justify-between">
            <button onClick={() => setStep(4)} className="px-4 py-2 rounded-md border">← Back: Preview</button>
            <div className="flex gap-2">
              <button onClick={() => saveCourse(false)} disabled={busy} className="px-4 py-2 rounded-md border bg-white hover:bg-gray-50">Save Draft</button>
              <button
                onClick={() => {
                  if (publishChecks.length) return alert("Fix before publish:\n- " + publishChecks.join("\n- "));
                  saveCourse(true);
                }}
                disabled={busy}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Publish
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* ================== Subcomponents ================== */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

function AddLink({ onAdd }: { onAdd: (title: string, url: string) => void }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <input className="flex-1 border rounded-md p-2" placeholder="Resource title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="flex-1 border rounded-md p-2" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
      <button
        onClick={() => {
          if (!title || !url) return;
          onAdd(title, url);
          setTitle(""); setUrl("");
        }}
        className="px-3 py-1 rounded-md border"
      >
        + Link
      </button>
    </div>
  );
}

function QuizViewer({ questions }: { questions: QuizQuestion[] }) {
  if (!questions?.length) return null;
  return (
    <div className="space-y-3">
      {questions.map((q, i) => (
        <div key={i} className="border rounded-md p-3">
          <div className="font-medium">{q.question || "Untitled question"}</div>
          <ul className="mt-2 space-y-1">
            {q.options.map((op, oi) => (
              <li key={oi} className={`px-3 py-2 border rounded ${oi === q.correctIndex ? "bg-green-50 border-green-300" : "bg-white"}`}>
                {op.text || `Option ${oi + 1}`}
              </li>
            ))}
          </ul>
          {q.explanation ? <div className="mt-2 text-sm text-gray-600">Explanation: {q.explanation}</div> : null}
        </div>
      ))}
    </div>
  );
}

/** Student-facing preview (Step 4) */
function StudentPreview({
  basics, sections, pricing, children,
}: {
  basics: Basics;
  sections: SectionDraft[];
  pricing: Pricing;
  children?: React.ReactNode;
}) {
  const [openSec, setOpenSec] = useState<number | null>(0);

  return (
    <section className="space-y-6">
      {/* Hero / header */}
      <div className="bg-gray-900 text-white rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{basics.courseName || "Untitled Course"}</h2>
            <div className="mt-2 text-sm text-gray-300">
              {basics.board || "Board"} • {basics.klass || "Level"} • {basics.subject || "Subject"}
            </div>
            <div className="mt-3 text-sm">
              {(basics.outcomeBullets || []).filter(Boolean).slice(0, 4).map((b, i) => (
                <div key={i}>• {b}</div>
              ))}
            </div>
          </div>
          <div className="w-full max-w-xs">
            <div className="rounded-xl bg-white text-gray-900 p-4">
              <div className="text-2xl font-bold">₹ {Number.isFinite(pricing.price) ? pricing.price : 0}</div>
              <div className="text-sm text-gray-600">One-time purchase</div>
              <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2">Buy now</button>
              <div className="mt-2 text-xs text-gray-500">Preview mode — payment disabled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum preview */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Curriculum</h3>
        <div className="space-y-3">
          {sections.map((sec, si) => {
            const open = openSec === si;
            return (
              <div key={si} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenSec(open ? null : si)}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between"
                >
                  <span className="font-medium">{sec.title || `Section ${si + 1}`}</span>
                  <span className="text-sm text-gray-500">{open ? "−" : "+"}</span>
                </button>

                {open && (
                  <div className="p-4 space-y-4">
                    {/* Section notes/resources/quiz */}
                    {(sec.notes || sec.resources?.length || sec.quiz?.length) ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {sec.notes ? (
                          <div>
                            <div className="font-medium mb-1">Section Notes</div>
                            <div className="prose prose-sm max-w-none whitespace-pre-wrap">{sec.notes}</div>
                          </div>
                        ) : null}
                        {sec.resources?.length ? (
                          <div>
                            <div className="font-medium mb-1">Section Resources</div>
                            <ul className="list-disc ml-5">
                              {sec.resources.map((r, i) => (
                                <li key={i}>
                                  <a className="text-blue-600 underline" href={r.url} target="_blank">{r.title || r.type}</a>
                                  <span className="text-gray-500 text-xs"> ({r.type})</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        {sec.quiz?.length ? (
                          <div className="lg:col-span-2">
                            <div className="font-medium mb-1">Section Quiz</div>
                            <QuizViewer questions={sec.quiz} />
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {/* Lectures */}
                    <div className="space-y-3">
                      {sec.lectures.map((lec, li) => (
                        <div key={li} className="border rounded-md p-3">
                          <div className="font-medium">{lec.title || `Lecture ${li + 1}`}</div>
                          {lec.description ? <div className="text-sm text-gray-600 mt-1">{lec.description}</div> : null}

                          <div className="mt-3">
                            {lec.vdocipherVideoId ? (
                              lec.isFreePreview ? (
                                <FreePreviewPlayer videoId={lec.vdocipherVideoId} />
                              ) : (
                                <LockedVideoPlaceholder />
                              )
                            ) : (
                              <div className="text-xs text-gray-500">No video uploaded</div>
                            )}
                          </div>

                          {/* Lecture notes/resources/quiz */}
                          {(lec.notes || lec.resources?.length || lec.quiz?.length) ? (
                            <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {lec.notes ? (
                                <div>
                                  <div className="font-medium mb-1">Lecture Notes</div>
                                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">{lec.notes}</div>
                                </div>
                              ) : null}
                              {lec.resources?.length ? (
                                <div>
                                  <div className="font-medium mb-1">Lecture Resources</div>
                                  <ul className="list-disc ml-5">
                                    {lec.resources.map((r, i) => (
                                      <li key={i}>
                                        <a className="text-blue-600 underline" href={r.url} target="_blank">{r.title || r.type}</a>
                                        <span className="text-gray-500 text-xs"> ({r.type})</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null}
                              {lec.quiz?.length ? (
                                <div className="lg:col-span-2">
                                  <div className="font-medium mb-1">Lecture Quiz</div>
                                  <QuizViewer questions={lec.quiz} />
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {children}
    </section>
  );
}

/** Free-preview player (VdoCipher). Requires backend `/video/otp` to allow preview OTP by videoId. */
function FreePreviewPlayer({ videoId }: { videoId: string }) {
  const [otp, setOtp] = useState<string>("");
  const [playbackInfo, setPlaybackInfo] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Your backend should allow preview OTP when `preview: true`
        const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/video/otp`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoId, preview: true }),
        });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.message || "OTP failed");
        if (!alive) return;
        setOtp(j.otp);
        setPlaybackInfo(j.playbackInfo);
      } catch (e) {
        // graceful fallback (still render locked placeholder if needed)
      }
    })();
    return () => { alive = false; };
  }, [videoId]);

  const playerId = process.env.NEXT_PUBLIC_VDOCIPHER_PLAYER_ID || "Ub9OiZXIOeUXH0Nv";

  if (!otp || !playbackInfo) {
    // While fetching OTP, show skeleton
    return <div className="w-full aspect-video rounded-md bg-gray-200 animate-pulse" />;
  }

  const src = `https://player.vdocipher.com/v2/?otp=${otp}&playbackInfo=${playbackInfo}&player=${playerId}`;
  return (
    <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
      <iframe
        src={src}
        allow="encrypted-media"
        allowFullScreen
        className="absolute inset-0 w-full h-full rounded-md border-0"
      />
    </div>
  );
}

/** Locked lecture placeholder (blur overlay) */
function LockedVideoPlaceholder() {
  return (
    <div className="relative w-full overflow-hidden rounded-md">
      <div className="w-full aspect-video bg-gray-200" />
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30 flex flex-col items-center justify-center text-white">
        <div className="text-lg font-semibold">Locked Lecture</div>
        <div className="text-sm opacity-90">Purchase course to unlock this content</div>
      </div>
    </div>
  );
}

/** Curriculum editor (Step 2) — unchanged logic, responsive layout */
function CurriculumEditor(props: any) {
  const {
    isMobile, sections, expandedSectionIndex, expandedLectures,
    toggleSectionOpen, renameSection, moveSection, addSection, removeSection,
    addLecture, removeLecture, isLectureOpen, toggleLectureOpen, moveLecture,
    renameLecture, setLectureDesc, onPickVideo, uploadLectureVideo,
    toggleLecturePreview, toggleLectureDoubts,
    setSectionNotes, addSectionResource, addSectionLink, removeSectionResource, toggleSectionDoubts,
    addSectionQuestion, editSectionQuestion, setSectionOption, addSectionOption, removeSectionOption, removeSectionQuestion,
    setLectureNotes, addLectureResourceFile, addLectureResourceLink, removeLectureResource,
    addLectureQuestion, editLectureQuestion, setLectureOption, addLectureOption, removeLectureOption, removeLectureQuestion,
    toast, setStep,
  } = props;

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Curriculum</h2>
        <button onClick={addSection} className="px-3 py-1 rounded-md border">+ Add Section</button>
      </div>

      {sections.map((sec: SectionDraft, si: number) => {
        const sectionOpen = !isMobile || expandedSectionIndex === si;
        return (
          <div key={si} className="border rounded-lg overflow-hidden">
            {/* Section header row */}
            <div className="flex items-center gap-2 p-3">
              <button
                onClick={() => toggleSectionOpen(si)}
                className="px-2 py-1 rounded-md border sm:hidden"
                aria-label={sectionOpen ? "Collapse" : "Expand"}
              >
                {sectionOpen ? "−" : "+"}
              </button>
              <input
                className="flex-1 border rounded-md p-2"
                value={sec.title}
                onChange={(e) => renameSection(si, e.target.value)}
              />
              <div className="hidden sm:flex gap-1">
                <button onClick={() => moveSection(si, "up")} className="px-2 border rounded-md">↑</button>
                <button onClick={() => moveSection(si, "down")} className="px-2 border rounded-md">↓</button>
                <button onClick={() => addLecture(si)} className="px-2 border rounded-md">+ Lecture</button>
                <button onClick={() => removeSection(si)} className="px-2 border rounded-md text-red-600">✕</button>
              </div>
            </div>

            {/* Actions row on mobile */}
            <div className="flex sm:hidden gap-2 px-3">
              <button onClick={() => moveSection(si, "up")} className="px-2 border rounded-md">↑</button>
              <button onClick={() => moveSection(si, "down")} className="px-2 border rounded-md">↓</button>
              <button onClick={() => addLecture(si)} className="px-2 border rounded-md">+ Lecture</button>
              <button onClick={() => removeSection(si)} className="px-2 border rounded-md text-red-600">✕</button>
            </div>

            {/* Section body */}
            {sectionOpen && (
              <div className="p-3 space-y-3">
                {/* Section add-ons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Section Notes (optional)">
                    <textarea className="w-full border rounded-md p-2 min-h-[80px]" value={sec.notes || ""} onChange={(e) => setSectionNotes(si, e.target.value)} />
                  </Field>

                  <Field label="Section Resources (PDF/Image/Link)">
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (f) await addSectionResource(si, f, f.name);
                          e.currentTarget.value = "";
                        }}
                      />
                      <AddLink onAdd={(title, url) => addSectionLink(si, title, url)} />
                      {!!sec.resources?.length && (
                        <ul className="list-disc ml-5 text-sm">
                          {sec.resources.map((r, ri) => (
                            <li key={ri} className="flex items-center gap-2">
                              <span>{r.title} — <a className="text-blue-600 underline" href={r.url} target="_blank">{r.type}</a></span>
                              <button onClick={() => removeSectionResource(si, ri)} className="text-red-600">✕</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Field>

                  <Field label="Section Quiz (optional)">
                    <QuizEditor
                      questions={sec.quiz || []}
                      onAdd={() => addSectionQuestion(si)}
                      onEdit={(qi, v) => editSectionQuestion(si, qi, v)}
                      onSetOption={(qi, oi, text) => setSectionOption(si, qi, oi, text)}
                      onAddOption={(qi) => addSectionOption(si, qi)}
                      onRemoveOption={(qi, oi) => removeSectionOption(si, qi, oi)}
                      onRemove={(qi) => removeSectionQuestion(si, qi)}
                    />
                  </Field>

                  <Field label="Doubts at Section Level">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={!!sec.allowDoubts} onChange={() => toggleSectionDoubts(si)} />
                      Allow students to post doubts under this section
                    </label>
                  </Field>
                </div>

                {/* Lectures */}
                <div className="space-y-3">
                  {sec.lectures.map((lec, li) => {
                    const open = !isMobile || (expandedLectures[si]?.has(li) ?? false);
                    return (
                      <div key={li} className="border rounded-md bg-gray-50">
                        {/* Lecture header */}
                        <div className="flex items-center gap-2 p-2">
                          <button
                            onClick={() => toggleLectureOpen(si, li)}
                            className="px-2 py-1 rounded-md border sm:hidden"
                            aria-label={open ? "Collapse lecture" : "Expand lecture"}
                          >
                            {open ? "−" : "+"}
                          </button>
                          <input
                            className="flex-1 border rounded-md p-2"
                            value={lec.title}
                            onChange={(e) => renameLecture(si, li, e.target.value)}
                            placeholder="Lecture title"
                          />
                          <div className="hidden sm:flex gap-1">
                            <button onClick={() => moveLecture(si, li, "up")} className="px-2 border rounded-md">↑</button>
                            <button onClick={() => moveLecture(si, li, "down")} className="px-2 border rounded-md">↓</button>
                            <button onClick={() => removeLecture(si, li)} className="px-2 border rounded-md text-red-600">✕</button>
                          </div>
                        </div>

                        {/* Lecture actions row on mobile */}
                        <div className="flex sm:hidden gap-2 px-2">
                          <button onClick={() => moveLecture(si, li, "up")} className="px-2 border rounded-md">↑</button>
                          <button onClick={() => moveLecture(si, li, "down")} className="px-2 border rounded-md">↓</button>
                          <button onClick={() => removeLecture(si, li)} className="px-2 border rounded-md text-red-600">✕</button>
                        </div>

                        {open && (
                          <div className="p-3 space-y-3">
                            <textarea
                              className="w-full border rounded-md p-2"
                              value={lec.description || ""}
                              onChange={(e) => setLectureDesc(si, li, e.target.value)}
                              placeholder="Lecture description"
                            />

                            {/* Video & toggles */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                              <div className="flex items-center gap-3">
                                <input type="file" accept="video/*" onChange={(e) => e.target.files?.[0] && onPickVideo(si, li, e.target.files![0])} />
                                <button disabled={!!lec.uploading} onClick={() => uploadLectureVideo(si, li)} className="px-3 py-1 rounded-md border">
                                  {lec.uploading ? "Uploading…" : "Upload Video"}
                                </button>
                              </div>

                              <div className="flex flex-wrap gap-4">
                                {lec.vdocipherVideoId && (
                                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">VideoId: {lec.vdocipherVideoId}</span>
                                )}
                                <label className="flex items-center gap-2 text-sm">
                                  <input type="checkbox" checked={!!lec.isFreePreview} onChange={() => toggleLecturePreview(si, li)} />
                                  Free Preview
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                  <input type="checkbox" checked={!!lec.allowDoubts} onChange={() => toggleLectureDoubts(si, li)} />
                                  Allow doubts
                                </label>
                              </div>
                            </div>

                            {/* Lecture add-ons */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <Field label="Lecture Notes (optional)">
                                <textarea className="w-full border rounded-md p-2 min-h-[80px]" value={lec.notes || ""} onChange={(e) => setLectureNotes(si, li, e.target.value)} />
                              </Field>

                              <Field label="Lecture Resources (optional)">
                                <div className="space-y-2">
                                  <input
                                    type="file"
                                    accept="application/pdf,image/*"
                                    onChange={async (e) => {
                                      const f = e.target.files?.[0];
                                      if (f) await addLectureResourceFile(si, li, f, f.name, f.type.startsWith("image/") ? "image" : "pdf");
                                      e.currentTarget.value = "";
                                    }}
                                  />
                                  <AddLink onAdd={(title, url) => addLectureResourceLink(si, li, title, url)} />
                                  {!!lec.resources?.length && (
                                    <ul className="list-disc ml-5 text-sm">
                                      {lec.resources.map((r, ri) => (
                                        <li key={ri} className="flex items-center gap-2">
                                          <span>{r.title} — <a className="text-blue-600 underline" href={r.url} target="_blank">{r.type}</a></span>
                                          <button onClick={() => removeLectureResource(si, li, ri)} className="text-red-600">✕</button>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </Field>

                              <Field label="Lecture Quiz (optional)">
                                <QuizEditor
                                  questions={lec.quiz || []}
                                  onAdd={() => addLectureQuestion(si, li)}
                                  onEdit={(qi, v) => editLectureQuestion(si, li, qi, v)}
                                  onSetOption={(qi, oi, text) => setLectureOption(si, li, qi, oi, text)}
                                  onAddOption={(qi) => addLectureOption(si, li, qi)}
                                  onRemoveOption={(qi, oi) => removeLectureOption(si, li, qi, oi)}
                                  onRemove={(qi) => removeLectureQuestion(si, li, qi)}
                                />
                              </Field>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end">
                  <button onClick={() => setStep(3)} className="px-4 py-2 rounded-md bg-gray-900 text-white">Next: Pricing →</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

/* -------- Editor-only Quiz component -------- */
function QuizEditor({
  questions,
  onAdd,
  onEdit,
  onSetOption,
  onAddOption,
  onRemoveOption,
  onRemove,
}: {
  questions: QuizQuestion[];
  onAdd: () => void;
  onEdit: (qi: number, v: Partial<QuizQuestion>) => void;
  onSetOption: (qi: number, oi: number, text: string) => void;
  onAddOption: (qi: number) => void;
  onRemoveOption: (qi: number, oi: number) => void;
  onRemove: (qi: number) => void;
}) {
  return (
    <div className="space-y-2">
      <button onClick={onAdd} className="px-3 py-1 rounded-md border">+ Add Question</button>
      {!questions.length && <div className="text-sm text-gray-500">No questions added.</div>}
      {questions.map((q, qi) => (
        <div key={qi} className="p-2 border rounded-md space-y-2">
          <input className="w-full border rounded-md p-2" value={q.question} onChange={(e) => onEdit(qi, { question: e.target.value })} placeholder="Question text" />
          <div className="space-y-1">
            {q.options.map((op, oi) => (
              <div key={oi} className="flex flex-col sm:flex-row sm:items-center gap-2">
                <input className="flex-1 border rounded-md p-2" value={op.text} onChange={(e) => onSetOption(qi, oi, e.target.value)} placeholder={`Option ${oi + 1}`} />
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-sm">
                    <input type="radio" name={`correct-${qi}`} checked={q.correctIndex === oi} onChange={() => onEdit(qi, { correctIndex: oi })} />
                    Correct
                  </label>
                  <button onClick={() => onRemoveOption(qi, oi)} className="px-2 border rounded-md text-red-600">✕</button>
                </div>
              </div>
            ))}
            <button onClick={() => onAddOption(qi)} className="px-2 border rounded-md">+ Option</button>
          </div>
          <textarea className="w-full border rounded-md p-2" value={q.explanation || ""} onChange={(e) => onEdit(qi, { explanation: e.target.value })} placeholder="Explanation (optional)" />
          <div className="flex justify-end">
            <button onClick={() => onRemove(qi)} className="px-2 border rounded-md text-red-600">Remove Question</button>
          </div>
        </div>
      ))}
    </div>
  );
}
