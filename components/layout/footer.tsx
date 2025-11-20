import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background/50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-linear-to-r from-blue-600 to-purple-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-foreground">AIStudio</span>
            <Badge variant="secondary" className="text-xs">
              © 2024
            </Badge>
          </div>
          
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}