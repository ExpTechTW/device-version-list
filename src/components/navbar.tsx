import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { DeviceSearch } from "@/components/device-search";
import { Home, ArrowLeft } from "lucide-react";

interface NavbarProps {
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
  showSearch?: boolean;
}

export function Navbar({ showBack = false, backHref = "/", backLabel = "返回首頁", showSearch = true }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 gap-4">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 shrink-0">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">首頁</span>
            </Button>
          </Link>
          {showBack && backHref && (
            <Link href={backHref}>
              <Button variant="ghost" size="sm" className="gap-2 shrink-0">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{backLabel}</span>
              </Button>
            </Link>
          )}
          {showSearch && (
            <div className="flex-1 max-w-md ml-auto hidden md:block">
              <DeviceSearch />
            </div>
          )}
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}

