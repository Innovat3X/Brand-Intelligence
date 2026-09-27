"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useProject } from "../../hooks/useProject";

export function Navbar() {
    const params = useParams<{ id?: string }>();
    const projectId = params?.id ?? null;

    const { project } = useProject(projectId);

    return (
        <header className="app-navbar">
            <div className="app-navbar-inner">
                <Link
                    href="/"
                    className="app-brand"
                    aria-label="Brand Intelligence home"
                >
                    <span className="brand-mark" aria-hidden="true">
                        <span className="brand-mark-shape" />
                        <span className="brand-mark-dot" />
                    </span>

                    <span className="app-brand-name">
                        Brand Intelligence
                    </span>
                </Link>

                <div className="app-navbar-project">
                    {project ? (
                        <>
                            <span className="app-navbar-project-label">
                                Project
                            </span>
                            <span className="app-navbar-project-name">
                                {project.name}
                            </span>
                        </>
                    ) : null}
                </div>

                <div className="app-navbar-actions">
                    <Link
                        href="/new"
                        className="navbar-button"
                    >
                        New project
                    </Link>
                </div>
            </div>
        </header>
    );
}