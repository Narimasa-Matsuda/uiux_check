import Link from "next/link";

export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      <header className="py-4 px-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-lg font-bold text-indigo-600">
            UI/UX AI診断
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <div className="text-7xl mb-6">📧</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            メールを送信しました
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            ご入力いただいたメールアドレスに、詳細レポートのURLをお送りしました。<br />
            メールに記載のリンクから詳細をご確認ください。
          </p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 text-left">
            <h2 className="font-semibold text-gray-800 mb-4">届かない場合は</h2>
            <ul className="space-y-3">
              {[
                { icon: "📁", text: "迷惑メールフォルダをご確認ください" },
                { icon: "⏱", text: "数分経ってから再度メールをご確認ください" },
                { icon: "🔄", text: "届かない場合はもう一度フォームからお試しください" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <span className="leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/diagnosis"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            ← 別のサイトを診断する
          </Link>
        </div>
      </main>

      <footer className="py-6 text-center text-gray-400 text-sm">
        © 2025 UI/UX AI診断
      </footer>
    </div>
  );
}
