import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  variant?: 'primary' | 'secondary' | 'dark';
  className?: string;
  onCopied?: () => void;
}

export function CopyButton({
  text,
  label = 'Скопировать',
  copiedLabel = 'Скопировано!',
  variant = 'primary',
  className = '',
  onCopied,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        onCopied?.();
        setTimeout(() => setCopied(false), 2000);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06B8BE]';

  const variantStyles =
    copied
      ? 'bg-emerald-500 text-white shadow-sm'
      : variant === 'primary'
      ? 'bg-[#06B8BE] hover:bg-[#04959A] text-white shadow-sm'
      : variant === 'dark'
      ? 'bg-[#F4C914] hover:bg-[#E0B70D] text-[#26313B] shadow-sm'
      : 'bg-slate-100 hover:bg-slate-200 text-[#26313B] border border-slate-200';

  return (
    <button type="button" onClick={handleCopy} className={`${baseStyles} ${variantStyles} ${className}`}>
      {copied ? <Check className="w-4 h-4 shrink-0" /> : <Copy className="w-4 h-4 shrink-0" />}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
}
