import ParticlesWrapper from "./components/ParticlesWrapper";
import { GradientLinkButton } from "./components/GradientButton";

function HeroLogo() {
  return (
    <div className="mx-auto mb-6 flex w-full max-w-[900px] flex-col items-center">
      <img src="/images/main.svg" alt="UI/UX AI診断" className="h-auto w-full max-w-[840px]" />
    </div>
  );
}

const steps = [
  {
    step: "STEP 01",
    title: "URLを入力",
    description: "診断したいサイトのURLを入力するだけ。難しい設定は一切不要です。",
    illustration: <div className="mx-auto my-4 flex h-[204px] w-full max-w-[404px] items-center justify-center rounded-2xl bg-white px-0 py-0"><img src="/images/step_1.svg" alt="STEP 01" className="max-h-full w-full scale-[1.24] object-contain" /></div>,
  },
  {
    step: "STEP 02",
    title: "AIが自動診断",
    description: "スクリーンショット取得・HTML解析・AI分析を自動実行。約10〜20秒で完了。",
    illustration: <div className="mx-auto my-4 flex h-[204px] w-full max-w-[404px] items-center justify-center rounded-2xl bg-white px-0 py-0"><img src="/images/step_2.svg" alt="STEP 02" className="max-h-full w-full scale-[1.24] object-contain" /></div>,
  },
  {
    step: "STEP 03",
    title: "スコアと提案を確認",
    description: "6つの観点でスコア化。最優先の改善点と具体的な対策を提案します。",
    illustration: <div className="mx-auto my-4 flex h-[204px] w-full max-w-[404px] items-center justify-center rounded-2xl bg-white px-0 py-0"><img src="/images/step_3.svg" alt="STEP 03" className="max-h-full w-full scale-[1.24] object-contain" /></div>,
  },
];

const features = [
  {
    title: "第一印象",
    description: "訪問者が最初に受ける\nビジュアル・訴求力の評価",
    icon: "/images/feature_1.svg",
  },
  {
    title: "情報設計",
    description: "コンテンツの構成・情報の\n伝わりやすさを分析",
    icon: "/images/feature_2.svg",
  },
  {
    title: "CTAの明確さ",
    description: "行動喚起ボタンの\n配置・文言・視認性を評価",
    icon: "/images/feature_3.svg",
  },
  {
    title: "信頼性",
    description: "会社情報・実績・セキュリティ表示の\n充実度",
    icon: "/images/feature_4.svg",
  },
  {
    title: "ナビゲーション",
    description: "メニュー構造・導線の\n使いやすさを診断",
    icon: "/images/feature_5.svg",
  },
  {
    title: "改善優先度",
    description: "コンバージョンに\n最も影響する課題を特定",
    icon: "/images/feature_6.svg",
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

        <div className="relative z-10 mx-auto flex min-h-[820px] max-w-6xl flex-col items-center justify-center px-6 pb-32 pt-24 text-center">
          <p className="mb-7 text-[clamp(1.45rem,2.2vw,1.9rem)] font-black tracking-[-0.055em] text-[#2f2f2f]">
            あなたのサイトを{" "}
            <span className="text-[1.28em] text-[#5568ff]">AI</span> が{" "}
            <span className="font-extrabold text-[#ff7d1f]">
              <span className="text-[1.28em]">3</span>分
            </span>{" "}
            で
            <span
              className="ml-1 inline-block bg-clip-text text-[1.22em] text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #8b46ff 0%, #2f9bff 100%)" }}
            >
              診断
            </span>
            します。
          </p>

          <HeroLogo />

          <p className="mb-2 text-[clamp(1.08rem,1.55vw,1.28rem)] font-bold tracking-[-0.025em] text-[#383838]">
            AIによるUI/UX自動診断エンジン。定性的なデザインを、定量的なスコアで可視化。
          </p>
          <p className="mb-12 text-[clamp(1.08rem,1.55vw,1.28rem)] font-bold tracking-[-0.025em] text-[#383838]">
            問題箇所の特定から実装レベルの改善提案まで、わずか3分で完了。
          </p>

          <GradientLinkButton href="/diagnosis">無料診断を行う</GradientLinkButton>
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
                <div className="mx-auto mb-4 inline-flex rounded-full bg-[#f7f5ff] px-4 py-1">
                  <span
                    className="bg-clip-text text-[0.86rem] font-black text-transparent"
                    style={{ backgroundImage: "linear-gradient(90deg, #9a4dff 0%, #2f9bff 100%)" }}
                  >
                    {item.step}
                  </span>
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
            <GradientLinkButton href="/diagnosis">無料診断を行う</GradientLinkButton>
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
                  <img src={item.icon} alt={item.title} className="w-full max-w-[357px] h-auto" />
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
            <GradientLinkButton href="/diagnosis">無料診断を行う</GradientLinkButton>
          </div>
        </div>
      </section>

      <footer className="bg-[#423a6e] px-6 py-5">
        <p className="text-center text-sm font-medium text-white/90">©2025 UI/UX AI診断</p>
      </footer>
    </main>
  );
}
