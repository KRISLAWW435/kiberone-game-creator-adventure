/**
 * Светлая анимированная схема игровой мастерской на главной странице:
 * показывает путь от идеи и ИИ-графики к окну игры 1000×600 на Pygame.
 */
export function HeroLabIllustration() {
  return (
    <div className="relative rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-5 overflow-hidden shadow-sm">
      <svg
        viewBox="0 0 540 310"
        className="w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Схема создания игры в мастерской KIBERONE"
      >
        <defs>
          <pattern id="heroGridLight" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(38,49,59,0.05)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="540" height="310" rx="16" fill="#F4F8FB" />
        <rect width="540" height="310" rx="16" fill="url(#heroGridLight)" />

        {/* Animated connection pipelines */}
        <path
          d="M 122 86 C 175 86, 175 130, 210 130"
          stroke="#06B8BE"
          strokeWidth="3"
          className="animate-lab-flow"
        />
        <path
          d="M 122 222 C 175 222, 175 175, 210 175"
          stroke="#F4C914"
          strokeWidth="3"
          className="animate-lab-flow"
        />
        <path
          d="M 395 154 L 428 154"
          stroke="#10B981"
          strokeWidth="3"
          className="animate-lab-flow"
        />

        {/* Node 1: Story & AI */}
        <g>
          <rect x="20" y="42" width="104" height="86" rx="14" fill="#FFFFFF" stroke="#06B8BE" strokeWidth="2" />
          <text x="32" y="64" fill="#04959A" fontSize="10" fontWeight="800" fontFamily="sans-serif">
            1. ИДЕЯ + ИИ
          </text>
          <rect x="32" y="75" width="78" height="8" rx="4" fill="#E2E8F0" />
          <rect x="32" y="90" width="60" height="8" rx="4" fill="#E2E8F0" />
          <rect x="32" y="105" width="46" height="8" rx="4" fill="#06B8BE" fillOpacity="0.35" />
        </g>

        {/* Node 2: Art 16:9 */}
        <g>
          <rect x="20" y="178" width="104" height="86" rx="14" fill="#FFFFFF" stroke="#F4C914" strokeWidth="2" />
          <text x="32" y="200" fill="#B45309" fontSize="10" fontWeight="800" fontFamily="sans-serif">
            2. АРТ 16:9
          </text>
          <rect x="32" y="210" width="80" height="42" rx="8" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="1" />
          <circle cx="50" cy="226" r="6" fill="#F4C914" />
          <path d="M34 248 L56 230 L74 244 L90 227 L110 248 Z" fill="#06B8BE" fillOpacity="0.7" />
        </g>

        {/* Center Game Window Preview (Pygame 1000x600) */}
        <g>
          <rect x="206" y="42" width="190" height="224" rx="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <rect x="206" y="42" width="190" height="26" rx="14" fill="#26313B" />
          <circle cx="222" cy="55" r="3.5" fill="#F4C914" />
          <circle cx="234" cy="55" r="3.5" fill="#06B8BE" />
          <text x="250" y="59" fill="#FFFFFF" fontSize="9.5" fontWeight="700" fontFamily="monospace">
            main.py · Pygame
          </text>

          <rect x="218" y="78" width="166" height="106" rx="10" fill="#0F172A" />
          <circle cx="240" cy="94" r="1.8" fill="#F4C914" />
          <circle cx="352" cy="92" r="1.8" fill="#06B8BE" />
          <circle cx="315" cy="103" r="1.4" fill="#FFFFFF" />
          <circle cx="301" cy="116" r="11" fill="#06B8BE" />
          <path d="M284 152 C284 134, 318 134, 318 152 Z" fill="#06B8BE" fillOpacity="0.9" />
          <rect x="224" y="148" width="154" height="30" rx="6" fill="#26313B" fillOpacity="0.94" stroke="#06B8BE" strokeWidth="1" />
          <rect x="232" y="155" width="42" height="5" rx="2.5" fill="#F4C914" />
          <rect x="232" y="165" width="118" height="4" rx="2" fill="#E2E8F0" />

          <rect x="218" y="194" width="79" height="24" rx="7" fill="#06B8BE" />
          <text x="234" y="209" fill="#FFFFFF" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">
            Выбор А
          </text>
          <rect x="305" y="194" width="79" height="24" rx="7" fill="#F4C914" />
          <text x="321" y="209" fill="#26313B" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">
            Выбор Б
          </text>

          <text x="220" y="246" fill="#475569" fontSize="9.5" fontFamily="monospace">
            if choice == &quot;A&quot;: end_1()
          </text>
        </g>

        {/* Node 3: Launch & Win */}
        <g className="animate-lab-float">
          <rect x="428" y="102" width="92" height="106" rx="16" fill="#ECFDF5" stroke="#10B981" strokeWidth="2" />
          <circle cx="474" cy="136" r="16" fill="#10B981" />
          <polygon points="470,129 483,136 470,143" fill="#FFFFFF" />
          <text x="444" y="172" fill="#065F46" fontSize="10" fontWeight="800" fontFamily="sans-serif">
            ТВОЯ ИГРА
          </text>
          <text x="448" y="187" fill="#047857" fontSize="9" fontWeight="700" fontFamily="sans-serif">
            1000 × 600
          </text>
        </g>
      </svg>
    </div>
  );
}
