export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export function formatDateLong(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatCurrency(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Arredonda "HH:MM" pra hora cheia ou meia hora mais próxima (ex.: 18:17 -> 18:30).
export function arredondarHorario(valor: string): string {
  if (!valor) return valor;
  const [horaStr, minutoStr] = valor.split(":");
  let hora = Number(horaStr);
  const minuto = Number(minutoStr);
  if (Number.isNaN(hora) || Number.isNaN(minuto)) return valor;

  let novoMinuto: 0 | 30;
  if (minuto < 15) {
    novoMinuto = 0;
  } else if (minuto < 45) {
    novoMinuto = 30;
  } else {
    novoMinuto = 0;
    hora = (hora + 1) % 24;
  }

  return `${String(hora).padStart(2, "0")}:${String(novoMinuto).padStart(2, "0")}`;
}
