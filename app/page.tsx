import Link from "next/link";

export default function Home() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-lg font-bold text-indigo-600">UI/UX AI診断</span>
          <Link
            href="/diagnosis"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            無料で診断する
          </Link>
        </div>
      </header>

      <section className="pt-28 pb-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span>✨</span>
            <span>URLを入力するだけ・完全無料</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            あなたのサイト、
            <br />
            <span className="text-indigo-600">AIが3分で診断</span>します
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            UI/UXの問題点をAIが自動で発見。スコアと具体的な改善提案を即座にお届けします。
          </p>
          <Link
            href="/diagnosis"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            無料で診断してみる →
          </Link>
          <p className="mt-4 text-sm text-gray-400">クレジットカード不要・登録不要</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">診断の流れ</h2>
          <p className="text-center text-gray-500 mb-12">たった3ステップで完了</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "URLを入力",
                desc: "診断したいサイトのURLを入力するだけ。難しい設定は一切不要です。",
                icon: "🌐",
              },
              {
                step: "02",
                title: "AIが自動診断",
                desc: "スクリーンショット取得・HTML解析・AI分析を自動実行。約10〜20秒で完了。",
                icon: "🤖",
              },
              {
                step: "03",
                title: "スコアと提案を確認",
                desc: "6つの観点でスコア化。最優先の改善点と具体的な対策を提案します。",
                icon: "📊",
              },
            ].map((item) => (
              <div key={item.step} className="text-center p-6">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-xs font-bold text-indigo-400 tracking-widest mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">診断でわかること</h2>
          <p className="text-center text-gray-500 mb-12">6つの観点でUI/UXを総合評価（100点満点）</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "第一印象", desc: "訪問者が最初に受けるビジュアル・訴求力の評価", max: "20点満点" },
              { title: "情報設計", desc: "コンテンツの構成・情報の伝わりやすさを分析", max: "20点満点" },
              { title: "CTAの明確さ", desc: "行動喚起ボタンの配置・文言・視認性を評価", max: "20点満点" },
              { title: "信頼性", desc: "会社情報・実績・セキュリティ表示の充実度", max: "15点満点" },
              { title: "ナビゲーション", desc: "メニュー構造・導線の使いやすさを診断", max: "15点満点" },
              { title: "改善優先度", desc: "コンバージョンに最も影響する課題を特定", max: "10点満点" },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-3 leading-relaxed">{item.desc}</p>
                <span className="text-xs font-medium text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                  {item.max}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-indigo-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">今すぐ無料で診断する</h2>
          <p className="text-indigo-200 mb-8 text-lg">URLを入力するだけ。診断結果は即座に表示されます。</p>
          <Link
            href="/diagnosis"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
          >
            無料診断をはじめる →
          </Link>
        </div>
      </section>

      <footer className="py-8 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-400 text-sm">
          © 2025 UI/UX AI診断
        </div>
      </footer>
    </>
  );
}
