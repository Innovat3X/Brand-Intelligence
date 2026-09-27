import Link from "next/link";
import { STAGES } from "../lib/brand";
import styles from "./page.module.css";

type StageId = (typeof STAGES)[number]["id"];

const stageDetails: Record<
    StageId,
    {
        description: string;
        accent: string;
    }
> = {
    discovery: {
        description: "Turn a rough idea into a clear problem, audience, context, and opportunity.",
        accent: "01",
    },
    positioning: {
        description: "Explore strategic directions and make the central positioning decision.",
        accent: "02",
    },
    shape: {
        description: "Translate strategy into personality, naming, voice, and brand character.",
        accent: "03",
    },
    visualize: {
        description: "Build a visual identity that reinforces the decisions made earlier.",
        accent: "04",
    },
    challenge: {
        description: "Stress-test the emerging brand for gaps, contradictions, and risks.",
        accent: "05",
    },
    deliver: {
        description: "Assemble the connected decisions into a launch-ready brand system.",
        accent: "06",
    },
};

function BrandMark() {
    return (
        <span className={styles.brandMark} aria-hidden="true">
            <span className={styles.brandMarkOuter} />
            <span className={styles.brandMarkInner} />
        </span>
    );
}

function ArrowIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className={styles.arrowIcon}
        >
            <path
                d="M4 10h11M11 5l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function SparkIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className={styles.sparkIcon}
        >
            <path
                d="M12 2.8l1.65 6.55L20.2 11l-6.55 1.65L12 19.2l-1.65-6.55L3.8 11l6.55-1.65L12 2.8Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <path
                d="M19 16.5l.7 2.3L22 19.5l-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function HomePage() {
    return (
        <main className={styles.page}>
            <div className={styles.backgroundGlowOne} />
            <div className={styles.backgroundGlowTwo} />

            <header className={styles.header}>
                <Link href="/" className={styles.logo}>
                    <BrandMark />
                    <span>Brand Intelligence</span>
                </Link>

                <nav className={styles.nav} aria-label="Main navigation">
                    <a href="#workflow">Workflow</a>
                    <a href="#how-it-works">How it works</a>
                </nav>

                <Link href="/new" className={styles.headerCta}>
                    Start a project
                    <ArrowIcon />
                </Link>
            </header>

            <section className={styles.hero}>
                <div className={styles.heroCopy}>
                    <div className={styles.eyebrow}>
                        <span className={styles.eyebrowDot} />
                        AI-assisted brand strategy
                    </div>

                    <h1>
                        From rough idea
                        <span>to brand system.</span>
                    </h1>

                    <p className={styles.heroDescription}>
                        Brand Intelligence turns an early product idea into a connected
                        brand identity through a guided sequence of strategic decisions.
                    </p>

                    <div className={styles.heroActions}>
                        <Link href="/new" className={styles.primaryButton}>
                            Start with your idea
                            <ArrowIcon />
                        </Link>

                        <a href="#workflow" className={styles.secondaryButton}>
                            Explore the workflow
                        </a>
                    </div>

                    <div className={styles.heroMeta}>
                        <div className={styles.metaItem}>
                            <strong>06</strong>
                            <span>connected stages</span>
                        </div>

                        <div className={styles.metaDivider} />

                        <div className={styles.metaItem}>
                            <strong>01</strong>
                            <span>persistent brand context</span>
                        </div>

                        <div className={styles.metaDivider} />

                        <div className={styles.metaItem}>
                            <strong>∞</strong>
                            <span>decisions can be refined</span>
                        </div>
                    </div>
                </div>

                <div
                    className={styles.heroVisual}
                    aria-label="Brand workflow preview"
                >
                    <div className={styles.visualShadowCard} />

                    <div className={styles.dashboardCard}>
                        <div className={styles.dashboardTop}>
                            <div>
                                <span className={styles.dashboardKicker}>
                                    BRAND WORKSPACE
                                </span>

                                <h2>Project direction</h2>
                            </div>

                            <span className={styles.statusPill}>
                                <span />
                                In progress
                            </span>
                        </div>

                        <div className={styles.progressTrack}>
                            <span />
                        </div>

                        <div className={styles.dashboardStage}>
                            <div className={styles.stageNumber}>02</div>

                            <div>
                                <span>Current stage</span>
                                <strong>Positioning</strong>
                            </div>

                            <div className={styles.dashboardArrow}>
                                <ArrowIcon />
                            </div>
                        </div>

                        <div className={styles.directionGrid}>
                            <div
                                className={`${styles.directionCard} ${styles.directionActive}`}
                            >
                                <span>Direction A</span>
                                <strong>Clear utility</strong>
                                <small>Practical · direct · confident</small>
                                <i>Selected</i>
                            </div>

                            <div className={styles.directionCard}>
                                <span>Direction B</span>
                                <strong>Human guidance</strong>
                                <small>Warm · helpful · accessible</small>
                            </div>

                            <div className={styles.directionCard}>
                                <span>Direction C</span>
                                <strong>Future signal</strong>
                                <small>Progressive · bold · technical</small>
                            </div>
                        </div>

                        <div className={styles.dashboardFooter}>
                            <span>Context preserved from Discover</span>
                            <span className={styles.contextCheck}>✓</span>
                        </div>
                    </div>

                    <div className={styles.floatingCardTop}>
                        <SparkIcon />

                        <div>
                            <span>AI synthesis</span>
                            <strong>Context connected</strong>
                        </div>
                    </div>

                    <div className={styles.floatingCardBottom}>
                        <span className={styles.miniLabel}>NEXT</span>
                        <strong>Shape the brand</strong>
                        <ArrowIcon />
                    </div>
                </div>
            </section>

            <section className={styles.trustRow} id="how-it-works">
                <div>
                    <span className={styles.trustEyebrow}>
                        Designed around decisions
                    </span>

                    <p>
                        Not one giant prompt. A sequence where every stage has a purpose
                        and later decisions inherit the context built earlier.
                    </p>
                </div>

                <div className={styles.trustBadge}>
                    <span>01</span>

                    <div>
                        <strong>Context first</strong>
                        <small>Strategy before aesthetics</small>
                    </div>
                </div>

                <div className={styles.trustBadge}>
                    <span>02</span>

                    <div>
                        <strong>Choices stay visible</strong>
                        <small>Human decisions remain explicit</small>
                    </div>
                </div>

                <div className={styles.trustBadge}>
                    <span>03</span>

                    <div>
                        <strong>Challenge before launch</strong>
                        <small>Weaknesses surface early</small>
                    </div>
                </div>
            </section>

            <section className={styles.workflowSection} id="workflow">
                <div className={styles.sectionHeading}>
                    <div>
                        <span className={styles.eyebrow}>The workflow</span>
                        <h2>Six connected stages.</h2>
                    </div>

                    <p>
                        The system preserves context as the brand develops, so later
                        decisions can build on earlier ones.
                    </p>
                </div>

                <div className={styles.stageGrid}>
                    {STAGES.map((stage) => {
                        const detail = stageDetails[stage.id];

                        return (
                            <article
                                key={stage.id}
                                className={styles.stageCard}
                            >
                                <div className={styles.stageCardTop}>
                                    <span className={styles.stageIndex}>
                                        {detail.accent}
                                    </span>

                                    <span className={styles.stageEyebrow}>
                                        {stage.eyebrow}
                                    </span>
                                </div>

                                <div className={styles.stageCardBody}>
                                    <h3>{stage.label}</h3>
                                    <p>{detail.description}</p>
                                </div>

                                <div className={styles.stageCardBottom}>
                                    <span>
                                        {stage.fields.slice(0, 2).join(" · ")}
                                    </span>

                                    <ArrowIcon />
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className={styles.featureSection}>
                <div className={styles.featureVisual}>
                    <div className={styles.featurePanel}>
                        <div className={styles.featurePanelHeader}>
                            <span>BRAND MEMORY</span>
                            <span className={styles.liveDot}>LIVE</span>
                        </div>

                        <div className={styles.memoryLine}>
                            <span>01</span>

                            <div>
                                <strong>Discovery</strong>
                                <small>Problem · Audience · Opportunity</small>
                            </div>

                            <b>✓</b>
                        </div>

                        <div className={styles.memoryLine}>
                            <span>02</span>

                            <div>
                                <strong>Positioning</strong>
                                <small>Direction selected</small>
                            </div>

                            <b>✓</b>
                        </div>

                        <div
                            className={`${styles.memoryLine} ${styles.memoryCurrent}`}
                        >
                            <span>03</span>

                            <div>
                                <strong>Shape</strong>
                                <small>Personality · Naming · Voice</small>
                            </div>

                            <i>Current</i>
                        </div>

                        <div className={styles.memoryLineMuted}>
                            <span>04</span>
                            <span>Visual identity comes next</span>
                        </div>
                    </div>
                </div>

                <div className={styles.featureCopy}>
                    <span className={styles.eyebrow}>The core idea</span>

                    <h2>Every decision leaves a trail.</h2>

                    <p>
                        Your brand is not generated from scratch at every screen. Brand
                        Intelligence carries structured context forward, making the
                        relationship between decisions visible.
                    </p>

                    <ul className={styles.featureList}>
                        <li>
                            <span>01</span>

                            <div>
                                <strong>Structured context</strong>
                                <p>
                                    Earlier findings become inputs for later stages.
                                </p>
                            </div>
                        </li>

                        <li>
                            <span>02</span>

                            <div>
                                <strong>Human checkpoints</strong>
                                <p>
                                    You choose strategic directions instead of accepting
                                    a black box.
                                </p>
                            </div>
                        </li>

                        <li>
                            <span>03</span>

                            <div>
                                <strong>Challenge before delivery</strong>
                                <p>
                                    The final system is checked for gaps before it becomes
                                    a kit.
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className={styles.ctaInner}>
                    <div>
                        <span className={styles.eyebrow}>Ready to begin?</span>

                        <h2>Bring the rough idea.</h2>

                        <p>
                            Start with what you know. The workflow will help structure
                            what comes next.
                        </p>
                    </div>

                    <Link href="/new" className={styles.ctaButton}>
                        Create a project
                        <ArrowIcon />
                    </Link>
                </div>
            </section>

            <footer className={styles.footer}>
                <Link href="/" className={styles.logo}>
                    <BrandMark />
                    <span>Brand Intelligence</span>
                </Link>

                <span>AI-assisted brand strategy workspace</span>
            </footer>
        </main>
    );
}