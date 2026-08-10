import {
    KanbanSquare,
    BellRing,
    ChartColumnBig,
} from "lucide-react";

const features = [
    {
        icon: KanbanSquare,
        title: "Kanban Workflow",
        description:
            "Manage every application through each hiring stage with an intuitive drag-and-drop board.",
    },
    {
        icon: BellRing,
        title: "Smart Reminders",
        description:
            "Stay on top of interviews and follow-ups with timely reminders so nothing gets missed.",
    },
    {
        icon: ChartColumnBig,
        title: "Insightful Analytics",
        description:
            "Visualize your job search progress with clean dashboards and meaningful statistics.",
    },
];

export function Features() {
    return (
        <section
            id="features"
            className="relative py-24"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                {/* Heading */}

                <div className="mx-auto max-w-2xl text-center">

                    <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1 text-sm text-violet-300">
                        Features
                    </span>

                    <h2 className="mt-6 text-4xl font-bold text-white">
                        Everything you need to
                        <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                            {" "}stay organized
                        </span>
                    </h2>

                    <p className="mt-4 text-gray-400">
                        CareerVault helps you keep every application organized,
                        follow every opportunity, and understand your progress.
                    </p>

                </div>

                {/* Cards */}

                <div className="mt-16 grid gap-6 lg:grid-cols-3">

                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="
                  group
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/5
                  p-8
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-violet-500/30
                  hover:bg-white/10
                "
                            >

                                <div className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-violet-600
                  to-blue-600
                  shadow-lg
                  shadow-violet-500/20
                ">
                                    <Icon className="h-7 w-7 text-white" />
                                </div>

                                <h3 className="mt-6 text-xl font-semibold text-white">
                                    {feature.title}
                                </h3>

                                <p className="mt-3 leading-7 text-gray-400">
                                    {feature.description}
                                </p>

                            </div>
                        );
                    })}

                </div>

            </div>
        </section>
    );
}