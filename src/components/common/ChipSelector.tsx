import { Check, Pencil } from 'lucide-react';
import { useState } from 'react';

interface ChipSelectorProps {
  label: string;
  options: string[];
  value: string;
  onChange: (nextValue: string) => void;
  mode?: 'single' | 'multi';
  placeholder?: string;
  helperText?: string;
}

/**
 * Интерактивный выбор параметров с помощью быстрых чипсов + кнопка [Свой вариант].
 * Поддерживает одиночный выбор и множественный выбор (через запятую).
 */
export function ChipSelector({
  label,
  options,
  value,
  onChange,
  mode = 'single',
  placeholder = 'Напиши свой вариант...',
  helperText,
}: ChipSelectorProps) {
  const [customOpen, setCustomOpen] = useState(false);

  const selectedItems =
    mode === 'multi'
      ? value
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : value.trim()
      ? [value.trim()]
      : [];

  const hasCustomValue =
    mode === 'single'
      ? Boolean(value.trim()) && !options.includes(value.trim())
      : selectedItems.some((item) => !options.includes(item));

  const isCustomVisible = customOpen || hasCustomValue;

  const handleToggleOption = (opt: string) => {
    if (mode === 'single') {
      onChange(opt);
      setCustomOpen(false);
      return;
    }

    const exists = selectedItems.includes(opt);
    const nextList = exists
      ? selectedItems.filter((item) => item !== opt)
      : [...selectedItems, opt];
    onChange(nextList.join(', '));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-bold text-[#26313B]">{label}</label>
        {helperText && <span className="text-[11px] text-slate-500">{helperText}</span>}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selectedItems.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleToggleOption(opt)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#06B8BE] text-white border-[#06B8BE] shadow-xs'
                  : 'bg-slate-50 text-[#26313B] border-slate-200 hover:border-[#06B8BE] hover:bg-cyan-50/50'
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
              <span>{opt}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setCustomOpen((prev) => !prev)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            isCustomVisible
              ? 'bg-amber-50 text-amber-800 border-[#F4C914]'
              : 'bg-white text-slate-600 border-dashed border-slate-300 hover:border-[#F4C914] hover:text-amber-800'
          }`}
        >
          <Pencil className="w-3 h-3 shrink-0" />
          <span>Свой вариант</span>
        </button>
      </div>

      {isCustomVisible && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#06B8BE]/60 bg-white text-sm text-[#26313B] placeholder:text-slate-400 focus:outline-none focus:border-[#06B8BE] focus:ring-2 focus:ring-[#06B8BE]/15"
        />
      )}
    </div>
  );
}
