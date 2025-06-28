"use client";

import dynamic from "next/dynamic";

const Navbar = dynamic(() =>
    import("@/components/navbar").then(mod => mod.Navbar),
    { ssr: false }
);
const Footer = dynamic(() =>
    import("@/components/footer").then(mod => mod.Footer),
    { ssr: false }
);

export default function ClientShell({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
}
