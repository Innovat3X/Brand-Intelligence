import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "Brand Intelligence",
        template: "%s | Brand Intelligence",
    },
    description:
        "Transform a rough idea into a connected brand identity. Discover, position, shape, visualize, challenge, and deliver—with context preserved throughout.",
    applicationName: "Brand Intelligence",
};

export default function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}