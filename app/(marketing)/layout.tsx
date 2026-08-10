export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen bg-[#0B0F1A] text-white overflow-x-hidden">
            {children}
        </main>
    );
}