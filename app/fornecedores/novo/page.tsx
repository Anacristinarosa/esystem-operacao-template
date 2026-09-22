import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { NovoFornecedorForm } from "@/components/modulos/novo-fornecedor-form";
import { PLATAFORMA } from "@/lib/config";
import { requerCliente } from "@/lib/auth";

export const metadata = { title: "Novo fornecedor" };

export default async function NovoFornecedorPage() {
  await requerCliente();
  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <Link
            href="/fornecedores"
            className="inline-flex items-center gap-2 text-sm text-ink-faint hover:text-gold-700 mb-6"
          >
            <ArrowLeft className="w-3 h-3" /> {PLATAFORMA.labels.fornecedores}
          </Link>

          <h1 className="font-serif italic text-3xl gold-text-rich mb-8">Novo fornecedor</h1>

          <NovoFornecedorForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
