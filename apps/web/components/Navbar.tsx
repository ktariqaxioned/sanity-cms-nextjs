import Link from "next/link";
import type { Navbar as NavbarType } from "@/lib/sanity/sanity.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavbarProps = {
  data: NavbarType | null;
  className?: string;
};

/** Only routes that exist in the app: home (posts) and authors index */
const DEFAULT_MENU = [
  { label: "Home", href: "/" },
  { label: "Authors", href: "/authors" },
];

function isExternal(href: string) {
  return href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//");
}

function NavLink({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  const external = isExternal(href);
  const linkClass = "text-sm text-muted-foreground transition-colors hover:text-foreground";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {label}
      </a>
    );
  }
  return <Link href={href} className={linkClass}>{label}</Link>;
}

export function Navbar({ data, className }: NavbarProps) {
  const menu = data?.menu?.length ? data.menu : DEFAULT_MENU.map((item, i) => ({ ...item, _key: `default-${i}`, _type: "menuItem" as const }));
  const ctaButton = data?.ctaButton;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
        className
      )}
    >
      <nav className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-semibold text-foreground hover:opacity-80">
          Blog
        </Link>

        <div className="flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {menu.map((item) => {
              if (!item?.label || !item?.href) return null;
              return (
                <li key={item._key}>
                  <NavLink label={item.label} href={item.href} />
                </li>
              );
            })}
          </ul>

          {ctaButton?.label && ctaButton?.href ? (
            <Button asChild size="sm" variant="default">
              {isExternal(ctaButton.href) ? (
                <a href={ctaButton.href} target="_blank" rel="noopener noreferrer">
                  {ctaButton.label}
                </a>
              ) : (
                <Link href={ctaButton.href}>{ctaButton.label}</Link>
              )}
            </Button>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
