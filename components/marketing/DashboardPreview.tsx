import Image from "next/image";

export function DashboardPreview() {
    return (
        <section
            id="preview"
            className="relative py-24"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                {/* Heading */}

                <div className="mx-auto max-w-3xl text-center">

                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-sm text-blue-300">
                        Dashboard Preview
                    </span>

                    <h2 className="mt-6 text-4xl font-bold text-white">
                        Everything you need,
                        <br />
                        <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                            all in one place.
                        </span>
                    </h2>

                    <p className="mt-4 text-lg text-gray-400">
                        Track applications, monitor interviews,
                        manage reminders, and stay focused
                        with a clean and modern interface.
                    </p>

                </div>

                {/* Screenshot */}

                <div className="mt-16">

                    <div className="
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-white/5
            backdrop-blur-xl
            shadow-2xl
          ">

                        {/* Browser Bar */}

                        <div className="
              flex
              items-center
              gap-2
              border-b
              border-white/10
              bg-white/5
              px-6
              py-4
            ">

                            <div className="h-3 w-3 rounded-full bg-red-400" />
                            <div className="h-3 w-3 rounded-full bg-yellow-400" />
                            <div className="h-3 w-3 rounded-full bg-green-400" />

                            <div className="
                ml-5
                rounded-lg
                bg-black/20
                px-4
                py-1
                text-sm
                text-gray-500
              ">
                                app.careervault.dev/dashboard
                            </div>

                        </div>

                        {/* Screenshot */}

                        <div className="relative aspect-[16/9] bg-[#111827]">

                            <Image
                                src="/images/dashboard-preview.png"
                                alt="CareerVault Dashboard"
                                width={1600}
                                height={1000}
                                priority
                                className="w-full h-auto rounded-2xl"
                            />

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}