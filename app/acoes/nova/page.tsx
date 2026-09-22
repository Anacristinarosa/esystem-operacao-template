import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { NovaAcaoForm } from "@/components/modulos/nova-acao-form";
import { PLATAFORMA } from "@/lib/config";
import { requerCliente } from "@/lib/auth";

export const metadata = { title: "Nova ação" };

export default async function NovaAcaoPage() {
  await requerCliente();
  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <Link
            href="/acoes"
            className="inline-flex items-center gap-2 text-sm text-ink-faint hover:text-gold-700 mb-6"
          >
            <ArrowLeft className="w-3 h-3" /> {PLATAFORMA.labels.acoes}
          </Link>

          <h1 className="font-serif italic text-3xl gold-text-rich mb-8">Nova ação</h1>

          <NovaAcaoForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
