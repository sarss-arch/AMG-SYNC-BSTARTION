export function AmgSyncMark({ inverse = false, size = 34 }: { inverse?: boolean; size?: number }) {
  const ring = inverse ? "#FFFDF4" : "#3D5300";
  const dot = inverse ? "#FEE31A" : "#F0931A";
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <circle
        cx="48" cy="48" r="30" stroke={ring} strokeWidth="12" strokeLinecap="round"
        strokeDasharray="151 45" transform="rotate(-42 48 48)"
      />
      <circle cx="75" cy="29" r="9" fill={dot} />
    </svg>
  );
}

export function AmgSyncLogo({
  inverse = false,
  compact = false
}: {
  inverse?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="brand-lockup">
      <AmgSyncMark inverse={inverse} size={compact ? 32 : 38} />
      {!compact && (
        <div>
          <div className="brand-word">
            <span style={{ color: inverse ? "#FFFDF4" : "#1D2512" }}>AMG</span>{" "}
            <span style={{ color: inverse ? "#FEE31A" : "#F0931A" }}>SYNC</span>
          </div>
          <div className={`brand-tagline ${inverse ? "inverse" : ""}`}>Decision Intelligence Platform</div>
        </div>
      )}
    </div>
  );
}
