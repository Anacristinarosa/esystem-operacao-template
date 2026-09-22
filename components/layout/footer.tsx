import { PLATAFORMA } from "@/lib/config";

export function Footer() {
  return (
    <footer
      className="border-t py-8 mt-16"
      style={{ borderColor: "rgba(237, 217, 150, 0.4)" }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-faint">
        <p>
          © {new Date().getFullYear()} {PLATAFORMA.nome}. Construído no{" "}
          <a
            href="https://claude.com/claude-code"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-700 hover:text-gold-600"
          >
            Claude Code
          </a>{" "}
          via eFounder.
        </p>
        <p className="tracking-[0.2em] uppercase text-[10px]">
          {PLATAFORMA.founder.nome}
        </p>
      </div>
    </footer>
  );
}
