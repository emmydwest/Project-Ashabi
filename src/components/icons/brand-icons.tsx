import type { SVGProps } from "react";

type BrandIconProps = SVGProps<SVGSVGElement> & { size?: number };

export function GoogleIcon({ size = 20, ...props }: BrandIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="#4285F4"
        d="M22.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h6a5.1 5.1 0 0 1-2.2 3.3v2.7h3.6c2.1-2 3.2-4.7 3.2-7.9Z"
      />
      <path
        fill="#34A853"
        d="M12 23c3 0 5.5-1 7.4-2.9l-3.6-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.8A11.2 11.2 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.7 13.9a6.8 6.8 0 0 1 0-4V7.1H2a11.1 11.1 0 0 0 0 9.6l3.7-2.8Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.5c1.6 0 3.1.6 4.3 1.7l3.2-3.1A10.8 10.8 0 0 0 12 1 11.2 11.2 0 0 0 2 7.1l3.7 2.8c.9-2.6 3.4-4.4 6.3-4.4Z"
      />
    </svg>
  );
}

export function XIcon({ size = 19, ...props }: BrandIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.2l7.3-8.4L2.8 2h6.5l4.5 5.9L18.9 2Zm-1.1 17.9h1.7L8.3 4H6.5l11.3 15.9Z" />
    </svg>
  );
}

export function AppleIcon({ size = 21, ...props }: BrandIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M17.1 12.5c0-2.7 2.2-4 2.3-4.1a5 5 0 0 0-3.9-2.1c-1.7-.2-3.2 1-4 1s-2.1-1-3.5-1c-1.8 0-3.5 1.1-4.4 2.7-1.9 3.3-.5 8.1 1.4 10.7.9 1.3 2 2.8 3.5 2.7 1.4 0 1.9-.9 3.6-.9s2.2.9 3.6.9c1.5 0 2.5-1.3 3.4-2.7a11.8 11.8 0 0 0 1.5-3.1 4.7 4.7 0 0 1-3.5-4.1ZM14.4 4.6A4.8 4.8 0 0 0 15.5 1a4.9 4.9 0 0 0-3.3 1.7 4.5 4.5 0 0 0-1.1 3.4 4.1 4.1 0 0 0 3.3-1.5Z" />
    </svg>
  );
}
