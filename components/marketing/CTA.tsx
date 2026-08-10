import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
    return (
        <section className="relative py-24">

            {/* Background Glow */}
            <div className="absolute inset-0 -z-10">
                <div className="mx-auto h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />
            </div>

            <div className="mx-auto max-w-5xl px-6 lg:px-8">

                <div className="
          rounded-3xl
          border
          border-white/10
          bg-gradient-to-br
          from-white/5
          to-white/[0.03]
          p-12
          text-center
          backdrop-blur-xl
        ">

                    <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1 text-sm text-violet-300">
                        Get Started
                    </span>

                    <h2 className="mt-6 text-4xl font-bold text-white lg:text-5xl">
                        Ready to organize
                        <br />
                        your job search?
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
                        Keep every application, interview, reminder, and note
                        organized in one beautiful workspace.
                    </p>

                    <div className="mt-10 flex flex-wrap justify-center gap-4">

                        <Link
                            href="/register"
                            className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-violet-600
                to-blue-600
                px-7
                py-3
                font-medium
                text-white
                shadow-lg
                shadow-violet-500/20
                transition-all
                hover:scale-[1.02]
              "
                        >
                            Create Free Account
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                        <Link
                            href="/login"
                            className="
                rounded-xl
                border
                border-white/10
                px-7
                py-3
                text-gray-300
                transition
                hover:bg-white/5
              "
                        >
                            Sign In
                        </Link>

                    </div>

                </div>

            </div>
        </section>
    );
}
