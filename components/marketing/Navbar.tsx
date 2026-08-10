'use client';

import Link from 'next/link';
import { BriefcaseBusiness } from 'lucide-react';

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0B0F1A]/70 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3 transition-opacity hover:opacity-90"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/20">
                        <BriefcaseBusiness className="h-5 w-5 text-white" />
                    </div>

                    <span className="text-xl font-bold tracking-tight text-white">
                        Career
                        <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                            Vault
                        </span>
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    <a
                        href="#features"
                        className="text-sm text-gray-400 transition-colors hover:text-white"
                    >
                        Features
                    </a>

                    <a
                        href="#preview"
                        className="text-sm text-gray-400 transition-colors hover:text-white"
                    >
                        Preview
                    </a>

                    <a
                        href="https://github.com"
                        target="_blank"
                        className="text-sm text-gray-400 transition-colors hover:text-white"
                    >
                        GitHub
                    </a>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="hidden rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition-all hover:border-white/20 hover:bg-white/5 sm:block"
                    >
                        Sign In
                    </Link>

                    <Link
                        href="/register"
                        className="rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02] hover:shadow-violet-500/40"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}