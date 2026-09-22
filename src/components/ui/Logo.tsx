export function LogoMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="9.5" cy="16" r="2.8" fill="#2456F5" />
      <path d="M12 16c4 0 4-5.5 9-5.5M12 16c4 0 4 5.5 9 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="22.5" cy="10.5" r="1.9" fill="#0E9F8E" />
      <circle cx="22.5" cy="21.5" r="1.9" fill="#E59B12" />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-[20px] font-semibold tracking-tight">LifeLens</span>
    </span>
  )
}
