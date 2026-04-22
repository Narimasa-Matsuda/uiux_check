import { BrandHeader } from "@/app/components/BrandHeader";
import { GradientLinkButton } from "@/app/components/GradientButton";

export default function ThanksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(180deg,#ffffff_0%,#f6f5ff_68%,#f2f1fb_100%)]">
      <BrandHeader maxWidthClassName="max-w-4xl" />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <p className="mx-auto mb-5 inline-flex rounded-full bg-[#f7f5ff] px-4 py-1">
            <span
              className="bg-clip-text text-[0.86rem] font-black text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #9a4dff 0%, #2f9bff 100%)" }}
            >
              REPORT SENT
            </span>
          </p>
          <h1 className="mb-4 text-3xl font-black tracking-[-0.05em] text-gray-900">
            メールを送信しました
          </h1>
          <p className="mb-8 leading-relaxed text-[#5f5f5f]">
            ご入力いただいたメールアドレスに、詳細レポートのURLをお送りしました。<br />
            メールに記載のリンクから詳細をご確認ください。
          </p>

          <div className="mb-8 rounded-[20px] border border-[#e8ecff] bg-white p-6 text-left shadow-[0_16px_38px_rgba(104,118,189,0.12)]">
            <h2 className="mb-4 font-bold text-gray-800">届かない場合は</h2>
            <ul className="space-y-3">
              {[
                { text: "迷惑メールフォルダをご確認ください" },
                { text: "数分経ってから再度メールをご確認ください" },
                { text: "届かない場合はもう一度フォームからお試しください" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span
                    className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: "linear-gradient(90deg, #8b46ff 0%, #2f9bff 100%)" }}
                  />
                  <span className="leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <GradientLinkButton href="/diagnosis">別のサイトを診断する</GradientLinkButton>
        </div>
      </main>

      <footer className="bg-[#423a6e] px-6 py-5">
        <p className="text-center text-sm font-medium text-white/90">© 2025 UI/UX AI診断</p>
      </footer>
    </div>
  );
}
