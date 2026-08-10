import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-white/10">

            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-10 text-sm text-gray-400 lg:flex-row lg:px-8">

                {/* Logo */}

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600">
                        <BriefcaseBusiness className="h-5 w-5 text-white" />
                    </div>

                    <div>
                        <p className="font-semibold text-white">
                            CareerVault
                        </p>

                        <p className="text-xs text-gray-500">
                            Track your career journey.
                        </p>
                    </div>

                </div>

                {/* Links */}

                <div className="flex gap-8">

                    <Link
                        href="#features"
                        className="hover:text-white"
                    >
                        Features
                    </Link>

                    <Link
                        href="#preview"
                        className="hover:text-white"
                    >
                        Preview
                    </Link>

                    <Link
                        href="https://github.com"
                        target="_blank"
                        className="hover:text-white"
                    >
                        GitHub
                    </Link>

                </div>

                {/* Copyright */}

                <p className="text-gray-500">
                    © {new Date().getFullYear()} CareerVault.
                    All rights reserved.
                </p>

            </div>

        </footer>
    );
}