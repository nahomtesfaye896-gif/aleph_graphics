import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { api } from "../../lib/api";
import { type CourseMeta } from "../../data/site";

export function AdminCourses() {
  const [courses, setCourses] = useState<CourseMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<CourseMeta>>({});
  
  // To handle arrays
  const [learnEnInput, setLearnEnInput] = useState("");
  const [learnAmInput, setLearnAmInput] = useState("");
  const [toolsInput, setToolsInput] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await api.get<CourseMeta[]>("/courses/");
      setCourses(data);
    } catch (err: any) {
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddNew = () => {
    setCurrentCourse({
      key: "",
      nameEn: "",
      nameAm: "",
      taglineEn: "",
      taglineAm: "",
      descEn: "",
      descAm: "",
      longEn: "",
      longAm: "",
      feeEtb: "",
      accent: "from-sky-500 to-blue-700",
      image: "",
      popular: false,
      sortOrder: courses.length,
    });
    setLearnEnInput("");
    setLearnAmInput("");
    setToolsInput("");
    setIsEditing(true);
  };

  const handleEdit = (c: CourseMeta) => {
    setCurrentCourse(c);
    setLearnEnInput(c.learnEn ? c.learnEn.join("\n") : "");
    setLearnAmInput(c.learnAm ? c.learnAm.join("\n") : "");
    setToolsInput(c.tools ? c.tools.join(", ") : "");
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/courses/${id}/`);
      fetchCourses();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...currentCourse,
        learnEn: learnEnInput.split("\n").filter((i) => i.trim() !== ""),
        learnAm: learnAmInput.split("\n").filter((i) => i.trim() !== ""),
        tools: toolsInput.split(",").map((i) => i.trim()).filter((i) => i !== ""),
      };

      if (payload.id) {
        await api.put(`/courses/${payload.id}/`, payload);
      } else {
        await api.post(`/courses/`, payload);
      }
      setIsEditing(false);
      fetchCourses();
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    }
  };

  if (loading && !isEditing) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{currentCourse.id ? "Edit Course" : "New Course"}</h2>
          <button onClick={() => setIsEditing(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">Unique Key (slug)</label>
              <input required type="text" value={currentCourse.key || ""} onChange={(e) => setCurrentCourse({ ...currentCourse, key: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" placeholder="e.g. photoshop" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">Sort Order</label>
              <input type="number" value={currentCourse.sortOrder || 0} onChange={(e) => setCurrentCourse({ ...currentCourse, sortOrder: parseInt(e.target.value) })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">Name (English)</label>
              <input required type="text" value={currentCourse.nameEn || ""} onChange={(e) => setCurrentCourse({ ...currentCourse, nameEn: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" placeholder="e.g. Adobe Photoshop" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">Name (Amharic)</label>
              <input type="text" value={currentCourse.nameAm || ""} onChange={(e) => setCurrentCourse({ ...currentCourse, nameAm: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" placeholder="e.g. አዶቤ ፎቶሾፕ" />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">Tagline (English)</label>
              <input type="text" value={currentCourse.taglineEn || ""} onChange={(e) => setCurrentCourse({ ...currentCourse, taglineEn: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" placeholder="e.g. Photo editing & digital design" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">Tagline (Amharic)</label>
              <input type="text" value={currentCourse.taglineAm || ""} onChange={(e) => setCurrentCourse({ ...currentCourse, taglineAm: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">Short Desc (English)</label>
              <textarea rows={2} value={currentCourse.descEn || ""} onChange={(e) => setCurrentCourse({ ...currentCourse, descEn: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" placeholder="Brief description for the card view" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">Short Desc (Amharic)</label>
              <textarea rows={2} value={currentCourse.descAm || ""} onChange={(e) => setCurrentCourse({ ...currentCourse, descAm: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" />
            </div>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">Long Desc (English)</label>
              <textarea rows={4} value={currentCourse.longEn || ""} onChange={(e) => setCurrentCourse({ ...currentCourse, longEn: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" placeholder="Detailed description for the learn more section" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">Long Desc (Amharic)</label>
              <textarea rows={4} value={currentCourse.longAm || ""} onChange={(e) => setCurrentCourse({ ...currentCourse, longAm: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">What you will learn (English - 1 per line)</label>
              <textarea rows={4} value={learnEnInput} onChange={(e) => setLearnEnInput(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" placeholder={"Layers, masks & retouching\nColor correction\nSocial media design"} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">What you will learn (Amharic - 1 per line)</label>
              <textarea rows={4} value={learnAmInput} onChange={(e) => setLearnAmInput(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">Tools (Comma separated)</label>
            <input type="text" value={toolsInput} onChange={(e) => setToolsInput(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" placeholder="e.g. Photoshop, Camera Raw, Canva" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">Fee ETB</label>
              <input type="text" value={currentCourse.feeEtb || ""} onChange={(e) => setCurrentCourse({ ...currentCourse, feeEtb: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" placeholder="e.g. 6,500" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">Accent Colors (Tailwind gradient)</label>
              <select value={currentCourse.accent || "from-sky-500 to-blue-700"} onChange={(e) => setCurrentCourse({ ...currentCourse, accent: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30">
                <option value="from-sky-500 to-blue-700">Blue (Sky → Blue)</option>
                <option value="from-amber-500 to-orange-600">Orange (Amber → Orange)</option>
                <option value="from-brand-600 to-indigo-700">Indigo (Brand → Indigo)</option>
                <option value="from-violet-600 to-fuchsia-600">Purple (Violet → Fuchsia)</option>
                <option value="from-emerald-500 to-teal-600">Green (Emerald → Teal)</option>
                <option value="from-rose-500 to-pink-600">Pink (Rose → Pink)</option>
                <option value="from-cyan-500 to-blue-500">Cyan (Cyan → Blue)</option>
                <option value="from-lime-500 to-green-600">Lime (Lime → Green)</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">Image URL</label>
            <input type="text" value={currentCourse.image || ""} onChange={(e) => setCurrentCourse({ ...currentCourse, image: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30" placeholder="https://images.pexels.com/..." />
          </div>

          <label className="flex items-center gap-3">
            <input type="checkbox" checked={currentCourse.popular || false} onChange={(e) => setCurrentCourse({ ...currentCourse, popular: e.target.checked })} className="h-5 w-5 rounded border-slate-600 bg-slate-950 text-brand-600 focus:ring-brand-600" />
            <span className="text-sm font-semibold text-slate-200">Mark as Popular</span>
          </label>

          <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
            <button type="button" onClick={() => setIsEditing(false)} className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-white">
              Cancel
            </button>
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-600/30 hover:bg-brand-500">
              <Save className="h-4 w-4" />
              Save Course
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white">Manage Courses</h2>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-brand-600/30 hover:bg-brand-500"
        >
          <Plus className="h-4 w-4" />
          Add Course
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/50 p-4 text-sm font-medium text-red-300">
          {error}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-12 text-center shadow-xl">
          <ImageIcon className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="mt-4 text-lg font-bold text-white">No Courses Yet</h3>
          <p className="mt-2 text-sm text-slate-400">Click the button above to add your first course.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <div key={course.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-xl sm:flex-row sm:items-center">
              <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-800">
                {course.image ? (
                  <img src={course.image} alt={course.nameEn} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-slate-600" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white">{course.nameEn}</h3>
                  {course.popular && (
                    <span className="rounded-full bg-brand-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-300 border border-brand-500/30">Popular</span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-400 line-clamp-1">{course.descEn}</p>
                <div className="mt-2 flex gap-4 text-xs font-semibold text-slate-500">
                  <span>Order: {course.sortOrder}</span>
                  <span>{course.feeEtb} ETB</span>
                  <span>{course.tools?.length || 0} Tools</span>
                </div>
              </div>
              <div className="flex shrink-0 gap-2 border-t border-white/10 pt-4 sm:border-0 sm:pt-0">
                <button
                  onClick={() => handleEdit(course)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-sky-500/20 hover:text-sky-400"
                  title="Edit Course"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(course.id!)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-red-500/20 hover:text-red-400"
                  title="Delete Course"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
