"use client";

import type { ReactNode } from "react";
import { Navbar } from "../../../components/layout/Navbar";
import { Sidebar } from "../../../components/layout/Sidebar";
import { WorkflowStepper } from "../../../components/layout/WorkflowStepper";

interface ProjectLayoutProps {
    children: ReactNode;
}

export default function ProjectLayout({
    children,
}: ProjectLayoutProps) {
    return (
        <div className="app-shell">
            <Navbar />

            <div className="app-shell-body">
                <Sidebar />

                <main className="app-main">
                    <WorkflowStepper />

                    <div className="app-main-content">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}