import type { ReactNode } from "react";
import type { InstallGuideTab } from "@/lib/i18n/cara-install";

/**
 * Ilustrasi sederhana (SVG, tanpa teks) untuk tiap langkah panduan install.
 * Dipakai sebagai gambar bawaan sampai screenshot asli ditaruh di public/cara-install/.
 * Tanpa teks di dalam gambar, jadi sama untuk bahasa id/en/ar.
 */

const GREEN = "#0b6330";
const YELLOW = "#ffc800";
const DARK = "#002B14";
const HL = "#ef4444"; // warna sorotan "ketuk di sini"
const GRAY = "#94a3b8";

/* ---------- Potongan kecil yang dipakai ulang ---------- */

function Star({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <polygon
      transform={`translate(${x} ${y}) scale(${s})`}
      points="0,-8 1.88,-2.59 7.61,-2.47 3.04,0.99 4.7,6.47 0,3.2 -4.7,6.47 -3.04,0.99 -7.61,-2.47 -1.88,-2.59"
      fill={YELLOW}
      stroke={GREEN}
      strokeWidth={0.8}
    />
  );
}

function Tap({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={11} fill={HL} opacity={0.25} />
      <circle cx={x} cy={y} r={5} fill={HL} stroke="#fff" strokeWidth={1.5} />
    </g>
  );
}

function Ring({ x, y, w, h, r = 6 }: { x: number; y: number; w: number; h: number; r?: number }) {
  return (
    <rect x={x} y={y} width={w} height={h} rx={r} fill={HL} fillOpacity={0.08} stroke={HL} strokeWidth={2.5} />
  );
}

function Download({ x, y, color = GRAY }: { x: number; y: number; color?: string }) {
  return (
    <path
      d={`M${x} ${y} v7 M${x - 3} ${y + 4} l3 3 3 -3 M${x - 4} ${y + 10} h8`}
      fill="none"
      stroke={color}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/** Tampilan halaman website Rumah Amal (versi ringkas) */
function Site({ top, footerFrom, button }: { top: number; footerFrom: number; button?: boolean }) {
  return (
    <g>
      <rect x={30} y={top} width={140} height={footerFrom - top} fill="#fff" />
      <circle cx={44} cy={top + 11} r={6} fill={YELLOW} />
      <rect x={54} y={top + 8} width={34} height={6} rx={3} fill={GREEN} />
      <rect x={140} y={top + 8} width={22} height={6} rx={3} fill="#cbd5e1" />
      <rect x={30} y={top + 22} width={140} height={50} fill="#e8f3ec" />
      <rect x={40} y={top + 32} width={70} height={7} rx={3.5} fill={GREEN} />
      <rect x={40} y={top + 44} width={50} height={5} rx={2.5} fill={GRAY} />
      <rect x={40} y={top + 56} width={30} height={9} rx={4.5} fill={YELLOW} />
      <rect x={38} y={top + 82} width={60} height={34} rx={6} fill="#f1f5f9" />
      <rect x={104} y={top + 82} width={58} height={34} rx={6} fill="#f1f5f9" />
      {/* footer hijau */}
      <rect x={30} y={footerFrom} width={140} height={250 - footerFrom} fill={DARK} />
      <rect x={40} y={footerFrom + 10} width={60} height={5} rx={2.5} fill="#fff" opacity={0.6} />
      <rect x={40} y={footerFrom + 20} width={44} height={4} rx={2} fill="#fff" opacity={0.4} />
      {button && (
        <g>
          <rect x={40} y={footerFrom + 34} width={96} height={22} rx={11} fill="none" stroke={YELLOW} strokeWidth={1.5} />
          <Download x={58} y={footerFrom + 40} color={YELLOW} />
          <rect x={70} y={footerFrom + 43} width={52} height={4} rx={2} fill={YELLOW} />
        </g>
      )}
    </g>
  );
}

function Phone({
  ios,
  children,
  overlay,
  label,
}: {
  ios?: boolean;
  children: ReactNode;
  overlay?: ReactNode;
  label: string;
}) {
  const clipId = ios ? "ig-screen-ios" : "ig-screen-and";
  return (
    <svg
      viewBox="0 0 200 260"
      role="img"
      aria-label={label}
      className="mt-3 h-auto w-40 max-w-full drop-shadow-md"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={30} y={10} width={140} height={240} rx={ios ? 20 : 14} />
        </clipPath>
        <linearGradient id="ig-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9efe0" />
          <stop offset="1" stopColor="#bfdbfe" />
        </linearGradient>
      </defs>
      <rect x={24} y={4} width={152} height={252} rx={ios ? 28 : 22} fill="#fff" stroke="#cbd5e1" strokeWidth={3} />
      <g clipPath={`url(#${clipId})`}>{children}</g>
      {ios ? (
        <rect x={82} y={14} width={36} height={9} rx={4.5} fill="#0f172a" />
      ) : (
        <circle cx={100} cy={18} r={3} fill={GRAY} />
      )}
      {overlay}
    </svg>
  );
}

function Dim() {
  return <rect x={30} y={10} width={140} height={240} fill="#0f172a" opacity={0.28} />;
}

/* ---------- Android (Chrome) ---------- */

function ChromeBar({ ringMenu }: { ringMenu?: boolean }) {
  return (
    <g>
      <rect x={30} y={24} width={140} height={22} fill="#f8fafc" />
      <rect x={38} y={29} width={100} height={12} rx={6} fill="#fff" stroke="#e2e8f0" />
      <circle cx={46} cy={35} r={2} fill={GRAY} />
      <rect x={52} y={33} width={50} height={4} rx={2} fill="#cbd5e1" />
      {[31, 35, 39].map((cy) => (
        <circle key={cy} cx={154} cy={cy} r={1.7} fill="#475569" />
      ))}
      {ringMenu && <Ring x={144} y={25} w={20} h={20} r={10} />}
    </g>
  );
}

function AndroidMenu({ label }: { label: string }) {
  const rows = [0, 1, 2, 3, 4, 5];
  return (
    <Phone label={label}>
      <ChromeBar />
      <Site top={46} footerFrom={176} />
      <Dim />
      <rect x={82} y={46} width={88} height={122} rx={8} fill="#000" opacity={0.12} />
      <rect x={80} y={44} width={88} height={122} rx={8} fill="#fff" stroke="#e2e8f0" />
      {rows.map((i) => {
        const y = 50 + i * 18;
        const on = i === 3;
        return (
          <g key={i}>
            {on && <rect x={83} y={y} width={82} height={17} rx={4} fill="#fff1f2" stroke={HL} strokeWidth={1.5} />}
            {on ? (
              <Download x={93} y={y + 4} color="#475569" />
            ) : (
              <rect x={90} y={y + 5} width={7} height={7} rx={2} fill="#cbd5e1" />
            )}
            <rect x={104} y={y + 6} width={on ? 52 : 28 + ((i * 11) % 22)} height={4} rx={2} fill={on ? "#334155" : "#cbd5e1"} />
          </g>
        );
      })}
      <Tap x={146} y={112} />
    </Phone>
  );
}

function AndroidHome({ label }: { label: string }) {
  const colors = ["#fecaca", "#bfdbfe", "#fde68a", "#c7d2fe", "#fbcfe8", "#a7f3d0", "#fed7aa", "#ddd6fe"];
  const cells: ReactNode[] = [];
  let n = 0;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const x = 40 + c * 32;
      const y = 36 + r * 40;
      if (r === 2 && c === 1) continue; // tempat ikon Rumah Amal
      cells.push(<rect key={`${r}-${c}`} x={x} y={y} width={24} height={24} rx={7} fill={colors[n++ % colors.length]} />);
    }
  }
  return (
    <Phone label={label}>
      <rect x={30} y={10} width={140} height={240} fill="url(#ig-wall)" />
      {cells}
      <rect x={72} y={116} width={24} height={24} rx={7} fill="#fff" stroke="#e2e8f0" />
      <Star x={84} y={128} s={1.1} />
      <Ring x={66} y={110} w={36} h={36} r={10} />
      <rect x={38} y={206} width={124} height={34} rx={16} fill="#fff" opacity={0.55} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={48 + i * 29} y={212} width={22} height={22} rx={7} fill={colors[(i + 3) % colors.length]} />
      ))}
    </Phone>
  );
}

/* ---------- iPhone (Safari) ---------- */

function SafariBars({ ringShare }: { ringShare?: boolean }) {
  return (
    <g>
      <rect x={30} y={210} width={140} height={40} fill="#f8fafc" />
      <rect x={40} y={214} width={120} height={14} rx={7} fill="#fff" stroke="#e2e8f0" />
      <rect x={72} y={220} width={56} height={3.5} rx={1.75} fill="#cbd5e1" />
      <path d="M46 242 l-3 -3 3 -3 M73 236 l3 3 -3 3" fill="none" stroke={GRAY} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M97 241 v-5 M95 238 l2 -2 2 2 M94 240 v4 h6 v-4" fill="none" stroke="#2563eb" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={122} y={236} width={9} height={7} rx={1.5} fill="none" stroke={GRAY} strokeWidth={1.3} />
      <rect x={149} y={236} width={8} height={8} rx={1.5} fill="none" stroke={GRAY} strokeWidth={1.3} />
      {ringShare && <Ring x={85} y={229} w={24} h={20} r={8} />}
      {ringShare && <Tap x={105} y={247} />}
    </g>
  );
}

function IosSharePage({ label, ringShare, overlay }: { label: string; ringShare?: boolean; overlay?: ReactNode }) {
  return (
    <Phone ios label={label} overlay={overlay}>
      <Site top={30} footerFrom={150} />
      <SafariBars ringShare={ringShare} />
    </Phone>
  );
}

function Compass({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={18} fill="#fff" stroke="#cbd5e1" strokeWidth={2} />
      <circle r={14} fill="#2563eb" />
      <g transform="rotate(45)">
        <polygon points="0,-9 3,0 -3,0" fill={HL} />
        <polygon points="0,9 3,0 -3,0" fill="#fff" />
      </g>
    </g>
  );
}

function IosShareSheet({ label }: { label: string }) {
  return (
    <Phone ios label={label}>
      <Site top={30} footerFrom={150} />
      <SafariBars />
      <Dim />
      <rect x={30} y={92} width={140} height={160} rx={14} fill="#f2f2f7" />
      <rect x={40} y={102} width={22} height={22} rx={6} fill="#fff" stroke="#e2e8f0" />
      <Star x={51} y={113} s={0.9} />
      <rect x={68} y={106} width={54} height={6} rx={3} fill="#334155" />
      <rect x={68} y={116} width={38} height={4} rx={2} fill={GRAY} />
      <rect x={38} y={134} width={124} height={96} rx={10} fill="#fff" />
      {[0, 1, 2, 3].map((i) => {
        const y = 134 + i * 24;
        const on = i === 2;
        return (
          <g key={i}>
            {on && <rect x={38} y={y} width={124} height={24} rx={6} fill="#fff1f2" stroke={HL} strokeWidth={2} />}
            <rect x={48} y={y + 10} width={on ? 62 : 36 + ((i * 17) % 26)} height={4.5} rx={2.2} fill={on ? "#334155" : "#cbd5e1"} />
            {on ? (
              <path d="M147 196 v8 M143 200 h8" stroke="#334155" strokeWidth={1.5} strokeLinecap="round" fill="none" />
            ) : (
              <rect x={144} y={y + 8} width={8} height={8} rx={2} fill="#cbd5e1" />
            )}
            {i < 3 && !on && i !== 1 && <line x1={48} y1={y + 24} x2={152} y2={y + 24} stroke="#e2e8f0" />}
          </g>
        );
      })}
      <Tap x={118} y={194} />
    </Phone>
  );
}

function IosAddDialog({ label }: { label: string }) {
  return (
    <Phone ios label={label}>
      <Site top={30} footerFrom={150} />
      <Dim />
      <rect x={30} y={34} width={140} height={216} rx={14} fill="#f2f2f7" />
      <rect x={40} y={44} width={26} height={6} rx={3} fill={GRAY} />
      <rect x={82} y={44} width={36} height={6} rx={3} fill="#475569" />
      <rect x={144} y={44} width={16} height={6} rx={3} fill="#2563eb" />
      <Ring x={136} y={38} w={32} h={18} r={9} />
      <Tap x={152} y={47} />
      <rect x={38} y={68} width={124} height={64} rx={10} fill="#fff" />
      <rect x={46} y={78} width={28} height={28} rx={7} fill="#fff" stroke="#e2e8f0" />
      <Star x={60} y={92} s={1.3} />
      <rect x={82} y={84} width={60} height={7} rx={3.5} fill="#334155" />
      <line x1={82} y1={100} x2={154} y2={100} stroke="#e2e8f0" />
      <rect x={82} y={110} width={50} height={5} rx={2.5} fill={GRAY} />
      <rect x={38} y={146} width={90} height={5} rx={2.5} fill="#cbd5e1" />
      <rect x={38} y={157} width={70} height={5} rx={2.5} fill="#cbd5e1" />
    </Phone>
  );
}

/* ---------- Komputer (Chrome / Edge) ---------- */

function Desktop({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 260 170" role="img" aria-label={label} className="mt-3 h-auto w-72 max-w-full drop-shadow-md">
      <defs>
        <clipPath id="ig-win">
          <rect x={6} y={6} width={248} height={158} rx={8} />
        </clipPath>
      </defs>
      <rect x={6} y={6} width={248} height={158} rx={8} fill="#fff" stroke="#cbd5e1" strokeWidth={2} />
      <g clipPath="url(#ig-win)">
        <rect x={6} y={6} width={248} height={28} fill="#e2e8f0" />
        {[18, 28, 38].map((cx) => (
          <circle key={cx} cx={cx} cy={20} r={3.5} fill="#cbd5e1" />
        ))}
        <rect x={50} y={12} width={74} height={22} rx={6} fill="#fff" />
        <Star x={62} y={23} s={0.8} />
        <rect x={72} y={21} width={40} height={4} rx={2} fill="#cbd5e1" />
        <rect x={6} y={34} width={248} height={24} fill="#fff" />
        <line x1={6} y1={58} x2={254} y2={58} stroke="#e2e8f0" />
        <path d="M20 46 l-3 -3 3 -3 M32 40 l3 3 -3 3" fill="none" stroke={GRAY} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
        <rect x={44} y={39} width={168} height={14} rx={7} fill="#f1f5f9" />
        <circle cx={53} cy={46} r={2.2} fill={GRAY} />
        <rect x={60} y={44} width={64} height={4} rx={2} fill="#cbd5e1" />
        {[41, 46, 51].map((cy) => (
          <circle key={cy} cx={238} cy={cy} r={1.7} fill="#475569" />
        ))}
        {/* halaman */}
        <rect x={6} y={59} width={248} height={18} fill="#fff" />
        <circle cx={20} cy={68} r={5} fill={YELLOW} />
        <rect x={29} y={65} width={34} height={6} rx={3} fill={GREEN} />
        <rect x={180} y={65} width={60} height={6} rx={3} fill="#cbd5e1" />
        <rect x={6} y={77} width={248} height={44} fill="#e8f3ec" />
        <rect x={20} y={88} width={90} height={8} rx={4} fill={GREEN} />
        <rect x={20} y={101} width={64} height={5} rx={2.5} fill={GRAY} />
        <rect x={20} y={128} width={68} height={30} rx={6} fill="#f1f5f9" />
        <rect x={96} y={128} width={68} height={30} rx={6} fill="#f1f5f9" />
        <rect x={172} y={128} width={68} height={30} rx={6} fill="#f1f5f9" />
        {children}
      </g>
    </svg>
  );
}

function InstallIcon({ active }: { active?: boolean }) {
  return (
    <g>
      {active && <circle cx={198} cy={46} r={9} fill="#dbeafe" />}
      <rect x={193} y={41} width={10} height={8} rx={1.5} fill="none" stroke="#475569" strokeWidth={1.2} />
      <path d="M198 42.5 v4 M196 45 l2 2 2 -2" fill="none" stroke="#475569" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function ChromeLogo({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(1.25)`}>
      <circle r={14} fill="#fff" stroke="#cbd5e1" strokeWidth={1.5} />
      <path d="M0 0 L-10.39 -6 A12 12 0 0 1 10.39 -6 Z" fill="#ea4335" />
      <path d="M0 0 L10.39 -6 A12 12 0 0 1 0 12 Z" fill="#fbbc05" />
      <path d="M0 0 L0 12 A12 12 0 0 1 -10.39 -6 Z" fill="#34a853" />
      <circle r={5} fill="#4285f4" stroke="#fff" strokeWidth={2} />
    </g>
  );
}

function DesktopDialog({ label }: { label: string }) {
  return (
    <Desktop label={label}>
      <InstallIcon active />
      <rect x={130} y={60} width={120} height={84} rx={8} fill="#000" opacity={0.1} />
      <rect x={128} y={58} width={120} height={84} rx={8} fill="#fff" stroke="#cbd5e1" />
      <rect x={138} y={68} width={24} height={24} rx={6} fill="#fff" stroke="#e2e8f0" />
      <Star x={150} y={80} s={1.2} />
      <rect x={170} y={72} width={60} height={6} rx={3} fill="#334155" />
      <rect x={170} y={83} width={44} height={4} rx={2} fill={GRAY} />
      <rect x={138} y={112} width={44} height={18} rx={9} fill="none" stroke={GRAY} />
      <rect x={188} y={112} width={50} height={18} rx={9} fill="#1a73e8" />
      <rect x={202} y={119} width={22} height={4} rx={2} fill="#fff" />
      <Ring x={184} y={108} w={58} h={26} r={13} />
      <Tap x={234} y={128} />
    </Desktop>
  );
}

/* ---------- Pemilih ilustrasi per langkah ---------- */

export default function InstallGuideIllustration({
  tab,
  step,
  label,
}: {
  tab: InstallGuideTab;
  step: number;
  label: string;
}) {
  switch (`${tab}-${step}`) {
    case "android-1":
      return (
        <Phone label={label}>
          <ChromeBar />
          <Site top={46} footerFrom={170} button />
          <Ring x={34} y={198} w={108} h={34} r={17} />
          <Tap x={116} y={216} />
        </Phone>
      );
    case "android-2":
      return (
        <Phone label={label}>
          <ChromeBar ringMenu />
          <Site top={46} footerFrom={176} />
          <Tap x={161} y={43} />
        </Phone>
      );
    case "android-3":
      return <AndroidMenu label={label} />;
    case "android-4":
      return <AndroidHome label={label} />;

    case "ios-1":
      return (
        <Phone ios label={label}>
          <Site top={30} footerFrom={150} />
          <SafariBars />
          <g transform="translate(100 100) scale(1.35) translate(-100 -100)">
            <Compass x={100} y={100} />
          </g>
        </Phone>
      );
    case "ios-2":
      return <IosSharePage label={label} ringShare />;
    case "ios-3":
      return <IosShareSheet label={label} />;
    case "ios-4":
      return <IosAddDialog label={label} />;

    case "desktop-1":
      return (
        <Desktop label={label}>
          <ChromeLogo x={222} y={118} />
        </Desktop>
      );
    case "desktop-2":
      return (
        <Desktop label={label}>
          <InstallIcon />
          <Ring x={186} y={36} w={24} h={20} r={8} />
          <Tap x={205} y={54} />
        </Desktop>
      );
    case "desktop-3":
      return <DesktopDialog label={label} />;
    default:
      return null;
  }
}
