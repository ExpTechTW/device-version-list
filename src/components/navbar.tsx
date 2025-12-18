import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { DeviceSearch } from "@/components/device-search";
import { ChevronLeft, Smartphone } from "lucide-react";

interface NavbarProps {
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
  showSearch?: boolean;
}

export function Navbar({ showBack = false, backHref = "/", backLabel = "返回", showSearch = true }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-border/30">
      <div className="container flex h-14 items-center px-4">
        {/* Left: Logo + Navigation */}
        <div className="flex items-center gap-1 shrink-0">
          <Link href="/" className="flex items-center gap-2 mr-1">
            <div className="p-1.5 rounded-lg bg-primary">
              <Smartphone className="h-4 w-4 text-primary-foreground" />
            </div>
          </Link>

          {showBack && backHref && (
            <Link href={backHref}>
              <Button variant="ghost" size="sm" className="h-8 px-2 gap-1 text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">{backLabel}</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Center spacer */}
        <div className="flex-1" />

        {/* Right: Search + Theme Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {showSearch && <DeviceSearch />}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
