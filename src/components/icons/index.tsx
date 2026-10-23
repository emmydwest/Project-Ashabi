import type { SVGProps } from "react";

export type IconName =
  | "arrow"
  | "arrow-left"
  | "search"
  | "book"
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
  | "settings"
  | "upload"
  | "plus"
  | "eye"
  | "eye-off"
  | "chevron-down"
  | "more"
  | "filter"
  | "play"
  | "analytics"
  | "comment"
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
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    "arrow-left": <path d="M20 12H4m6-6-6 6 6 6" />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    book: (
      <>
        <path d="M12 5v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m16 8-2 6-6 2 2-6Z" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="15" y="3" width="6" height="6" rx="1" />
        <rect x="3" y="15" width="6" height="6" rx="1" />
        <rect x="15" y="15" width="6" height="6" rx="1" />
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
    bookmark: <path d="M6 4h12v17l-6-4-6 4Z" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6l4 2" />
      </>
    ),
    heart: (
      <path d="M20.8 5.8c-2.1-2.2-5.6-1.9-7.5.4L12 7.7l-1.3-1.5C8.8 3.9 5.3 3.6 3.2 5.8.8 8.3 1 12.1 3.5 14.5L12 22l8.5-7.5c2.5-2.4 2.7-6.2.3-8.7Z" />
    ),
    flame: (
      <path d="M13.5 2s.7 4-2.5 7.2c-2.3 2.3-3.7 4-2.2 6.5.7-2.2 2.1-3.2 3.2-4.3-.2 2.1 1 3 2.3 4.5 1.1 1.3.7 3.2-.4 4.1 3.7-.7 6.1-3.5 6.1-7.2 0-4.5-3.1-7.9-6.5-10.8ZM8 8.5C5.8 10.4 4 12.7 4 15.4c0 3.5 2.4 6 5.6 6.6-2.9-2.5-3.1-5.5-1.6-8.2" />
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    logout: (
      <>
        <path d="M10 4H5v16h5M14 8l4 4-4 4M9 12h9" />
      </>
    ),
    edit: (
      <>
        <path d="m4 16-1 5 5-1L19 9l-4-4Z" />
        <path d="m13.5 6.5 4 4" />
      </>
    ),
    home: (
      <>
        <path d="m3 10.5 9-7.5 9 7.5V20a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1v-9.5Z" />
      </>
    ),
    ranking: (
      <>
        <path d="M8 21V11M16 21V7M12 21V3M4 21h16" />
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
        <path d="M12 16V4m0 0-4 4m4-4 4 4" />
        <path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    eye: (
      <>
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    "eye-off": (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-6.4 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c6.4 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <path d="m2 2 20 20" />
      </>
    ),
    "chevron-down": <path d="m6 9 6 6 6-6" />,
    more: (
      <>
        <circle cx="5" cy="12" r="1.25" fill="currentColor" />
        <circle cx="12" cy="12" r="1.25" fill="currentColor" />
        <circle cx="19" cy="12" r="1.25" fill="currentColor" />
      </>
    ),
    filter: <path d="M4 6h16M7 12h10M10 18h4" />,
    play: <path d="m8 5 11 7-11 7V5Z" />,
    analytics: <path d="M4 19h16M7 15v-4M12 15V7M17 15v-6" />,
    comment: (
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-7a8 8 0 1 1 18-4Z" />
    ),
    flag: (
      <>
        <path d="M5 21V4m0 0h11l-2 4.5L16 13H5" />
      </>
    ),
    check: <path d="m5 12 4.5 4.5L19 7" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </>
    ),
    share: (
      <>
        <circle cx="18" cy="5" r="2.5" />
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="18" cy="19" r="2.5" />
        <path d="m8.3 10.8 7.4-4.6M8.3 13.2l7.4 4.6" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9" r="1.5" />
        <path d="m21 16-5.5-5.5L6 20" />
      </>
    ),
    drag: (
      <>
        <circle cx="9" cy="6" r="1" fill="currentColor" />
        <circle cx="15" cy="6" r="1" fill="currentColor" />
        <circle cx="9" cy="12" r="1" fill="currentColor" />
        <circle cx="15" cy="12" r="1" fill="currentColor" />
        <circle cx="9" cy="18" r="1" fill="currentColor" />
        <circle cx="15" cy="18" r="1" fill="currentColor" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4 6.5v5.5c0 5 3.4 8.3 8 9.5 4.6-1.2 8-4.5 8-9.5V6.5L12 3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
      </>
    ),
    star: (
      <>
        <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.1 6.5L12 17.4 6.2 20.5l1.1-6.5L2.5 9.4l6.6-.9L12 2.5Z" />
      </>
    ),
    external: (
      <>
        <path d="M14 4h6v6M20 4l-9 9" />
        <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
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
      strokeWidth="1.75"
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
