import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full py-8 px-6 md:px-12 glass-morphism mt-12 mb-6 md:mb-12 rounded-2xl max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                    © {new Date().getFullYear()} Ali Zidan. All rights reserved.
                </p>
                <div className="flex gap-8">
                    <Link href="#" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                        Instagram
                    </Link>
                    <Link href="#" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                        Twitter
                    </Link>
                    <Link href="mailto:info@alizidanjr.site" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                        Email
                    </Link>
                </div>
            </div>
        </footer>

    );
}
