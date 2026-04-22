import Link from "next/link";
import ParticlesWrapper from "./components/ParticlesWrapper";

function GradientButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-w-[194px] items-center justify-center rounded-full px-10 py-3.5 text-[1.05rem] font-black tracking-[-0.02em] text-white shadow-[0_14px_34px_rgba(95,106,255,0.22)] transition-transform duration-200 hover:-translate-y-0.5"
      style={{ background: "linear-gradient(90deg, #8b46ff 0%, #2f9bff 100%)" }}
    >
      {children}
    </Link>
  );
}

function HeroLogo() {
  return (
    <div className="mx-auto mb-6 flex w-full max-w-[900px] flex-col items-center">
      <svg viewBox="0 0 860 240" className="w-full max-w-[660px]" aria-label="UIUX">
        <defs>
          <linearGradient id="ui-fill" x1="90" y1="38" x2="332" y2="222" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#aeb8ff" />
            <stop offset="18%" stopColor="#707dff" />
            <stop offset="47%" stopColor="#4040aa" />
            <stop offset="77%" stopColor="#646fff" />
            <stop offset="100%" stopColor="#c2c8ff" />
          </linearGradient>
          <linearGradient id="ux-fill" x1="520" y1="28" x2="760" y2="228" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffd8a8" />
            <stop offset="18%" stopColor="#ffa74d" />
            <stop offset="46%" stopColor="#f17311" />
            <stop offset="72%" stopColor="#d95f06" />
            <stop offset="100%" stopColor="#ffd5a4" />
          </linearGradient>
          <linearGradient id="slash-fill" x1="350" y1="16" x2="426" y2="214" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c7c7c7" />
            <stop offset="42%" stopColor="#6a6a6a" />
            <stop offset="100%" stopColor="#e1e1e1" />
          </linearGradient>
          <clipPath id="u-clip">
            <path d="M70 48 H130 V145 C130 164 141 176 160 176 C180 176 192 164 192 145 V48 H252 V149 C252 200 217 223 160 223 C104 223 70 200 70 149 Z" />
          </clipPath>
          <clipPath id="x-clip">
            <path d="M590 48 H650 L693 102 L736 48 H802 L725 134 L806 222 H744 L693 167 L641 222 H576 L659 134 Z" />
          </clipPath>
          <pattern id="ui-facets" width="44" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
            <path d="M0 0 L22 0 L11 22 Z" fill="rgba(255,255,255,0.34)" />
            <path d="M22 0 L44 0 L33 22 Z" fill="rgba(54,44,148,0.20)" />
            <path d="M0 44 L22 44 L11 22 Z" fill="rgba(47,64,188,0.22)" />
            <path d="M22 44 L44 44 L33 22 Z" fill="rgba(255,255,255,0.10)" />
          </pattern>
          <pattern id="ux-facets" width="44" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(16)">
            <path d="M0 0 L22 0 L11 22 Z" fill="rgba(255,255,255,0.30)" />
            <path d="M22 0 L44 0 L33 22 Z" fill="rgba(170,74,8,0.18)" />
            <path d="M0 44 L22 44 L11 22 Z" fill="rgba(255,255,255,0.12)" />
            <path d="M22 44 L44 44 L33 22 Z" fill="rgba(194,92,18,0.20)" />
          </pattern>
        </defs>

        <g transform="translate(8 6)">
          <path d="M70 48 H130 V145 C130 164 141 176 160 176 C180 176 192 164 192 145 V48 H252 V149 C252 200 217 223 160 223 C104 223 70 200 70 149 Z" fill="url(#ui-fill)" />
          <g clipPath="url(#u-clip)">
            <rect x="68" y="44" width="188" height="184" fill="url(#ui-facets)" opacity="0.9" />
            <path d="M78 48 L110 102 L92 222" stroke="rgba(40,42,146,0.28)" strokeWidth="2" />
            <path d="M120 48 L157 112 L160 222" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
            <path d="M191 48 L164 118 L205 222" stroke="rgba(41,53,194,0.24)" strokeWidth="2" />
            <path d="M224 48 L198 114 L238 222" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
          </g>

          <path d="M284 48 H340 V222 H284 Z" fill="url(#ui-fill)" />
          <rect x="297" y="48" width="30" height="174" fill="url(#ui-facets)" opacity="0.88" />
          <path d="M302 48 L326 116 L304 222" stroke="rgba(40,42,146,0.24)" strokeWidth="2" />
          <path d="M320 48 L312 122 L326 222" stroke="rgba(255,255,255,0.24)" strokeWidth="2" />

          <path d="M392 218 L450 48 H502 L441 218 Z" fill="url(#slash-fill)" />
          <path d="M424 188 L476 48" stroke="rgba(255,255,255,0.28)" strokeWidth="3" />
          <path d="M410 224 L464 74" stroke="rgba(72,72,72,0.18)" strokeWidth="3" />

          <path d="M510 48 H570 V145 C570 164 581 176 600 176 C620 176 632 164 632 145 V48 H692 V149 C692 200 657 223 600 223 C544 223 510 200 510 149 Z" fill="url(#ux-fill)" />
          <path d="M590 48 H650 L693 102 L736 48 H802 L725 134 L806 222 H744 L693 167 L641 222 H576 L659 134 Z" fill="url(#ux-fill)" />
          <g clipPath="url(#x-clip)">
            <rect x="574" y="44" width="238" height="184" fill="url(#ux-facets)" opacity="0.92" />
            <path d="M603 48 L646 112 L616 222" stroke="rgba(255,255,255,0.22)" strokeWidth="2.5" />
            <path d="M688 48 L698 102 L668 222" stroke="rgba(162,72,5,0.22)" strokeWidth="2.5" />
            <path d="M768 48 L720 116 L786 222" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" />
          </g>

        </g>
      </svg>
      <div className="-mt-2 flex items-end justify-center gap-3 text-center leading-none md:-mt-4">
        <span
          className="text-[clamp(2.5rem,6.5vw,4.25rem)] font-black tracking-[-0.08em]"
          style={{
            background: "linear-gradient(90deg, #7e3fff 0%, #554dff 45%, #2f8eff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          AI診断
        </span>
      </div>
    </div>
  );
}

function StepIllustration({ step }: { step: 1 | 2 | 3 }) {
  if (step === 1) {
    return (
      <svg viewBox="0 0 220 150" fill="none" className="mx-auto my-5 w-full max-w-[180px]">
        <rect x="26" y="28" width="72" height="96" rx="8" fill="#ffffff" stroke="#bfcfff" strokeWidth="2" />
        <rect x="26" y="28" width="72" height="16" rx="8" fill="#eef1ff" />
        <circle cx="38" cy="36" r="3" fill="#6f61ff" opacity="0.35" />
        <circle cx="48" cy="36" r="3" fill="#6f61ff" opacity="0.18" />
        <rect x="36" y="55" width="52" height="36" rx="5" fill="#ffffff" stroke="#d3deff" />
        <path d="M42 83 L54 70 L64 77 L80 61" stroke="#6f61ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="78" cy="56" r="10" fill="#ff8a28" />
        <text x="78" y="60" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">α</text>
        <circle cx="136" cy="64" r="24" fill="#ffffff" stroke="#d2dcff" strokeWidth="2" />
        <path d="M130 64 C130 56 142 56 142 64 C142 69 138 71 136 74 C134 76 134 78 134 78" stroke="#ff8a28" strokeWidth="3" strokeLinecap="round" />
        <circle cx="134" cy="85" r="2.5" fill="#ff8a28" />
        <circle cx="170" cy="102" r="17" fill="#ffffff" stroke="#d7e1ff" strokeWidth="2" />
        <path d="M164 102 L170 108 L178 94" stroke="#6f61ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M102 112 L130 92" stroke="#d7e1ff" strokeDasharray="3 4" />
        <path d="M98 48 L120 56" stroke="#d7e1ff" strokeDasharray="3 4" />
        <path d="M154 82 L165 91" stroke="#d7e1ff" strokeDasharray="3 4" />
      </svg>
    );
  }

  if (step === 2) {
    return (
      <svg viewBox="0 0 220 150" fill="none" className="mx-auto my-5 w-full max-w-[180px]">
        <path d="M36 114 L98 54 L182 84 L120 124 Z" fill="#fbfcff" stroke="#cfdaff" strokeWidth="2" />
        <path d="M52 102 L102 57 L164 84 L117 114 Z" fill="#ffffff" stroke="#d3dcff" />
        <path d="M86 74 L100 64 L100 104 L86 96 Z" fill="#7b47ff" opacity="0.95" />
        <path d="M104 63 L118 54 L118 100 L104 104 Z" fill="#5d6dff" />
        <path d="M122 57 L136 49 L136 92 L122 98 Z" fill="#ff8a28" />
        <path d="M140 62 L154 55 L154 86 L140 92 Z" fill="#2f8eff" />
        <path d="M72 110 L162 110" stroke="#d7deff" strokeDasharray="3 4" />
        <path d="M20 120 L66 96" stroke="#d7deff" strokeDasharray="3 4" />
        <path d="M62 130 L94 110" stroke="#d7deff" strokeDasharray="3 4" />
        <path d="M145 34 L172 58" stroke="#d7deff" strokeDasharray="3 4" />
        <path d="M166 108 L194 92" stroke="#d7deff" strokeDasharray="3 4" />
        <circle cx="147" cy="44" r="17" fill="#ffffff" stroke="#d6deff" strokeWidth="2" />
        <path d="M140 50 L146 39 L151 45 L158 34" stroke="#ff7d1f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 220 150" fill="none" className="mx-auto my-5 w-full max-w-[180px]">
      <rect x="74" y="18" width="72" height="108" rx="14" fill="#ffffff" stroke="#d7e0ff" strokeWidth="2" />
      <rect x="82" y="30" width="56" height="74" rx="8" fill="#f7f8ff" />
      <circle cx="110" cy="55" r="18" fill="none" stroke="#d8dfff" strokeWidth="5" />
      <path d="M110 37 A18 18 0 1 1 94 64" stroke="url(#report-grad)" strokeWidth="5" strokeLinecap="round" />
      <text x="110" y="58" textAnchor="middle" fill="#6f61ff" fontSize="12" fontWeight="700">72</text>
      <rect x="92" y="79" width="36" height="5" rx="2.5" fill="#6f61ff" opacity="0.2" />
      <rect x="92" y="89" width="26" height="5" rx="2.5" fill="#ff8a28" opacity="0.92" />
      <rect x="92" y="99" width="31" height="5" rx="2.5" fill="#2f8eff" opacity="0.92" />
      <circle cx="110" cy="116" r="4" fill="#d9e2ff" />
      <path d="M57 44 L68 36 L70 52 Z" fill="#7f55ff" opacity="0.14" />
      <path d="M152 90 L170 86 L164 106 Z" fill="#ff8d2f" opacity="0.16" />
      <path d="M64 92 L78 86" stroke="#d7deff" strokeDasharray="3 4" />
      <path d="M142 54 L160 50" stroke="#d7deff" strokeDasharray="3 4" />
      <defs>
        <linearGradient id="report-grad" x1="92" y1="36" x2="128" y2="74" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8b46ff" />
          <stop offset="1" stopColor="#2f8eff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function FeatureIcon({ kind }: { kind: "first" | "info" | "cta" | "trust" | "nav" | "priority" }) {
  const icons = {
    first: (
      <svg viewBox="0 0 80 80" fill="none" className="h-18 w-18">
        <rect x="10" y="16" width="60" height="40" rx="7" fill="#fff" stroke="#bdd0ff" strokeWidth="2" />
        <rect x="10" y="16" width="60" height="12" rx="7" fill="#edf2ff" />
        <circle cx="18" cy="22" r="2" fill="#7b8dff" opacity="0.5" />
        <circle cx="24" cy="22" r="2" fill="#7b8dff" opacity="0.25" />
        <rect x="18" y="35" width="22" height="14" rx="3" fill="#ff8a28" />
        <path d="M23 45 L28 40 L33 44 L38 38" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="45" y="34" width="16" height="5" rx="2.5" fill="#6f61ff" />
        <rect x="45" y="43" width="12" height="4" rx="2" fill="#b7c8ff" />
        <path d="M48 58 H61" stroke="#6f61ff" strokeWidth="2" strokeLinecap="round" />
        <path d="M64 11 L66 6 L68 11 L73 13 L68 15 L66 20 L64 15 L59 13 Z" fill="#5d59ff" />
        <path d="M8 58 L10 53 L12 58 L17 60 L12 62 L10 67 L8 62 L3 60 Z" fill="#78a2ff" opacity="0.8" />
      </svg>
    ),
    info: (
      <svg viewBox="0 0 80 80" fill="none" className="h-18 w-18">
        <path d="M40 12 L52 20 V34 L40 42 L28 34 V20 Z" fill="#6c52ff" />
        <path d="M28 20 L40 26 L52 20" stroke="#4735b4" strokeWidth="1.5" />
        <path d="M40 26 V42" stroke="#4735b4" strokeWidth="1.5" />
        <path d="M15 40 L27 32 V46 L15 54 Z" fill="#fff" stroke="#6796ff" strokeWidth="2" />
        <path d="M53 32 L65 40 V54 L53 46 Z" fill="#fff" stroke="#6796ff" strokeWidth="2" />
        <path d="M28 49 L40 42 L52 49 V63 L40 70 L28 63 Z" fill="#fff" stroke="#6796ff" strokeWidth="2" />
        <line x1="21" y1="60" x2="21" y2="68" stroke="#6796ff" strokeWidth="1.8" />
        <line x1="40" y1="70" x2="40" y2="76" stroke="#6796ff" strokeWidth="1.8" />
        <line x1="59" y1="60" x2="59" y2="68" stroke="#6796ff" strokeWidth="1.8" />
        <circle cx="21" cy="70" r="2.6" fill="#ff8a28" />
        <circle cx="40" cy="78" r="2.6" fill="#ff8a28" />
        <circle cx="59" cy="70" r="2.6" fill="#ff8a28" />
      </svg>
    ),
    cta: (
      <svg viewBox="0 0 80 80" fill="none" className="h-18 w-18">
        <rect x="12" y="26" width="56" height="20" rx="10" fill="url(#cta-btn)" />
        <text x="40" y="39" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">ACTION</text>
        <path d="M39 50 V66" stroke="#4f76d7" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M34 58 V70 C34 72 36 73 37.5 71.4 L39 69.8 L40.5 71.4 C42 73 44 72 44 70 V61" stroke="#4f76d7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 16 L16 11 L18 16 L23 18 L18 20 L16 25 L14 20 L9 18 Z" fill="#6a61ff" />
        <path d="M61 12 L62.5 8 L64 12 L68 13.5 L64 15 L62.5 19 L61 15 L57 13.5 Z" fill="#6a61ff" opacity="0.7" />
        <defs>
          <linearGradient id="cta-btn" x1="12" y1="26" x2="68" y2="46" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8b46ff" />
            <stop offset="1" stopColor="#2f8eff" />
          </linearGradient>
        </defs>
      </svg>
    ),
    trust: (
      <svg viewBox="0 0 80 80" fill="none" className="h-18 w-18">
        <rect x="16" y="16" width="48" height="34" rx="6" fill="#fff" stroke="#bdd0ff" strokeWidth="2" />
        <rect x="22" y="24" width="20" height="4" rx="2" fill="#6f61ff" opacity="0.25" />
        <rect x="22" y="32" width="12" height="4" rx="2" fill="#c5d3ff" />
        <rect x="22" y="40" width="18" height="4" rx="2" fill="#c5d3ff" />
        <circle cx="56" cy="56" r="12" fill="url(#trust-badge)" />
        <path d="M50 56 L54 60 L62 51" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="56" y="72" textAnchor="middle" fill="#ff8a28" fontSize="8" fontWeight="700">Verified</text>
        <path d="M11 55 L13 50 L15 55 L20 57 L15 59 L13 64 L11 59 L6 57 Z" fill="#6693ff" opacity="0.8" />
        <defs>
          <linearGradient id="trust-badge" x1="44" y1="44" x2="68" y2="68" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8b46ff" />
            <stop offset="1" stopColor="#2f8eff" />
          </linearGradient>
        </defs>
      </svg>
    ),
    nav: (
      <svg viewBox="0 0 80 80" fill="none" className="h-18 w-18">
        <ellipse cx="40" cy="56" rx="24" ry="10" fill="#fff" stroke="#85a9ff" strokeWidth="2" />
        <ellipse cx="40" cy="56" rx="15" ry="6" fill="#f6f9ff" stroke="#bdd0ff" />
        <path d="M40 14 C48 14 54 20 54 28 C54 38 40 50 40 50 C40 50 26 38 26 28 C26 20 32 14 40 14 Z" fill="#fff" stroke="#6796ff" strokeWidth="2" />
        <circle cx="40" cy="28" r="5" fill="#7e46ff" />
        <circle cx="40" cy="56" r="3" fill="#ff8a28" />
        <path d="M40 50 V53" stroke="#6796ff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    priority: (
      <svg viewBox="0 0 80 80" fill="none" className="h-18 w-18">
        <path d="M40 10 L62 54 H18 Z" fill="#fff" stroke="#6f90ff" strokeWidth="2" />
        <path d="M40 10 L51 32 H29 Z" fill="#ff8a28" />
        <path d="M29 32 H51 L56 43 H24 Z" fill="#ffffff" stroke="#6f90ff" />
        <path d="M24 43 H56 L62 54 H18 Z" fill="#6f45ff" />
        <path d="M13 22 H20" stroke="#6f90ff" strokeWidth="2" strokeLinecap="round" />
        <path d="M60 18 H67" stroke="#6f90ff" strokeWidth="2" strokeLinecap="round" />
        <path d="M66 23 V30" stroke="#6f90ff" strokeWidth="2" strokeLinecap="round" />
        <path d="M40 10 V54" stroke="#6f90ff" strokeWidth="1.5" opacity="0.55" />
      </svg>
    ),
  };

  return icons[kind];
}

const steps = [
  {
    step: "STEP 01",
    title: "URLを入力",
    description: "診断したいサイトのURLを入力するだけ。難しい設定は一切不要です。",
    illustration: <StepIllustration step={1} />,
  },
  {
    step: "STEP 02",
    title: "AIが自動診断",
    description: "スクリーンショット取得・HTML解析・AI分析を自動実行。約10〜20秒で完了。",
    illustration: <StepIllustration step={2} />,
  },
  {
    step: "STEP 03",
    title: "スコアと提案を確認",
    description: "6つの観点でスコア化。最優先の改善点と具体的な対策を提案します。",
    illustration: <StepIllustration step={3} />,
  },
];

const features = [
  {
    title: "第一印象",
    description: "訪問者が最初に受ける\nビジュアル・訴求力の評価",
    kind: "first" as const,
  },
  {
    title: "情報設計",
    description: "コンテンツの構成・情報の\n伝わりやすさを分析",
    kind: "info" as const,
  },
  {
    title: "CTAの明確さ",
    description: "行動喚起ボタンの\n配置・文言・視認性を評価",
    kind: "cta" as const,
  },
  {
    title: "信頼性",
    description: "会社情報・実績・セキュリティ表示の\n充実度",
    kind: "trust" as const,
  },
  {
    title: "ナビゲーション",
    description: "メニュー構造・導線の\n使いやすさを診断",
    kind: "nav" as const,
  },
  {
    title: "改善優先度",
    description: "コンバージョンに\n最も影響する課題を特定",
    kind: "priority" as const,
  },
];

export default function Home() {
  return (
    <main className="bg-white text-[#2d2d2d]">
      <section className="relative overflow-hidden bg-white">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top, rgba(103,122,255,0.07), transparent 42%), radial-gradient(circle at bottom left, rgba(92,78,255,0.05), transparent 30%)",
          }}
        />
        <div className="absolute inset-0 opacity-95">
          <ParticlesWrapper />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-6xl flex-col items-center justify-center px-6 pb-28 pt-20 text-center">
          <p className="mb-6 text-[clamp(1.5rem,2.55vw,2.15rem)] font-black tracking-[-0.055em] text-[#2f2f2f]">
            あなたのサイトを <span className="text-[#5568ff]">AI</span> が{" "}
            <span className="text-[#ff7d1f]">3分</span> で診断します。
          </p>

          <HeroLogo />

          <p className="mb-2 text-[clamp(1rem,1.45vw,1.18rem)] font-bold tracking-[-0.025em] text-[#383838]">
            AIによるUI/UX自動診断エンジン。定性的なデザインを、定量的なスコアで可視化。
          </p>
          <p className="mb-11 text-[clamp(1rem,1.45vw,1.18rem)] font-bold tracking-[-0.025em] text-[#383838]">
            問題箇所の特定から実装レベルの改善提案まで、わずか3分で完了。
          </p>

          <GradientButton href="/diagnosis">無料診断を行う</GradientButton>
        </div>
      </section>

      <section className="bg-[#f2f1fb] px-5 py-22 md:px-8">
        <div className="mx-auto max-w-[1180px]">
          <h2 className="mb-12 text-center text-[clamp(2.35rem,3.4vw,3rem)] font-black tracking-[-0.05em] text-[#272727]">
            診断の流れ
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((item) => (
              <article
                key={item.step}
                className="rounded-[14px] border border-[#eceeff] bg-white px-8 py-7 text-center shadow-[0_8px_22px_rgba(91,108,176,0.08)]"
              >
                <div className="mx-auto mb-4 inline-flex rounded-full bg-[#f7f5ff] px-4 py-1 text-[0.86rem] font-black text-[#7266ff]">
                  {item.step}
                </div>
                <h3 className="text-[1.65rem] font-black tracking-[-0.05em] text-[#242424]">
                  {item.title}
                </h3>
                {item.illustration}
                <p className="text-[0.95rem] leading-7 text-[#5d5d5d]">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <GradientButton href="/diagnosis">無料診断を行う</GradientButton>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-22 md:px-8">
        <div className="mx-auto max-w-[1180px]">
          <h2 className="text-center text-[clamp(2.35rem,3.5vw,3.1rem)] font-black tracking-[-0.05em] text-[#252525]">
            診断でわかること
          </h2>
          <p className="mt-3 text-center text-[1rem] font-bold text-[#767676]">
            6つの観点でUI/UXを総合評価（100点満点）
          </p>
          <p className="mx-auto mt-8 max-w-4xl text-center text-[1rem] leading-8 text-[#555]">
            この診断は感性（視覚的な訴求力）による評価ではなく、
            <br className="hidden md:block" />
            配置、視認性、情報設計など、Webデザインの原則に基づいた論理的なUI/UX診断を行います。
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((item) => (
              <article
                key={item.title}
                className="rounded-[14px] border border-[#edf0ff] bg-white px-6 py-8 text-center shadow-[0_10px_22px_rgba(91,108,176,0.08)]"
              >
                <div className="mb-4 flex justify-center">
                  <FeatureIcon kind={item.kind} />
                </div>
                <h3 className="text-[1.65rem] font-black tracking-[-0.05em] text-[#242424]">
                  {item.title}
                </h3>
                <p className="mt-4 whitespace-pre-line text-[0.95rem] leading-7 text-[#5b5b5b]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-12 pt-8 md:px-8 md:pb-16">
        <div
          className="mx-auto max-w-[1180px] rounded-[14px] px-6 py-18 text-center shadow-[0_18px_44px_rgba(129,163,255,0.14)]"
          style={{
            background:
              "linear-gradient(90deg, rgba(183,229,255,0.9) 0%, rgba(202,226,255,0.82) 48%, rgba(252,221,245,0.88) 100%)",
          }}
        >
          <h2 className="text-[clamp(2.3rem,3.4vw,3rem)] font-black tracking-[-0.05em] text-[#252525]">
            今すぐ無料で診断する
          </h2>
          <p className="mt-4 text-[1rem] leading-7 text-[#4f4f4f]">
            URLを入力するだけ。診断結果は即座に表示されます。
          </p>
          <div className="mt-8">
            <GradientButton href="/diagnosis">無料診断を行う</GradientButton>
          </div>
        </div>
      </section>

      <footer className="bg-[#423a6e] px-6 py-5">
        <p className="text-center text-sm font-medium text-white/90">©2025 UI/UX AI診断</p>
      </footer>
    </main>
  );
}
