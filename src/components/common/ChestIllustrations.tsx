interface ChestArtworkProps {
  chestId: string;
  opened?: boolean;
  className?: string;
}

/**
 * Четыре уникальные векторные иллюстрации сундуков приключения (закрытый и открытый вид).
 */
export function ChestArtwork({ chestId, opened = false, className = 'w-20 h-20' }: ChestArtworkProps) {
  switch (chestId) {
    case 'chest_act_1':
      // Сундук истории — бирюзово-золотой со свитком и пером
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
          <rect width="120" height="120" rx="26" fill="#ECFEFF" />
          {/* Scroll behind/above when opened */}
          {opened && (
            <g>
              <rect x="34" y="14" width="52" height="36" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
              <line x1="42" y1="26" x2="78" y2="26" stroke="#06B8BE" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="42" y1="34" x2="72" y2="34" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="34" cy="20" r="4" fill="#F4C914" />
              <circle cx="86" cy="20" r="4" fill="#F4C914" />
            </g>
          )}
          {/* Chest body */}
          <rect x="20" y="54" width="80" height="46" rx="10" fill="#06B8BE" stroke="#047481" strokeWidth="3" />
          <rect x="20" y="38" width="80" height="22" rx="10" fill={opened ? '#0891B2' : '#0EA5E9'} stroke="#047481" strokeWidth="3" transform={opened ? 'translate(0,-6)' : undefined} />
          {/* Gold bands */}
          <rect x="34" y="36" width="8" height="64" rx="3" fill="#F4C914" />
          <rect x="78" y="36" width="8" height="64" rx="3" fill="#F4C914" />
          {/* Scroll seal emblem */}
          <circle cx="60" cy="60" r="10" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
          <path d="M56 60 H64 M60 56 V64" stroke="#04959A" strokeWidth="2.5" strokeLinecap="round" />
          {/* Feather quill */}
          <path d="M84 36 C96 22 104 20 104 20 C102 30 94 40 82 44 Z" fill="#F4C914" stroke="#B45309" strokeWidth="2" />
        </svg>
      );

    case 'chest_act_2':
      // Сундук искусства — яркий с палитрой, кистью и кристаллами
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
          <rect width="120" height="120" rx="26" fill="#F5F3FF" />
          {/* Glowing crystals */}
          <polygon points="26,44 34,18 42,44" fill="#06B8BE" stroke="#047481" strokeWidth="2" />
          <polygon points="78,44 88,16 96,44" fill="#A78BFA" stroke="#6D28D9" strokeWidth="2" />
          {opened && <polygon points="52,36 60,12 68,36" fill="#F4C914" stroke="#D97706" strokeWidth="2" />}
          {/* Chest body */}
          <rect x="22" y="54" width="76" height="46" rx="11" fill="#7C3AED" stroke="#4C1D95" strokeWidth="3" />
          <path d="M22 54 C22 40 98 40 98 54 Z" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="3" transform={opened ? 'translate(0,-6)' : undefined} />
          {/* Artist Palette emblem */}
          <ellipse cx="60" cy="76" rx="17" ry="12" fill="#FEF3C7" stroke="#F4C914" strokeWidth="2.5" />
          <circle cx="52" cy="73" r="2.8" fill="#06B8BE" />
          <circle cx="60" cy="71" r="2.8" fill="#EF4444" />
          <circle cx="68" cy="74" r="2.8" fill="#10B981" />
          {/* Brush */}
          <line x1="42" y1="92" x2="80" y2="56" stroke="#F4C914" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'chest_act_3':
      // Сундук кода — технологичный с микросхемами, шестерёнками и светящимся <>
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
          <rect width="120" height="120" rx="26" fill="#F1F5F9" />
          {/* Circuit pins */}
          <path d="M20 68 H10 M20 82 H12 M100 68 H110 M100 82 H108" stroke="#06B8BE" strokeWidth="3" strokeLinecap="round" />
          {opened && (
            <g>
              <circle cx="60" cy="24" r="14" fill="#06B8BE" fillOpacity="0.2" stroke="#06B8BE" strokeWidth="2" />
              <text x="60" y="29" textAnchor="middle" fill="#04959A" fontSize="13" fontWeight="900" fontFamily="monospace">
                &lt;/&gt;
              </text>
            </g>
          )}
          {/* Tech chest body */}
          <rect x="20" y="52" width="80" height="48" rx="8" fill="#26313B" stroke="#0F172A" strokeWidth="3" />
          <rect x="20" y="38" width="80" height="18" rx="6" fill="#334155" stroke="#0F172A" strokeWidth="3" transform={opened ? 'translate(0,-6)' : undefined} />
          {/* Neon circuit traces */}
          <path d="M28 66 H46 L52 74 H68 L74 66 H92" stroke="#06B8BE" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="60" cy="76" r="11" fill="#0F172A" stroke="#F4C914" strokeWidth="2.5" />
          <text x="60" y="80" textAnchor="middle" fill="#F4C914" fontSize="10" fontWeight="800" fontFamily="monospace">
            PY
          </text>
        </svg>
      );

    case 'chest_final':
    default:
      // Главный сундук — золотой сундук финального создателя с короной и сиянием
      return (
        <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
          <rect width="120" height="120" rx="26" fill="#FFFBEB" />
          {/* Victory rays */}
          <path d="M60 8 V18 M30 16 L36 24 M90 16 L84 24 M14 38 L24 42 M106 38 L96 42" stroke="#F4C914" strokeWidth="3" strokeLinecap="round" />
          {/* Crown */}
          <path d="M40 34 L46 20 L60 29 L74 20 L80 34 Z" fill="#F4C914" stroke="#B45309" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Gold grand chest */}
          <rect x="18" y="54" width="84" height="48" rx="12" fill="#F59E0B" stroke="#92400E" strokeWidth="3" />
          <rect x="18" y="38" width="84" height="20" rx="10" fill="#FBBF24" stroke="#92400E" strokeWidth="3" transform={opened ? 'translate(0,-5)' : undefined} />
          <rect x="30" y="38" width="10" height="64" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" />
          <rect x="80" y="38" width="10" height="64" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" />
          {/* Turquoise star gem lock */}
          <circle cx="60" cy="64" r="12" fill="#06B8BE" stroke="#FFFFFF" strokeWidth="3" />
          <path d="M60 56 L62.5 61.5 L68 62 L64 66 L65 71 L60 68 L55 71 L56 66 L52 62 L57.5 61.5 Z" fill="#FEF3C7" />
        </svg>
      );
  }
}

/**
 * Уникальная иллюстрация стикера-награды для каждого сундука.
 */
export function ChestStickerArtwork({ chestId, className = 'w-14 h-14' }: { chestId: string; className?: string }) {
  switch (chestId) {
    case 'chest_act_1':
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
          <circle cx="40" cy="40" r="36" fill="#ECFEFF" stroke="#06B8BE" strokeWidth="3" />
          <rect x="24" y="20" width="32" height="40" rx="5" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
          <path d="M31 32 H49 M31 40 H49 M31 48 H42" stroke="#04959A" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'chest_act_2':
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
          <circle cx="40" cy="40" r="36" fill="#F5F3FF" stroke="#7C3AED" strokeWidth="3" />
          <polygon points="40,14 54,36 40,64 26,36" fill="#06B8BE" stroke="#047481" strokeWidth="2.5" />
          <polygon points="40,14 54,36 40,36" fill="#67E8F9" />
        </svg>
      );
    case 'chest_act_3':
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
          <circle cx="40" cy="40" r="36" fill="#26313B" stroke="#06B8BE" strokeWidth="3" />
          <text x="40" y="46" textAnchor="middle" fill="#F4C914" fontSize="20" fontWeight="900" fontFamily="monospace">
            &lt;/&gt;
          </text>
        </svg>
      );
    case 'chest_final':
    default:
      return (
        <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden="true">
          <circle cx="40" cy="40" r="36" fill="#FFFBEB" stroke="#F4C914" strokeWidth="3.5" />
          <path d="M22 48 L27 26 L40 37 L53 26 L58 48 Z" fill="#F4C914" stroke="#B45309" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="22" y="50" width="36" height="8" rx="3" fill="#06B8BE" />
        </svg>
      );
  }
}
