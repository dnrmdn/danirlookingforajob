import { Navbar } from "@/components/marketing/Navbar";
import { Features } from "@/components/marketing/Features";
import { DashboardPreview } from "@/components/marketing/DashboardPreview";
import { Hero } from "@/components/marketing/Hero";
import { CTA } from "@/components/marketing/CTA";
import { Footer } from "@/components/marketing/Footer";

export default function LandingPage() {
    return (
        <>
            <Navbar />
            <Hero />
            <Features />
            <DashboardPreview />
            <CTA />
            <Footer />
        </>
    );
}