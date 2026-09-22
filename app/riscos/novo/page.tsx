import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { NovoRiscoForm } from "@/components/modulos/novo-risco-form";
import { PLATAFORMA } from "@/lib/config";
import { requerCliente } from "@/lib/auth";

export const metadata = { title: "Novo risco" };

export default async function NovoRiscoPage() {
  await requerCliente();
  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <Link
            href="/riscos"
            className="inline-flex items-center gap-2 text-sm text-ink-faint hover:text-gold-700 mb-6"
          >
            <ArrowLeft className="w-3 h-3" /> {PLATAFORMA.labels.riscos}
          </Link>

          <h1 className="font-serif italic text-3xl gold-text-rich mb-8">Novo risco</h1>

          <NovoRiscoForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
