import { LINKEDIN_URL, FACEBOOK_URL, WHATSAPP_URL, YOUTUBE_URL, TIKTOK_URL } from "../lib/constants.js";

// Single source of truth for the site's social icon set — consumed by the
// header top-bar, the footer, and this mobile icon row so every surface
// stays in sync.
export const SOCIALS = [
  {
    href: LINKEDIN_URL,
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: FACEBOOK_URL,
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    href: WHATSAPP_URL,
    label: "WhatsApp",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.868-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12.004 2C6.486 2 2.01 6.476 2.01 11.994c0 2.096.62 4.03 1.68 5.66L2 22l4.464-1.67a9.938 9.938 0 0 0 5.54 1.67h.004c5.518 0 9.994-4.476 9.994-9.995C21.998 6.487 17.523 2 12.004 2zm0 18.184h-.003a8.16 8.16 0 0 1-4.166-1.142l-.299-.178-3.101 1.16 1.176-2.997-.194-.31a8.155 8.155 0 0 1-1.264-4.365c0-4.518 3.678-8.194 8.19-8.194 2.187 0 4.243.852 5.789 2.4a8.129 8.129 0 0 1 2.396 5.79c-.002 4.518-3.68 8.196-8.19 8.196z"/>
      </svg>
    ),
  },
  {
    href: YOUTUBE_URL,
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
        <path d="M23.498 6.186a3.02 3.02 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.02 3.02 0 0 0 .502 6.186 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .502 5.814 3.02 3.02 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.02 3.02 0 0 0 2.122-2.136A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.502-5.814zM9.546 15.568V8.432L15.818 12l-6.272 3.568z"/>
      </svg>
    ),
  },
  {
    href: TIKTOK_URL,
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
        <path d="M16.6 5.82c-1.12-1.08-1.67-2.64-1.75-4.17h-3.9v13.94a3.03 3.03 0 0 1-5.44 1.83 3.03 3.03 0 0 1 3.5-4.7V8.85a6.98 6.98 0 0 0-5.71 11.9 6.98 6.98 0 0 0 11.85-5.02V9.4a9.1 9.1 0 0 0 5.85 2.13v-3.9c-1.54-.02-3.08-.5-4.4-1.72z"/>
      </svg>
    ),
  },
];

export default function SocialSidebar() {
  return (
    <aside className="social-sidebar" aria-label="Social media links">
      {SOCIALS.map(({ href, label, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="social-sidebar-btn"
          aria-label={label}
        >
          {icon}
        </a>
      ))}
    </aside>
  );
}

/* Mobile-only icon set — rendered inside Footer, hidden on desktop */
export function SocialIconsMobile() {
  return (
    <div className="social-footer-icons">
      {SOCIALS.map(({ href, label, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="social-footer-btn"
          aria-label={label}
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
