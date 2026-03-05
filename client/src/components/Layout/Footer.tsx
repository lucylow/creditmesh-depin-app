import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-semibold">CreditMesh DePIN</div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/faq" className="hover:text-foreground transition-colors">
              FAQ
            </Link>
            <a
              href="https://creditcoin.network"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Creditcoin
            </a>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          Built on Creditcoin · Decentralized Physical Infrastructure
        </p>
      </div>
    </footer>
  );
}
