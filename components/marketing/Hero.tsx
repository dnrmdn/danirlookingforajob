import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[140px]" />
                <div className="absolute right-0 top-40 h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[120px]" />
            </div>

            <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 py-20 lg:flex-row lg:px-8 lg:py-28">

                {/* Left */}
                <div className="flex-1">

                    <div className="mb-5 inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
                        Organize your job search beautifully
                    </div>

                    <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-white lg:text-6xl">
                        Track Every
                        <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                            {" "}Application
                        </span>
                        .
                        <br />
                        Land Your Dream Job.
                    </h1>

                    <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
                        CareerVault helps you organize applications, interviews,
                        reminders, notes, and progress in one beautiful workspace.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">

                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02]"
                        >
                            Get Started
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                        <Link
                            href="https://github.com"
                            target="_blank"
                            className="rounded-xl border border-white/10 px-6 py-3 text-gray-300 transition hover:bg-white/5"
                        >
                            View on GitHub
                        </Link>

                    </div>

                    <div className="mt-10 grid gap-3 text-sm text-gray-400 sm:grid-cols-2">

                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            Kanban Workflow
                        </div>

                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            Smart Reminders
                        </div>

                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            Activity Timeline
                        </div>

                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            Analytics Dashboard
                        </div>

                    </div>
                </div>

                {/* Right */}
                <div className="flex-1">

                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">

                        {/* Browser Header */}
                        <div className="flex items-center gap-2 border-b border-white/5 bg-white/5 px-5 py-3">

                            <div className="h-3 w-3 rounded-full bg-red-400" />
                            <div className="h-3 w-3 rounded-full bg-yellow-400" />
                            <div className="h-3 w-3 rounded-full bg-green-400" />

                            <div className="ml-4 rounded bg-black/20 px-3 py-1 text-xs text-gray-500">
                                app.careervault.io
                            </div>

                        </div>

                        {/* Dashboard Preview */}
                        <div className="aspect-[16/10] bg-gradient-to-br from-[#111827] to-[#0B0F1A] p-6">

                            <div className="space-y-4">

                                <div className="h-5 w-40 rounded bg-white/10" />

                                <div className="grid grid-cols-3 gap-3">

                                    <div className="rounded-xl bg-white/5 p-3">
                                        <div className="mb-2 h-3 w-16 rounded bg-white/10" />
                                        <div className="h-8 w-10 rounded bg-violet-500/30" />
                                    </div>

                                    <div className="rounded-xl bg-white/5 p-3">
                                        <div className="mb-2 h-3 w-16 rounded bg-white/10" />
                                        <div className="h-8 w-10 rounded bg-blue-500/30" />
                                    </div>

                                    <div className="rounded-xl bg-white/5 p-3">
                                        <div className="mb-2 h-3 w-16 rounded bg-white/10" />
                                        <div className="h-8 w-10 rounded bg-emerald-500/30" />
                                    </div>

                                </div>

                                <div className="mt-6 grid grid-cols-3 gap-3">

                                    <div className="space-y-2 rounded-xl bg-white/5 p-3">
                                        <div className="h-3 w-20 rounded bg-white/10" />
                                        <div className="h-16 rounded-lg bg-violet-500/20" />
                                        <div className="h-16 rounded-lg bg-violet-500/10" />
                                    </div>

                                    <div className="space-y-2 rounded-xl bg-white/5 p-3">
                                        <div className="h-3 w-20 rounded bg-white/10" />
                                        <div className="h-16 rounded-lg bg-blue-500/20" />
                                    </div>

                                    <div className="space-y-2 rounded-xl bg-white/5 p-3">
                                        <div className="h-3 w-20 rounded bg-white/10" />
                                        <div className="h-16 rounded-lg bg-emerald-500/20" />
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}