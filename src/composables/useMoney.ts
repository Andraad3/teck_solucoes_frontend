const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function useMoney() {
  function formatBRL(value: number): string {
    return brl.format(value ?? 0)
  }

  /**
   * Converte a entrada do usuário (string em reais) para número.
   * Aceita vírgula ou ponto como separador decimal.
   */
  function parseAmount(input: string): number {
    const normalized = input.replace(/\s/g, '').replace(',', '.')
    const value = Number(normalized)
    return Number.isFinite(value) ? value : NaN
  }

  return { formatBRL, parseAmount }
}
