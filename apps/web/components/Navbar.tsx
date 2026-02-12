import Link from "next/link";
import type { Navbar as NavbarType } from "@/lib/sanity/sanity.types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavbarProps = {
  data: NavbarType | null;
  className?: string;
};

function isExternal(href: string) {
  return href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//");
}

export function Navbar({ data, className }: NavbarProps) {
  if (!data) return null;

  const { menu, ctaButton } = data;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <nav className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-semibold text-foreground hover:opacity-80">
          Blog
        </Link>

        <div className="flex items-center gap-6">
          {menu?.length ? (
            <ul className="flex items-center gap-6">
              {menu.map((item) => {
                if (!item?.label || !item?.href) return null;
                const external = isExternal(item.href);
                return (
                  <li key={item._key}>
                    {external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : null}

          {ctaButton?.label && ctaButton?.href ? (
            <Button asChild size="sm" variant="default">
              {isExternal(ctaButton.href) ? (
                <a
                  href={ctaButton.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
