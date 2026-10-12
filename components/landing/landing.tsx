
"use client";

import { ArrowRight, Zap } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

type FlowKey = "review" | "request" | "renew";

const navigation = [
  { label: "Platform", href: "#platform" },
  { label: "Solutions", href: "#solutions" },
  { label: "Resources", href: "#resources" },
  { label: "Company", href: "#company" },
];
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const flowOrder: FlowKey[] = ["review", "request", "renew"];

const flowContent = {
  review: {
    label: "01 / Plan",
    title: "Turn scattered ideas into clear plans.",
    body: "Organize projects, define priorities, and give every team member a clear understanding of what needs to happen next.",
    items: [
      "Create projects with clear ownership",
      "Break goals into actionable tasks",
      "Track priorities and deadlines",
    ],
    prompt: "What should our team prioritize this week?",
    answer:
      "Review overdue tasks, unblock high-priority work, and align upcoming deadlines.",
  },
  request: {
    label: "02 / Collaborate",
    title: "Keep your entire team moving together.",
    body: "Bring tasks, assignments, comments, and project updates into one shared workspace so everyone stays aligned.",
    items: [
      "Assign tasks to the right teammates",
      "Share context through task comments",
      "Keep everyone updated with notifications",
    ],
    prompt: "What is blocking our current sprint?",
    answer:
      "Review blocked tasks, follow up with their owners, and coordinate the next steps.",
  },
  renew: {
    label: "03 / Deliver",
    title: "Turn progress into meaningful outcomes.",
    body: "Monitor project progress, identify unfinished work, and help your team deliver with greater clarity and accountability.",
    items: [
      "Track task completion across boards",
      "Monitor project progress",
      "Review activity and upcoming deadlines",
    ],
    prompt: "Which projects need attention?",
    answer:
      "Review project progress, overdue tasks, and assignments that need immediate attention.",
  },
} as const;

const capabilities = [
  {
    number: "01",
    title: "Projects and Kanban boards",
    text: "Organize work into projects, manage tasks across workflow stages, and keep priorities visible to everyone on your team.",
  },
  {
    number: "02",
    title: "Team collaboration and ownership",
    text: "Bring teammates, task assignments, comments, and workspace permissions together in one collaborative environment.",
  },
  {
    number: "03",
    title: "AI-powered productivity",
    text: "Make project information easier to understand, organize tasks, and explore AI-assisted workflows to improve everyday productivity.",
  },
];

const faqs = [
  {
    question: "What is Nexus?",
    answer:
      "Nexus is a team collaboration and project management platform designed to help teams organize work, manage projects, assign tasks, and track progress from a shared workspace.",
  },
  {
    question: "How does Nexus organize projects?",
    answer:
      "Nexus organizes workspaces, projects, boards, and tasks in a structured hierarchy. Teams can manage tasks across workflow columns, assign ownership, and monitor project progress.",
  },
  {
    question: "Can teams collaborate on tasks?",
    answer:
      "Nexus brings task assignments, comments, team members, project activity, and notifications together to help teams coordinate their work and stay informed about important updates.",
  },
  {
    question: "Does Nexus support AI-powered workflows?",
    answer:
      "Nexus is designed to bring AI-assisted productivity into project management. Available AI capabilities depend on the features implemented and configured in your application.",
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="icon-arrow">
      <path
        d="M2 8h11M9 3l5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MarkIcon() {
  return (
    <svg viewBox="0 0 34 34" aria-hidden="true" className="brand-mark">
      <path d="M4 5h11v11H4zM19 5h11v11H19zM4 19h11v11H4zM19 19h11v11H19z" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="spark-icon">
      <path
        d="M12 2l1.8 7.1L21 11l-7.2 1.9L12 20l-1.8-7.1L3 11l7.2-1.9L12 2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFlow, setActiveFlow] = useState<FlowKey>("review");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const router = useRouter();

  const activeContent = flowContent[activeFlow];
   const bgImg = "/cfbef7ee6088cac3e2e6c01cfe57bfed.png";

  const handleFlowKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    current: FlowKey,
  ) => {
    const index = flowOrder.indexOf(current);
    let nextIndex = index;

    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      nextIndex = (index + 1) % flowOrder.length;

    if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      nextIndex = (index - 1 + flowOrder.length) % flowOrder.length;

    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = flowOrder.length - 1;

    if (nextIndex !== index) {
      event.preventDefault();

      const nextFlow = flowOrder[nextIndex];

      setActiveFlow(nextFlow);
      document.getElementById(`flow-tab-${nextFlow}`)?.focus();
    }
  };

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="Nexus home">
            <MarkIcon />
            <span>NEXUS.</span>
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navigation.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <a className="login-link" href="#contact">
              Log in
            </a>

            <button
              className="button button-small"
              type="button"
              onClick={() => scrollToSection("contact")}
            >
              Get started <ArrowIcon />
            </button>

            <button
              className="menu-toggle"
              type="button"
              aria-label={
                menuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>

        <nav
          id="mobile-navigation"
          className={`mobile-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Mobile navigation"
        >
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              <ArrowIcon />
            </a>
          ))}

          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Log in
            <ArrowIcon />
          </a>
        </nav>
      </header>

      <main id="main-content">
         <section
      className="relative min-h-screen w-full overflow-hidden bg-cover bg-center px-5 pb-16 pt-32 sm:px-8 sm:pt-36 flex flex-col justify-center items-center"
      style={{ backgroundImage: `url('${bgImg}')` }}
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative mx-auto max-w-4xl text-center z-10"
      >
        

        {/* Updated Font Styling matching attached image */}
        <motion.h1
          variants={fadeUp}
          className="font-hero-serif text-5xl font-normal leading-[1.08] tracking-[-0.02em] text-[#111] sm:text-7xl lg:text-[82px]"
        >
          Organize <span className="text-[#6d5dfb]/50 font-light">work.</span>
          <br />
          Ship <span className="text-white italic font-normal">faster</span>,
          <span className="text-black/40 font-light">together.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base font-normal tracking-wide"
        >
          Nexus brings workspaces, boards, tasks and your whole team into one
          calm place — so nothing falls through the cracks.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <button
            onClick={() => router.push("/register")}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6d5dfb] px-8 py-3.5 text-sm font-medium text-white transition hover:scale-[1.02] hover:bg-black sm:w-auto shadow-md"
          >
            Get started free <ArrowRight size={15} />
          </button>
          <button
            onClick={() => router.push("/login")}
            className="w-full rounded-full border border-black/10 bg-white/80 backdrop-blur-md px-7 py-3.5 text-sm font-medium text-black/80 transition hover:bg-white sm:w-auto shadow-sm"
          >
            Log in
          </button>
        </motion.div>

        {/* <motion.p variants={fadeUp} className="mt-4 text-xs font-medium text-black/40">
          No credit card required · Free while in early access
        </motion.p> */}
      </motion.div>
    </section>

        <section
          className="trust-section"
          aria-label="Nexus platform capabilities"
        >
          <div className="content-width trust-inner">
            <p>
              Everything your team needs to work better together
            </p>

            <div
              className="logo-marquee"
              aria-label="Projects, tasks, collaboration, activity, and productivity"
            >
              <div className="logo-track">
                <span>PROJECTS</span>
                <span>TASKS</span>
                <span>COLLABORATION</span>
                <span>WORKFLOWS</span>
                <span>PRODUCTIVITY</span>
                <span>TEAMWORK</span>

                <span aria-hidden="true">PROJECTS</span>
                <span aria-hidden="true">TASKS</span>
                <span aria-hidden="true">COLLABORATION</span>
                <span aria-hidden="true">WORKFLOWS</span>
                <span aria-hidden="true">PRODUCTIVITY</span>
                <span aria-hidden="true">TEAMWORK</span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="platform"
          className="intelligence-section section-pad"
          aria-labelledby="intelligence-heading"
        >
          <div className="content-width intelligence-layout">
            <div className="section-intro">
              <p className="eyebrow">
                Clarity for every project
              </p>

              <h2 id="intelligence-heading">
                See the work. Understand the progress.
              </h2>

              <p>
                Bring project updates, task ownership, and team activity into
                one place so you can spend less time searching and more time
                getting work done.
              </p>

              <a href="#solutions" className="text-link">
                Explore project management <ArrowIcon />
              </a>
            </div>

            <div
              className="intelligence-workbench"
              aria-label="A visual example of project insights"
            >
              <div className="workbench-header">
                <span className="assistant-symbol">
                  <SparkIcon />
                </span>

                <span>Nexus AI</span>
                <span className="workbench-mode">Project assistant</span>
              </div>

              <div className="workbench-conversation">
                <div className="workbench-question">
                  What needs our team&apos;s attention right now?
                </div>

                <div className="workbench-answer">
                  <p>
                    Review the tasks and project activities that may need
                    attention.
                  </p>

                  <div className="answer-row">
                    <span>01</span>
                    <div>
                      <strong>Overdue tasks</strong>
                      <small>Review unfinished work</small>
                    </div>
                    <b>Review</b>
                  </div>

                  <div className="answer-row">
                    <span>02</span>
                    <div>
                      <strong>Task ownership</strong>
                      <small>Identify unassigned tasks</small>
                    </div>
                    <b>Review</b>
                  </div>

                  <div className="answer-row">
                    <span>03</span>
                    <div>
                      <strong>Project deadlines</strong>
                      <small>Check upcoming milestones</small>
                    </div>
                    <b>Review</b>
                  </div>
                </div>
              </div>

              <div className="workbench-input" aria-hidden="true">
                <span>Ask a question about your project</span>
                <i>
                  <ArrowIcon />
                </i>
              </div>
            </div>
          </div>
        </section>

        <section
          id="solutions"
          className="flow-section section-pad"
          aria-labelledby="flow-heading"
        >
          <div className="content-width">
            <div className="flow-heading">
              <p className="eyebrow eyebrow-light">
                One connected workflow
              </p>

              <h2 id="flow-heading">
                From the first idea to the final delivery.
              </h2>

              <p>
                Plan the work, collaborate with your team, and track progress
                at every stage.
              </p>
            </div>

            <div className="flow-layout">
              <div
                className="flow-tabs"
                role="tablist"
                aria-label="Project workflow stages"
                aria-orientation="vertical"
              >
                {flowOrder.map((flow) => (
                  <button
                    key={flow}
                    id={`flow-tab-${flow}`}
                    type="button"
                    role="tab"
                    aria-selected={activeFlow === flow}
                    aria-controls={`flow-panel-${flow}`}
                    tabIndex={activeFlow === flow ? 0 : -1}
                    className={activeFlow === flow ? "is-active" : ""}
                    onClick={() => setActiveFlow(flow)}
                    onKeyDown={(event) =>
                      handleFlowKeyDown(event, flow)
                    }
                  >
                    <span>{flowContent[flow].label}</span>

                    <b>
                      {flow === "review"
                        ? "Plan"
                        : flow === "request"
                          ? "Collaborate"
                          : "Deliver"}
                    </b>

                    <ArrowIcon />
                  </button>
                ))}
              </div>

              <div
                className="flow-panel"
                id={`flow-panel-${activeFlow}`}
                role="tabpanel"
                aria-labelledby={`flow-tab-${activeFlow}`}
              >
                <p className="eyebrow">
                  {activeContent.label}
                </p>

                <h3>{activeContent.title}</h3>

                <p>{activeContent.body}</p>

                <ul>
                  {activeContent.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="flow-ai-preview" aria-hidden="true">
                  <div>
                    <SparkIcon />
                    <span>{activeContent.prompt}</span>
                  </div>

                  <p>{activeContent.answer}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="capability-section section-pad"
          aria-labelledby="capability-heading"
        >
          <div className="content-width">
            <div className="capability-heading">
              <p className="eyebrow">
                Everything your team needs to move forward
              </p>

              <h2 id="capability-heading">
                Less scattered work. More meaningful progress.
              </h2>

              <p>
                Connect projects, people, and priorities in one organized
                workspace.
              </p>
            </div>

            <div className="capability-list">
              {capabilities.map((capability) => (
                <article
                  key={capability.number}
                  className="capability-row"
                >
                  <span className="capability-number">
                    {capability.number}
                  </span>

                  <h3>{capability.title}</h3>

                  <p>{capability.text}</p>

                  <a
                    href="#contact"
                    aria-label={`Learn more about ${capability.title}`}
                  >
                    <ArrowIcon />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="resources"
          className="proof-section"
          aria-labelledby="proof-heading"
        >
          <div className="content-width proof-layout">
            <div>
              <p className="eyebrow eyebrow-light">
                The Nexus advantage
              </p>

              <h2 id="proof-heading">
                Give great work a better way forward.
              </h2>

              <p>
                Create clarity around ownership, simplify collaboration, and
                help your team stay focused on the work that matters.
              </p>

              <a className="text-link text-link-light" href="#contact">
                Explore the Nexus platform <ArrowIcon />
              </a>
            </div>

            <div
              className="proof-figures"
              aria-label="Key areas of project management"
            >
              <div>
                <strong>01</strong>
                <span>Projects and boards</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Team collaboration</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Task management</span>
              </div>
            </div>
          </div>
        </section>

        <section
          className="faq-section section-pad"
          aria-labelledby="faq-heading"
        >
          <div className="content-width faq-layout">
            <div className="faq-intro">
              <p className="eyebrow">
                Questions, answered
              </p>

              <h2 id="faq-heading">
                Everything you need to know about Nexus.
              </h2>

              <p>
                Learn how Nexus brings your projects, tasks, and teammates
                together.
              </p>

              <a className="text-link" href="#contact">
                Get in touch <ArrowIcon />
              </a>
            </div>

            <div className="faq-list">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div className="faq-item" key={faq.question}>
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${index}`}
                        onClick={() =>
                          setOpenFaq(isOpen ? null : index)
                        }
                      >
                        <span>{faq.question}</span>

                        <span className="faq-symbol" aria-hidden="true">
                          {isOpen ? "-" : "+"}
                        </span>
                      </button>
                    </h3>

                    <div
                      id={`faq-panel-${index}`}
                      className={`faq-answer ${isOpen ? "is-open" : ""}`}
                      role="region"
                      aria-label={faq.question}
                    >
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="contact-section"
          aria-labelledby="contact-heading"
        >
          <div className="contact-grid" aria-hidden="true" />

          <div className="content-width contact-content">
            <p className="eyebrow eyebrow-light">
              Your team&apos;s next chapter starts here
            </p>

            <h2 id="contact-heading">
              Ready to bring your work together?
            </h2>

            <p>
              Create your workspace, bring your team on board, and turn
              scattered tasks into coordinated progress.
            </p>

            <button
              className="button button-accent"
              type="button"
              onClick={() => {
                window.location.assign("/register");
              }}
            >
              Get started <ArrowIcon />
            </button>
          </div>
        </section>
      </main>

      <footer id="company" className="site-footer">
        <div className="content-width footer-top">
          <a className="brand brand-dark" href="#top" aria-label="Nexus home">
            <MarkIcon />
            <span>NEXUS.</span>
          </a>

          <div className="footer-links">
            <a href="#platform">Platform</a>
            <a href="#solutions">Solutions</a>
            <a href="#resources">Resources</a>
            <a href="#contact">Contact</a>
          </div>

          <a className="footer-demo" href="#contact">
            Get started <ArrowIcon />
          </a>
        </div>

        <div className="content-width footer-bottom">
          <span>(c) 2026 Nexus. All rights reserved.</span>

          <div>
            <a href="#top">Privacy</a>
            <a href="#top">Terms</a>
            <a href="#top">Accessibility</a>
          </div>
        </div>
      </footer>
    </div>
  );
}