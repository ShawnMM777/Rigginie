import { useState } from "react";
import { Star, Send, ArrowRight, ArrowLeft, CheckCircle2, Zap, Palette, Headphones, DollarSign, User, Layout } from "lucide-react";
import { useNavigate } from 'react-router';
const EMOJIS = ["", "😣", "😕", "😐", "🙂", "🤩"];
const LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];
const COLORS = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#f97316"];

const CATEGORIES = [
  { key: "design",      label: "Design & UI",     Icon: Palette    },
  { key: "performance", label: "Performance",      Icon: Zap        },
  { key: "support",     label: "Customer Support", Icon: Headphones },
  { key: "value",       label: "Value for Money",  Icon: DollarSign },
  { key: "security", label: "Login Security", Icon: Layout },
];

const TAGS = [
  "Easy to use", "Great design", "Fast & reliable", "Helpful support",
  "Good value", "Intuitive", "Feature-rich", "Needs improvement",
  "Highly recommend", "Bug-free",
];

function StarRow({ value, onChange, size = 28, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  const active       = hovered || value;
  const displayColor = COLORS[active] || "#eab308";

  return (
    <div className="flex gap-1" onMouseLeave={() => !readOnly && setHovered(0)}>
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(s === value ? 0 : s)}
          onMouseEnter={() => !readOnly && setHovered(s)}
          className={`transition-all duration-100 ${!readOnly ? "hover:scale-110 active:scale-95 cursor-pointer" : "cursor-default"}`}
        >
          <Star
            size={size}
            fill={s <= active ? displayColor : "none"}
            color={s <= active ? displayColor : "#d1d5db"}
            className="transition-all duration-150 drop-shadow-sm"
          />
        </button>
      ))}
    </div>
  );
}

function StepDots({ step, total }) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === step ? 20 : 8,
            height: 8,
            background: i <= step ? "#f97316" : "#e2e8f0",
          }}
        />
      ))}
    </div>
  );
}

export default function Survey() {
  const navigate = useNavigate();
  const [step,          setStep]          = useState(0);
  const [overallRating, setOverallRating] = useState(0);
  const [catRatings,    setCatRatings]    = useState({});
  const [selectedTags,  setSelectedTags]  = useState([]);
  const [comment,       setComment]       = useState("");
  const [name,          setName]          = useState("");
  const [submitted,     setSubmitted]     = useState(false);

  const toggleTag = (tag) =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const setCatRating = (key, val) =>
    setCatRatings(prev => ({ ...prev, [key]: val }));

  function handleSubmit() {
    setSubmitted(true);
  }

  function handleReset() { setSubmitted(false); setStep(0); setOverallRating(0); setCatRatings({}); setSelectedTags([]);setComment("");setName("");}

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f2f4f3] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-4xl shadow-[0_24px_70px_rgba(15,23,42,0.12)] overflow-hidden border border-slate-200">
            <div className="h-2 w-full bg-orange-500" />
            <div className="px-8 py-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
                  <CheckCircle2 size={44} className="text-orange-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review submitted!</h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Thank you{name ? `, ${name}` : ""}! Your feedback helps us improve every day.
              </p>
              <div className="bg-orange-50 rounded-2xl p-5 mb-6 border border-orange-100">
                <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">Your overall rating</p>
                <div className="flex justify-center mb-2">
                  <StarRow value={overallRating} readOnly size={26} />
                </div>
                <p className="text-3xl font-black text-orange-500">{EMOJIS[overallRating]}</p>
                <p className="text-sm font-bold text-orange-700 mt-1">{LABELS[overallRating]}</p>
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                    {selectedTags.map(t => (
                      <span key={t} className="bg-white border border-orange-100 text-orange-600 text-xs px-2.5 py-1 rounded-full font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => navigate('/')} className="w-full py-3 rounded-xl bg-slate-950 text-white font-bold text-sm hover:bg-orange-500 active:scale-95 transition-all"> Back </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-[#f2f4f3] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-4xl shadow-[0_24px_70px_rgba(15,23,42,0.12)] overflow-hidden border border-slate-200">
          <div className="h-1.5 w-full bg-gray-100">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / 3) * 100}%`, background: "linear-gradient(90deg,#f97316,#f59e0b)" }}
            />
          </div>

          {step === 0 && (
            <div className="px-8 pt-8 pb-6">
              <div className="mb-6 text-center">
                <span className="inline-block text-4xl mb-3 transition-all duration-300 animate-bounce">
                  {overallRating ? EMOJIS[overallRating] : "💬"}
                </span>
                <h2 className="text-xl font-black text-gray-900">How was your experience?</h2>
                <p className="text-sm text-gray-400 mt-1">Tap the stars to rate us</p>
              </div>

                <div className="bg-slate-50 rounded-2xl p-6 mb-4 flex flex-col items-center gap-3 border border-slate-100">
                <StarRow value={overallRating} onChange={setOverallRating} size={40} />
                <div className="h-6 flex items-center justify-center">
                  {overallRating > 0 ? (
                    <span className="text-sm font-bold" style={{ color: COLORS[overallRating] }}>
                      {LABELS[overallRating]}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Select a rating</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-5 gap-1 mb-6">
                {LABELS.slice(1).map((l, i) => (
                  <button
                    key={l}
                    onClick={() => setOverallRating(i + 1)}
                    className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                      overallRating === i + 1 ? "text-white" : "border-gray-100 text-gray-400 bg-gray-50 hover:border-gray-200"
                    }`}
                    style={overallRating === i + 1 ? { background: COLORS[i + 1], borderColor: COLORS[i + 1] } : {}}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(1)}
                disabled={!overallRating}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: overallRating ? "linear-gradient(135deg,#f97316,#f59e0b)" : "#e5e7eb",
                  color: overallRating ? "white" : "#9ca3af",
                }}
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="px-8 pt-8 pb-6">
              <div className="mb-5">
                <h2 className="text-xl font-black text-gray-900">Rate specific areas</h2>
                <p className="text-sm text-gray-400 mt-1">Optional — skip if you prefer</p>
              </div>

              <div className="space-y-3 mb-6">
                {CATEGORIES.map(({ key, label, Icon }) => (
                  <div key={key} className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100">
                        <Icon size={14} className="text-orange-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{label}</span>
                    </div>
                    <StarRow value={catRatings[key] || 0} onChange={v => setCatRating(key, v)} size={18} />
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">Quick feedback</p>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                        selectedTags.includes(tag)
                          ? "border-orange-400 bg-orange-50 text-orange-700"
                          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      {selectedTags.includes(tag) && "✓ "}{tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="flex items-center gap-1.5 px-5 py-3.5 rounded-xl text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft size={15} /> Back
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg,#f97316,#f59e0b)" }}
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="px-8 pt-8 pb-6">
              <div className="mb-5">
                <h2 className="text-xl font-black text-gray-900">Share your thoughts</h2>
                <p className="text-sm text-gray-400 mt-1">Tell us what we can do better</p>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <textarea
                    rows={5}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    maxLength={500}
                    placeholder="What did you love? What could be improved? Be as specific as you'd like…"
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-700 outline-none resize-none placeholder:text-gray-400 transition-all focus:border-orange-400"
                  />
                  <span className={`absolute bottom-3 right-3 text-xs font-medium ${comment.length > 450 ? "text-red-400" : "text-gray-300"}`}>
                    {comment.length}/500
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="w-full border-2 border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 transition-all focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{EMOJIS[overallRating]}</span>
                  <div>
                    <p className="text-xs font-bold text-orange-700">{LABELS[overallRating]}</p>
                    <p className="text-xs text-orange-500">{selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""} selected</p>
                  </div>
                </div>
                <StarRow value={overallRating} readOnly size={14} />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 px-5 py-3.5 rounded-xl text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft size={15} /> Back
                </button>
                <button onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all active:scale-95 shadow-lg shadow-orange-200" style={{ background: "linear-gradient(135deg,#f97316,#f59e0b)" }} > <Send size={15} /> Submit review
                </button>
              </div>
            </div>
          )}

          <div className="pb-5">
            <StepDots step={step} total={3} />
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Your review helps others make better decisions ✨
        </p>
      </div>
    </div>
  );
}