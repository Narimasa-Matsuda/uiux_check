import Link from "next/link";
import ParticlesWrapper from "./components/ParticlesWrapper";

// ── Gradient Button ───────────────────────────────────────────────────────────

function GradientButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-block text-white px-10 py-4 rounded-full text-base font-semibold transition-opacity hover:opacity-90 shadow-lg"
      style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
    >
      {children}
    </Link>
  );
}

// ── Step Illustrations ────────────────────────────────────────────────────────

function IllustStep1() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full max-w-[200px] mx-auto my-6">
      {/* Browser window */}
      <rect x="20" y="10" width="160" height="110" rx="10" fill="white" stroke="#e0deff" strokeWidth="2"/>
      {/* Browser top bar */}
      <rect x="20" y="10" width="160" height="28" rx="10" fill="#f5f3ff"/>
      <rect x="20" y="28" width="160" height="10" fill="#f5f3ff"/>
      {/* Traffic lights */}
      <circle cx="38" cy="24" r="5" fill="#ff6b6b" opacity="0.8"/>
      <circle cx="52" cy="24" r="5" fill="#ffd93d" opacity="0.8"/>
      <circle cx="66" cy="24" r="5" fill="#6bcb77" opacity="0.8"/>
      {/* Address bar */}
      <rect x="80" y="16" width="90" height="16" rx="8" fill="white" stroke="#e0deff" strokeWidth="1.5"/>
      <text x="91" y="27" fill="#9ca3af" fontSize="7">https://</text>
      {/* Content area - URL input */}
      <rect x="32" y="50" width="136" height="36" rx="6" fill="#f5f3ff" stroke="#e0deff" strokeWidth="1.5"/>
      <text x="68" y="72" fill="#6366f1" fontSize="9" fontWeight="600">URLを入力してください</text>
      {/* Search icon */}
      <circle cx="47" cy="68" r="7" stroke="#a5b4fc" strokeWidth="2"/>
      <line x1="52" y1="73" x2="56" y2="77" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round"/>
      {/* Button */}
      <rect x="60" y="96" width="80" height="18" rx="9" fill="url(#step1grad)"/>
      <text x="100" y="109" textAnchor="middle" fill="white" fontSize="8" fontWeight="600">診断を開始</text>
      <defs>
        <linearGradient id="step1grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#8b5cf6"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function IllustStep2() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full max-w-[200px] mx-auto my-6">
      {/* Main panel */}
      <rect x="15" y="10" width="170" height="120" rx="10" fill="white" stroke="#e0deff" strokeWidth="2"/>
      {/* Top bar */}
      <rect x="15" y="10" width="170" height="22" rx="10" fill="#f5f3ff"/>
      <rect x="15" y="22" width="170" height="10" fill="#f5f3ff"/>
      <circle cx="29" cy="21" r="4" fill="#d0d0f0"/>
      <circle cx="41" cy="21" r="4" fill="#d0d0f0"/>
      <text x="100" y="25" textAnchor="middle" fill="#9ca3af" fontSize="7">AI分析中...</text>
      {/* Bar chart */}
      <rect x="30" y="90" width="14" height="30" rx="3" fill="#6366f1" opacity="0.9"/>
      <rect x="50" y="75" width="14" height="45" rx="3" fill="#8b5cf6" opacity="0.9"/>
      <rect x="70" y="60" width="14" height="60" rx="3" fill="#6366f1" opacity="0.7"/>
      <rect x="90" y="80" width="14" height="40" rx="3" fill="#a78bfa" opacity="0.8"/>
      <rect x="110" y="50" width="14" height="70" rx="3" fill="#6366f1" opacity="0.9"/>
      <line x1="28" y1="122" x2="130" y2="122" stroke="#e0deff" strokeWidth="1.5"/>
      {/* Score circle */}
      <circle cx="160" cy="75" r="25" fill="#f5f3ff" stroke="#6366f1" strokeWidth="2"/>
      <circle cx="160" cy="75" r="25" fill="none" stroke="#6366f1" strokeWidth="4"
        strokeDasharray="94 157" strokeLinecap="round" transform="rotate(-90 160 75)" opacity="0.3"/>
      <text x="160" y="79" textAnchor="middle" fill="#6366f1" fontSize="14" fontWeight="800">AI</text>
      {/* Processing dots */}
      <circle cx="140" cy="110" r="4" fill="#6366f1" opacity="0.9"/>
      <circle cx="152" cy="110" r="4" fill="#8b5cf6" opacity="0.6"/>
      <circle cx="164" cy="110" r="4" fill="#a78bfa" opacity="0.4"/>
    </svg>
  );
}

function IllustStep3() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-full max-w-[200px] mx-auto my-6">
      {/* Device frame */}
      <rect x="50" y="8" width="100" height="124" rx="12" fill="#f5f3ff" stroke="#e0deff" strokeWidth="2"/>
      <rect x="55" y="18" width="90" height="90" rx="6" fill="white"/>
      {/* Score display */}
      <circle cx="100" cy="48" r="24" fill="none" stroke="#e0deff" strokeWidth="5"/>
      <circle cx="100" cy="48" r="24" fill="none" stroke="url(#scoreGrad)" strokeWidth="5"
        strokeDasharray="100 151" strokeLinecap="round" transform="rotate(-90 100 48)"/>
      <text x="100" y="44" textAnchor="middle" fill="#6366f1" fontSize="16" fontWeight="800">72</text>
      <text x="100" y="56" textAnchor="middle" fill="#9ca3af" fontSize="7">/100</text>
      {/* Score bars */}
      <text x="60" y="80" fill="#9ca3af" fontSize="6">第一印象</text>
      <rect x="60" y="83" width="70" height="4" rx="2" fill="#e0deff"/>
      <rect x="60" y="83" width="50" height="4" rx="2" fill="#6366f1"/>
      <text x="60" y="96" fill="#9ca3af" fontSize="6">情報設計</text>
      <rect x="60" y="99" width="70" height="4" rx="2" fill="#e0deff"/>
      <rect x="60" y="99" width="60" height="4" rx="2" fill="#8b5cf6"/>
      <text x="60" y="112" fill="#9ca3af" fontSize="6">CTA</text>
      <rect x="60" y="115" width="70" height="4" rx="2" fill="#e0deff"/>
      <rect x="60" y="115" width="35" height="4" rx="2" fill="#a78bfa"/>
      {/* Home button */}
      <circle cx="100" cy="122" r="5" fill="#e0deff"/>
      <defs>
        <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#8b5cf6"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Feature Icons ─────────────────────────────────────────────────────────────

function IconFirstImpression() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 mx-auto">
      <rect x="10" y="15" width="60" height="45" rx="6" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1.5"/>
      <rect x="10" y="15" width="60" height="16" rx="6" fill="#ddd6fe"/>
      <rect x="10" y="25" width="60" height="6" fill="#ddd6fe"/>
      <circle cx="20" cy="23" r="3.5" fill="#f87171" opacity="0.8"/>
      <circle cx="30" cy="23" r="3.5" fill="#fbbf24" opacity="0.8"/>
      <circle cx="40" cy="23" r="3.5" fill="#34d399" opacity="0.8"/>
      <rect x="18" y="36" width="28" height="18" rx="3" fill="#c4b5fd" opacity="0.5"/>
      <path d="M24 48 L30 42 L36 46 L40 42" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="50" y="36" width="14" height="6" rx="2" fill="#7c3aed" opacity="0.6"/>
      <rect x="50" y="45" width="14" height="4" rx="2" fill="#c4b5fd"/>
      <rect x="50" y="52" width="10" height="4" rx="2" fill="#c4b5fd"/>
      <circle cx="62" cy="20" r="8" fill="#f97316"/>
      <path d="M59 20h6M62 17v6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function IconInfoArch() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 mx-auto">
      <rect x="28" y="10" width="24" height="14" rx="4" fill="#7c3aed" opacity="0.9"/>
      <text x="40" y="21" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">TOP</text>
      <rect x="10" y="32" width="22" height="12" rx="4" fill="#8b5cf6" opacity="0.8"/>
      <rect x="48" y="32" width="22" height="12" rx="4" fill="#8b5cf6" opacity="0.8"/>
      <rect x="8" y="52" width="16" height="12" rx="3" fill="#a78bfa" opacity="0.7"/>
      <rect x="28" y="52" width="16" height="12" rx="3" fill="#a78bfa" opacity="0.7"/>
      <rect x="56" y="52" width="16" height="12" rx="3" fill="#a78bfa" opacity="0.7"/>
      <line x1="40" y1="24" x2="21" y2="32" stroke="#7c3aed" strokeWidth="1.5" opacity="0.6"/>
      <line x1="40" y1="24" x2="59" y2="32" stroke="#7c3aed" strokeWidth="1.5" opacity="0.6"/>
      <line x1="21" y1="44" x2="16" y2="52" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.5"/>
      <line x1="21" y1="44" x2="36" y2="52" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.5"/>
      <line x1="59" y1="44" x2="64" y2="52" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.5"/>
    </svg>
  );
}

function IconCTA() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 mx-auto">
      <rect x="12" y="28" width="56" height="22" rx="11" fill="url(#ctaGrad)"/>
      <text x="40" y="43" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">ACTION</text>
      {/* Cursor/hand */}
      <path d="M54 54 C54 54 60 62 56 68" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M56 68 C54 72 58 74 60 70 L66 58" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
      {/* Sparkles */}
      <path d="M14 20 L16 14 L18 20 L24 22 L18 24 L16 30 L14 24 L8 22 Z" fill="#fbbf24" opacity="0.8"/>
      <path d="M58 16 L59.5 12 L61 16 L65 17.5 L61 19 L59.5 23 L58 19 L54 17.5 Z" fill="#c4b5fd" opacity="0.8"/>
      <defs>
        <linearGradient id="ctaGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#8b5cf6"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconTrust() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 mx-auto">
      <rect x="12" y="14" width="56" height="40" rx="6" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1.5"/>
      <rect x="18" y="22" width="44" height="10" rx="3" fill="#ddd6fe"/>
      <rect x="18" y="36" width="28" height="6" rx="2" fill="#e8e4ff"/>
      <rect x="18" y="45" width="20" height="5" rx="2" fill="#e8e4ff"/>
      <circle cx="56" cy="60" r="14" fill="url(#trustGrad)"/>
      <path d="M50 60 L54.5 65 L62 54" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="trustGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#8b5cf6"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconNav() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 mx-auto">
      <circle cx="40" cy="40" r="28" stroke="#ddd6fe" strokeWidth="2.5"/>
      <circle cx="40" cy="40" r="18" stroke="#c4b5fd" strokeWidth="2"/>
      <circle cx="40" cy="40" r="8" fill="url(#navGrad)"/>
      <line x1="40" y1="10" x2="40" y2="20" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round"/>
      <line x1="40" y1="60" x2="40" y2="70" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round"/>
      <line x1="10" y1="40" x2="20" y2="40" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round"/>
      <line x1="60" y1="40" x2="70" y2="40" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round"/>
      <path d="M37 37 L46 40 L37 43 Z" fill="white"/>
      <defs>
        <linearGradient id="navGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#8b5cf6"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function IconPriority() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16 mx-auto">
      <path d="M40 10 L64 58 H16 Z" fill="#ede9fe"/>
      <path d="M40 18 L58 54 H22 Z" fill="#c4b5fd" opacity="0.6"/>
      <path d="M40 26 L53 52 H27 Z" fill="#8b5cf6" opacity="0.7"/>
      <path d="M40 34 L48 50 H32 Z" fill="url(#prioGrad)"/>
      <circle cx="40" cy="10" r="6" fill="#f97316"/>
      <text x="40" y="14" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">1</text>
      <line x1="12" y1="64" x2="68" y2="64" stroke="#ddd6fe" strokeWidth="2" strokeLinecap="round"/>
      <defs>
        <linearGradient id="prioGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1"/>
          <stop offset="100%" stopColor="#8b5cf6"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Crystal Decorations ───────────────────────────────────────────────────────

function CrystalLeft() {
  return (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 opacity-50 pointer-events-none select-none" aria-hidden>
      <svg viewBox="0 0 220 300" fill="none" className="w-44 md:w-64">
        <path d="M110 20 L200 90 L170 240 L50 240 L20 90 Z" fill="url(#cll1)" opacity="0.5"/>
        <path d="M110 20 L200 90 L110 55 Z" fill="url(#cll2)" opacity="0.85"/>
        <path d="M110 20 L20 90 L110 55 Z" fill="url(#cll3)" opacity="0.6"/>
        <path d="M200 90 L170 240 L110 55 Z" fill="url(#cll4)" opacity="0.4"/>
        <path d="M20 90 L50 240 L110 55 Z" fill="url(#cll5)" opacity="0.3"/>
        <defs>
          <linearGradient id="cll1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c7d2fe"/><stop offset="100%" stopColor="#818cf8"/></linearGradient>
          <linearGradient id="cll2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#e0e7ff"/><stop offset="100%" stopColor="#a5b4fc"/></linearGradient>
          <linearGradient id="cll3" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ddd6fe"/><stop offset="100%" stopColor="#c4b5fd"/></linearGradient>
          <linearGradient id="cll4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#6366f1"/></linearGradient>
          <linearGradient id="cll5" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#a5b4fc"/><stop offset="100%" stopColor="#818cf8"/></linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function CrystalRight() {
  return (
    <div className="absolute right-0 top-1/3 translate-x-1/4 opacity-50 pointer-events-none select-none" aria-hidden>
      <svg viewBox="0 0 220 300" fill="none" className="w-44 md:w-64">
        <path d="M110 20 L200 100 L160 260 L60 260 L20 100 Z" fill="url(#crr1)" opacity="0.4"/>
        <path d="M110 20 L200 100 L110 60 Z" fill="url(#crr2)" opacity="0.75"/>
        <path d="M110 20 L20 100 L110 60 Z" fill="url(#crr3)" opacity="0.55"/>
        <path d="M200 100 L160 260 L110 60 Z" fill="url(#crr4)" opacity="0.35"/>
        <path d="M20 100 L60 260 L110 60 Z" fill="url(#crr5)" opacity="0.25"/>
        <defs>
          <linearGradient id="crr1" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fed7aa"/><stop offset="100%" stopColor="#fb923c"/></linearGradient>
          <linearGradient id="crr2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ffedd5"/><stop offset="100%" stopColor="#fed7aa"/></linearGradient>
          <linearGradient id="crr3" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fff7ed"/><stop offset="100%" stopColor="#ffedd5"/></linearGradient>
          <linearGradient id="crr4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fb923c"/><stop offset="100%" stopColor="#f97316"/></linearGradient>
          <linearGradient id="crr5" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#fed7aa"/><stop offset="100%" stopColor="#fb923c"/></linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const features = [
    { title: "第一印象", desc: "訪問者が最初に受けるビジュアル・訴求力 の評価", icon: <IconFirstImpression /> },
    { title: "情報設計", desc: "コンテンツの構成・情報の伝わりやすさを分析", icon: <IconInfoArch /> },
    { title: "CTAの明確さ", desc: "行動喚起ボタンの配置・文言・視認性を評価", icon: <IconCTA /> },
    { title: "信頼性", desc: "会社情報・実績・セキュリティ表示の充実度", icon: <IconTrust /> },
    { title: "ナビゲーション", desc: "メニュー構造・導線の使いやすさを診断", icon: <IconNav /> },
    { title: "改善優先度", desc: "コンバージョンに最も影響する課題を特定", icon: <IconPriority /> },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
        <ParticlesWrapper />
        <CrystalLeft />
        <CrystalRight />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400 mb-8 tracking-wide">
            あなたのサイトを
            <span className="font-bold" style={{ color: "#6366f1" }}>AI</span>
            が
            <span className="font-bold" style={{ color: "#6366f1" }}>3分</span>
            で診断します。
          </p>

          <h1 className="mb-8 leading-tight">
            <span
              className="block font-black tracking-tight"
              style={{ fontSize: "clamp(3rem, 10vw, 6rem)" }}
            >
              <span style={{
                background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>UI</span>
              <span className="text-gray-300 mx-1">/</span>
              <span style={{
                background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>UX</span>
              {" "}
              <span style={{
                background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>AI</span>
              {" "}
              <span style={{
                background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>診断</span>
            </span>
          </h1>

          <p className="text-gray-500 text-sm md:text-base mb-2 leading-relaxed">
            AIによるUI/UX自動診断エンジン。定性的なデザインを、定量的なスコアで可視化。
          </p>
          <p className="text-gray-500 text-sm md:text-base mb-10 leading-relaxed">
            問題箇所の特定から実装レベルの改善提案まで、わずか3分で完了。
          </p>

          <GradientButton href="/diagnosis">無料診断を行う</GradientButton>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="py-20 bg-indigo-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">診断の流れ</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { step: "01", title: "URLを入力", desc: "診断したいサイトのURLを入力するだけ。難しい設定は一切不要です。", illust: <IllustStep1 /> },
              { step: "02", title: "AIが自動診断", desc: "スクリーンショット取得・HTML解析・AI分析を自動実行。約10〜20秒で完了。", illust: <IllustStep2 /> },
              { step: "03", title: "スコアと提案を確認", desc: "6つの観点でスコア化。最優先の改善点と具体的な対策を提案します。", illust: <IllustStep3 /> },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm text-center flex flex-col items-center">
                <p className="text-xs font-bold tracking-widest mb-2" style={{ color: "#6366f1" }}>STEP {item.step}</p>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
                {item.illust}
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <GradientButton href="/diagnosis">無料診断を行う</GradientButton>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">診断でわかること</h2>
          <p className="text-center text-gray-400 text-sm mb-4">6つの観点でUI/UXを総合評価（100点満点）</p>
          <p className="text-center text-gray-500 text-sm max-w-2xl mx-auto mb-12 leading-relaxed">
            この診断は感性（視覚的な訴求力）による評価ではなく、<br className="hidden md:block"/>
            配置、視認性、情報設計など、Webデザインの原則に基づいた論理的なUI/UX診断を行います。
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((item) => (
              <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                {item.icon}
                <h3 className="font-bold text-gray-800 mt-4 mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        className="py-20"
        style={{ background: "linear-gradient(135deg, #bfdbfe 0%, #c7d2fe 50%, #ddd6fe 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">今すぐ無料で診断する</h2>
          <p className="text-gray-600 mb-10">URLを入力するだけ。診断結果は即座に表示されます。</p>
          <GradientButton href="/diagnosis">無料診断を行う</GradientButton>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-6 bg-white border-t border-gray-100">
        <p className="text-center text-gray-400 text-xs">©2025 UI/UX AI診断</p>
      </footer>
    </>
  );
}
