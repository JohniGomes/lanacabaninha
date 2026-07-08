import { ChecklistItem } from "@/lib/types";

const STATUS_STYLE: Record<ChecklistItem["status"], string> = {
  pendente: "bg-zinc-100 text-zinc-500",
  enviado: "bg-pink/40 text-pink-dark",
  retornado: "bg-mint/40 text-mint-dark",
};

const STATUS_LABEL: Record<ChecklistItem["status"], string> = {
  pendente: "Pendente",
  enviado: "Enviado",
  retornado: "Retornado",
};

export function ChecklistItemRow({
  item,
  onToggle,
}: {
  item: ChecklistItem;
  onToggle: (itemId: string) => void;
}) {
  return (
    <button
      onClick={() => onToggle(item.id)}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-left transition-transform active:scale-[0.98]"
    >
      <span className="text-sm">
        <span className="font-medium">{item.quantidade}x</span> {item.nome}
      </span>
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[item.status]}`}
      >
        {STATUS_LABEL[item.status]}
      </span>
    </button>
  );
}
