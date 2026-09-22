import type { Prioridade } from "./config";

/**
 * Calcula a prioridade de uma ocorrência a partir de severidade × frequência.
 * Matriz 4×4 → Baixa/Média/Alta/Crítica.
 */
export function calcularPrioridadeOcorrencia(
  severidade: string | null | undefined,
  frequencia: string | null | undefined,
): Prioridade | null {
  if (!severidade || !frequencia) return null;
  const sev = ["Baixa", "Média", "Alta", "Crítica"].indexOf(severidade);
  const freq = ["Isolada", "Ocasional", "Recorrente", "Constante"].indexOf(frequencia);
  if (sev < 0 || freq < 0) return null;
  const score = (sev + 1) * (freq + 1);
  if (score <= 3) return "Baixa";
  if (score <= 6) return "Média";
  if (score <= 10) return "Alta";
  return "Crítica";
}

/**
 * Calcula o nível de um risco a partir de probabilidade × impacto.
 * Matriz 5×5 → Aceitável/Tolerável/Elevado/Inaceitável.
 */
export function calcularNivelRisco(
  probabilidade: string | null | undefined,
  impacto: string | null | undefined,
): "Aceitável" | "Tolerável" | "Elevado" | "Inaceitável" | null {
  if (!probabilidade || !impacto) return null;
  const prob = ["Rara", "Improvável", "Possível", "Provável", "Quase certa"].indexOf(probabilidade);
  const imp = ["Insignificante", "Menor", "Moderado", "Maior", "Catastrófico"].indexOf(impacto);
  if (prob < 0 || imp < 0) return null;
  const score = (prob + 1) * (imp + 1);
  if (score <= 4) return "Aceitável";
  if (score <= 9) return "Tolerável";
  if (score <= 16) return "Elevado";
  return "Inaceitável";
}

/**
 * Cor associada a uma prioridade — para badges e realces.
 */
export function corPrioridade(p: string | null | undefined): string {
  switch (p) {
    case "Crítica":
    case "Inaceitável":
      return "bg-red-100 text-red-800 border-red-300";
    case "Alta":
    case "Elevado":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "Média":
    case "Tolerável":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "Baixa":
    case "Aceitável":
      return "bg-green-100 text-green-800 border-green-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
}
