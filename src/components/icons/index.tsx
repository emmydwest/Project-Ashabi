import type { SVGProps } from "react";

export type IconName =
  | "arrow"
  | "arrow-left"
  | "arrow-up-right"
  | "search"
  | "book"
  | "library"
  | "novel"
  | "compass"
  | "grid"
  | "close"
  | "user"
  | "users"
  | "bookmark"
  | "clock"
  | "heart"
  | "flame"
  | "bell"
  | "logout"
  | "edit"
  | "home"
  | "ranking"
  | "trophy"
  | "settings"
  | "upload"
  | "plus"
  | "eye"
  | "eye-off"
  | "chevron-down"
  | "more"
  | "filter"
  | "play"
  | "trailer"
  | "analytics"
  | "comment"
  | "whatsapp"
  | "flag"
  | "check"
  | "calendar"
  | "globe"
  | "lock"
  | "share"
  | "image"
  | "drag"
  | "trash"
  | "shield"
  | "sparkles"
  | "star"
  | "external";

export type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
  title?: string;
};

export function Icon({
  name,
  size = 20,
  title,
  ...props
}: IconProps) {
  if (name === "whatsapp") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden={title ? undefined : "true"}
        role={title ? "img" : undefined}
        {...props}
      >
        {title ? <title>{title}</title> : null}
        <path d="M12.031 2.01c-5.518 0-9.998 4.48-9.998 9.998 0 1.763.46 3.485 1.334 5.003L2 22l5.122-1.343a9.957 9.957 0 0 0 4.905 1.292h.004c5.518 0 9.998-4.48 9.998-9.998a9.963 9.963 0 0 0-2.927-7.071A9.96 9.96 0 0 0 12.031 2.01Zm0 18.282h-.003a8.29 8.29 0 0 1-4.228-1.158l-.303-.18-3.039.797.811-2.963-.198-.314a8.285 8.285 0 0 1-1.274-4.426c0-4.588 3.733-8.32 8.324-8.32a8.27 8.27 0 0 1 5.884 2.439 8.273 8.273 0 0 1 2.436 5.885c0 4.59-3.733 8.32-8.41 8.24Zm4.565-6.23c-.25-.125-1.48-.73-1.709-.814-.23-.083-.396-.125-.563.125-.166.25-.646.813-.792.98-.146.166-.292.187-.542.062-.25-.125-1.055-.389-2.01-1.24-.743-.662-1.245-1.481-1.39-1.731-.146-.25-.016-.385.109-.51.113-.112.25-.291.375-.437.125-.146.167-.25.25-.417.084-.166.042-.312-.02-.437-.063-.125-.563-1.355-.772-1.855-.202-.487-.408-.42-.562-.428l-.48-.008c-.166 0-.437.062-.666.312-.23.25-.876.855-.876 2.085s.896 2.418 1.021 2.585c.125.166 1.764 2.694 4.274 3.777.597.258 1.063.412 1.427.527.599.19 1.145.164 1.576.1.481-.072 1.48-.605 1.688-1.189.209-.583.209-1.084.146-1.188-.062-.104-.229-.167-.479-.292Z" />
      </svg>
    );
  }

  const paths: Record<Exclude<IconName, "whatsapp">, React.ReactNode> = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    "arrow-left": <path d="M19 12H5m6-6-6 6 6 6" />,
    "arrow-up-right": <path d="M7 17 17 7M8 7h9v9" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.8-3.8" />
      </>
    ),
    book: (
      <>
        <path d="M12 6.2c-2.2-1.5-5.3-2-8.5-1.4a.6.6 0 0 0-.5.6v12.4c0 .4.3.7.7.6 3-.5 5.9 0 8.3 1.6 2.4-1.6 5.3-2.1 8.3-1.6.4.1.7-.2.7-.6V5.4a.6.6 0 0 0-.5-.6c-3.2-.6-6.3-.1-8.5 1.4Z" />
        <path d="M12 6.2V20" />
      </>
    ),
    library: (
      <>
        <rect x="3" y="4" width="4" height="16" rx="1" />
        <rect x="9" y="4" width="4" height="16" rx="1" />
        <path d="m15 4.5 3.8-1a1 1 0 0 1 1.2.7l2.5 13.6a1 1 0 0 1-.7 1.2l-3.8 1a1 1 0 0 1-1.2-.7L14.3 5.7a1 1 0 0 1 .7-1.2Z" />
      </>
    ),
    novel: (
      <>
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a2.5 2.5 0 0 1 0-5H20" />
        <path d="M8 7h6M8 11h8" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c.7-4.2 3.3-6 8-6s7.3 1.8 8 6" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c.6-3.5 2.8-5 6.5-5s5.9 1.5 6.5 5" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M15.5 15.2c2.8.2 4.5 1.5 5 4.8" />
      </>
    ),
    bookmark: <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
    heart: (
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    ),
    flame: (
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
    ),
    bell: (
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" x2="9" y1="12" y2="12" />
      </>
    ),
    edit: (
      <>
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </>
    ),
    home: (
      <>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
    ranking: (
      <>
        <path d="M6 20V10M12 20V4M18 20v-6" />
      </>
    ),
    trophy: (
      <>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.77 1.02 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
      </>
    ),
    upload: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" x2="12" y1="3" y2="15" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    eye: (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    "eye-off": (
      <>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
      </>
    ),
    "chevron-down": <path d="m6 9 6 6 6-6" />,
    more: (
      <>
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </>
    ),
    filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
    play: <polygon points="6 3 20 12 6 21 6 3" />,
    trailer: (
      <>
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M7 3v18M17 3v18M3 7.5h4M3 12h18M3 16.5h4M17 7.5h4M17 16.5h4" />
      </>
    ),
    analytics: <path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" />,
    comment: (
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    ),
    flag: (
      <>
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" x2="4" y1="22" y2="15" />
      </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    calendar: (
      <>
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </>
    ),
    lock: (
      <>
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
    share: (
      <>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
        <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
      </>
    ),
    image: (
      <>
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </>
    ),
    drag: (
      <>
        <circle cx="9" cy="5" r="1" />
        <circle cx="9" cy="12" r="1" />
        <circle cx="9" cy="19" r="1" />
        <circle cx="15" cy="5" r="1" />
        <circle cx="15" cy="12" r="1" />
        <circle cx="15" cy="19" r="1" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </>
    ),
    shield: (
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    ),
    sparkles: (
      <>
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </>
    ),
    star: (
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    ),
    external: (
      <>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" x2="21" y1="14" y2="3" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}
