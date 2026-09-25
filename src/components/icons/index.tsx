import type { SVGProps } from "react";
export function Icon({
  name,
  size = 20,
  ...props
}: SVGProps<SVGSVGElement> & {
    name: "arrow" | "search" | "book" | "compass" | "grid" | "close" | "user" | "bookmark" | "clock" | "heart" | "flame" | "bell" | "logout" | "edit";
  size?: number;
}) {
  const paths = {
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
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
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.7-4.2 3.3-6 8-6s7.3 1.8 8 6" /></>,
    bookmark: <path d="M6 4h12v17l-6-4-6 4Z" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v6l4 2" /></>,
    heart: <path d="M20.8 5.8c-2.1-2.2-5.6-1.9-7.5.4L12 7.7l-1.3-1.5C8.8 3.9 5.3 3.6 3.2 5.8.8 8.3 1 12.1 3.5 14.5L12 22l8.5-7.5c2.5-2.4 2.7-6.2.3-8.7Z" />,
    flame: <path d="M13.5 2s.7 4-2.5 7.2c-2.3 2.3-3.7 4-2.2 6.5.7-2.2 2.1-3.2 3.2-4.3-.2 2.1 1 3 2.3 4.5 1.1 1.3.7 3.2-.4 4.1 3.7-.7 6.1-3.5 6.1-7.2 0-4.5-3.1-7.9-6.5-10.8ZM8 8.5C5.8 10.4 4 12.7 4 15.4c0 3.5 2.4 6 5.6 6.6-2.9-2.5-3.1-5.5-1.6-8.2" />,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    logout: <><path d="M10 4H5v16h5M14 8l4 4-4 4M9 12h9" /></>,
    edit: <><path d="m4 16-1 5 5-1L19 9l-4-4Z" /><path d="m13.5 6.5 4 4" /></>,
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
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
