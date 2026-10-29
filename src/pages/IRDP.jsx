
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Brain,
  Code2,
  GitBranch,
  Globe,
  Database,
  Layers3,
  Sparkles,
  BriefcaseBusiness,
  CheckCircle2,
  Github,
  GraduationCap,
  Rocket,
  Target,
  Users,
  Trophy,
  BookOpen,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

const stages = [
  {
    number: "01",
    name: "THINK",
    years: "1st Year",
    title: "Master the logic before the code.",
    description:
      "Develop computational thinking through problem decomposition, algorithms, flowcharts and structured logic.",
    skills: ["Algorithms", "Flowcharts", "RAPTOR", "Problem decomposition"],
    output: "Logic and flowchart portfolio",
    icon: Brain,
    color: "#19C8FF",
  },
  {
    number: "02",
    name: "CODE",
    years: "1st–2nd Year",
    title: "Turn logic into working programs.",
    description:
      "Translate flowcharts into programs. Learn to compile, test, debug and understand how code works.",
    skills: ["C / Python / Java", "Variables and loops", "Functions", "Debugging"],
    output: "Programming portfolio",
    icon: Code2,
    color: "#087BFF",
  },
  {
    number: "03",
    name: "SOLVE",
    years: "2nd Year",
    title: "Build a problem-solving habit.",
    description:
      "Practice coding challenges, learn fundamental data structures and develop professional Git workflows.",
    skills: ["DSA fundamentals", "Coding practice", "Git", "GitHub"],
    output: "Coding profile and repositories",
    icon: GitBranch,
    color: "#9270FF",
  },
  {
    number: "04",
    name: "BUILD",
    years: "2nd–3rd Year",
    title: "Create interfaces people can use.",
    description:
      "Learn frontend development by building practical, responsive web applications.",
    skills: ["HTML and CSS", "JavaScript", "React", "Responsive design"],
    output: "Working frontend applications",
    icon: Globe,
    color: "#19C8FF",
  },
  {
    number: "05",
    name: "CONNECT",
    years: "3rd Year",
    title: "Connect applications to real data.",
    description:
      "Understand databases, backend systems, APIs and authentication to create connected applications.",
    skills: ["SQL", "Database design", "Backend development", "REST APIs"],
    output: "Database-backed applications",
    icon: Database,
    color: "#087BFF",
  },
  {
    number: "06",
    name: "FULL STACK",
    years: "3rd Year",
    title: "Build complete software products.",
    description:
      "Combine frontend, backend, databases, testing, deployment and documentation into complete projects.",
    skills: ["Frontend + backend", "Databases", "Testing", "Deployment"],
    output: "Full-stack projects",
    icon: Layers3,
    color: "#9270FF",
  },
  {
    number: "07",
    name: "INNOVATE",
    years: "3rd–4th Year",
    title: "Build useful AI-powered solutions.",
    description:
      "Explore responsible AI use, model and API integration, retrieval workflows and practical AI applications.",
    skills: ["AI / GenAI", "Prompt engineering", "API integration", "AI-assisted development"],
    output: "AI-enabled applications",
    icon: Sparkles,
    color: "#19C8FF",
  },
  {
    number: "08",
    name: "GET HIRED",
    years: "4th Year",
    title: "Demonstrate what you can do.",
    description:
      "Prepare for recruitment through DSA, aptitude, communication, resume improvement and technical interviews.",
    skills: ["DSA", "Aptitude", "Resume and portfolio", "Mock interviews"],
    output: "Industry-oriented portfolio and capstone",
    icon: BriefcaseBusiness,
    color: "#FFC66D",
  },
];

const initiatives = [
  {
    icon: GraduationCap,
    title: "Four-Year Learning Roadmap",
    description:
      "A structured progression from programming fundamentals to advanced application development.",
  },
  {
    icon: Github,
    title: "Developer Passport",
    description:
      "A proposed digital record of learning milestones, coding practice, repositories, projects and evaluations.",
  },
  {
    icon: Rocket,
    title: "Project-First Learning",
    description:
      "Turn concepts into practical applications, build portfolios and learn through iteration.",
  },
  {
    icon: Users,
    title: "Industry Demo Day",
    description:
      "A proposed annual showcase where students can demonstrate projects to industry professionals and mentors.",
  },
];

const projects = [
  "College Event Management Platform",
  "Student Skill Assessment Platform",
  "AI-Based Resume Analyzer",
  "College Helpdesk / Knowledge Assistant",
  "Placement Management System",
  "Laboratory Resource Management System",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function IRDP() {
  const [activeStage, setActiveStage] = useState(0);

  const selectedStage = stages[activeStage];
  const StageIcon = selectedStage.icon;

  return (
    <main className="min-h-screen overflow-hidden bg-[#080d1a] text-gray-100">
      {/* HERO */}
      <section className="relative px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#087bff]/15 blur-[120px]" />
          <div className="absolute -left-32 top-64 h-80 w-80 rounded-full bg-[#9270ff]/10 blur-[110px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.65 }}
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#19c8ff]/25 bg-[#19c8ff]/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#19c8ff]">
              <span className="h-2 w-2 rounded-full bg-[#19c8ff]" />
              AARAMBH Initiative
            </div>

            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-gray-400">
              Industry Ready Developer Program
            </p>

            <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              Don't just learn.
              <span className="mt-2 block bg-gradient-to-r from-[#19c8ff] via-[#087bff] to-[#9270ff] bg-clip-text text-transparent">
                Become a builder.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
              A proposed four-year developer journey connecting computational
              thinking, coding, real-world projects, AI and placement
              preparation through measurable skills and practical outcomes.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#roadmap"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#087bff] px-6 py-3.5 font-semibold text-white transition hover:bg-[#0066df]"
              >
                Explore the roadmap <ArrowRight size={18} />
              </a>
              <a
                href="#initiatives"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3.5 font-semibold text-gray-200 transition hover:border-[#19c8ff]/50 hover:bg-white/[0.06]"
              >
                Discover IRDP
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#19c8ff]" />
                Practical learning
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#19c8ff]" />
                Project-based growth
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#19c8ff]" />
                Evidence of skills
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div className="absolute inset-8 rounded-full bg-[#087bff]/20 blur-[90px]" />

            <div className="relative rounded-3xl border border-white/10 bg-[#0e1730]/85 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                    The developer journey
                  </p>
                  <p className="mt-1 font-semibold text-white">
                    From logic to launch
                  </p>
                </div>
                <div className="rounded-xl border border-[#19c8ff]/20 bg-[#19c8ff]/10 p-3 text-[#19c8ff]">
                  <Code2 size={24} />
                </div>
              </div>

              <div className="space-y-3 py-5">
                {[
                  ["01", "THINK", "Understand the problem", "#19C8FF"],
                  ["02", "CODE", "Write working programs", "#087BFF"],
                  ["03", "SOLVE", "Practice and improve", "#9270FF"],
                  ["04", "BUILD", "Create applications", "#19C8FF"],
                  ["05", "CONNECT", "Work with real data", "#087BFF"],
                  ["06", "FULL STACK", "Integrate the system", "#9270FF"],
                  ["07", "INNOVATE", "Build with AI", "#19C8FF"],
                  ["08", "GET HIRED", "Demonstrate your skills", "#FFC66D"],
                ].map(([number, name, description, color], index) => (
                  <motion.div
                    key={number}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 * index }}
                    className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3.5"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                      style={{
                        color,
                        backgroundColor: `${color}14`,
                        border: `1px solid ${color}35`,
                      }}
                    >
                      {number}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-100">
                        {name}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {description}
                      </p>
                    </div>
                    <ArrowRight size={15} className="shrink-0 text-gray-600" />
                  </motion.div>
                ))}
              </div>

              <div className="rounded-xl border border-[#087bff]/20 bg-[#087bff]/[0.07] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#19c8ff]">
                  Signature methodology
                </p>
                <p className="mt-2 text-sm font-medium leading-6 text-gray-200">
                  Flowchart → Code → Project → GitHub → Industry Demo
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative mx-auto mt-14 flex max-w-7xl justify-center">
          <a
            href="#roadmap"
            aria-label="Scroll to the roadmap"
            className="rounded-full border border-white/10 p-3 text-gray-400 transition hover:border-[#19c8ff]/50 hover:text-[#19c8ff]"
          >
            <ArrowDown size={19} />
          </a>
        </div>
      </section>

      {/* PROGRAM INTRO */}
      <section className="border-y border-white/[0.07] bg-[#0b1224] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#19c8ff]">
              The idea behind IRDP
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
              Skills that can be demonstrated, not just listed.
            </h2>
          </div>
          <p className="text-base leading-8 text-gray-400">
            IRDP is designed to connect learning across all four years of
            engineering. Each stage builds on the previous one, with practical
            outputs such as flowcharts, programs, coding profiles, GitHub
            repositories and working software. The goal is to make progress
            visible and help students understand what they can actually build.
          </p>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#19c8ff]">
              The four-year roadmap
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
              Eight stages. One continuous journey.
            </h2>
            <p className="mt-5 leading-7 text-gray-400">
              Explore each stage to discover its focus, core skills and
              expected outcomes. The year mapping is indicative and can be
              adapted to the institution's academic plan.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {stages.map((stage, index) => {
                const Icon = stage.icon;
                const isActive = activeStage === index;

                return (
                  <button
                    key={stage.number}
                    type="button"
                    onClick={() => setActiveStage(index)}
                    aria-pressed={isActive}
                    className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition duration-200 ${
                      isActive
                        ? "border-[#087bff]/60 bg-[#087bff]/[0.10] shadow-lg shadow-[#087bff]/[0.06]"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        color: stage.color,
                        backgroundColor: `${stage.color}16`,
                      }}
                    >
                      <Icon size={22} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-semibold tracking-[0.18em] text-gray-500">
                        STAGE {stage.number} · {stage.years}
                      </span>
                      <span className="mt-1 block font-bold text-gray-100">
                        {stage.name}
                      </span>
                    </span>
                    <ArrowRight
                      size={17}
                      className={`shrink-0 transition ${
                        isActive
                          ? "translate-x-0.5 text-[#19c8ff]"
                          : "text-gray-600 group-hover:text-gray-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <motion.div
              key={selectedStage.number}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-[#101b35] to-[#0b1224] p-6 sm:p-9 lg:min-h-[540px]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color: selectedStage.color }}
                  >
                    Stage {selectedStage.number} · {selectedStage.years}
                  </p>
                  <h3 className="mt-3 text-3xl font-bold sm:text-4xl">
                    {selectedStage.name}
                  </h3>
                </div>
                <div
                  className="rounded-2xl p-4"
                  style={{
                    color: selectedStage.color,
                    backgroundColor: `${selectedStage.color}16`,
                  }}
                >
                  <StageIcon size={30} />
                </div>
              </div>

              <h4 className="mt-8 text-xl font-semibold text-gray-100">
                {selectedStage.title}
              </h4>
              <p className="mt-4 leading-7 text-gray-400">
                {selectedStage.description}
              </p>

              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Core skills
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedStage.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-10">
                <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-5">
                  <div className="flex items-start gap-3">
                    <Target
                      size={21}
                      className="mt-0.5 shrink-0"
                      style={{ color: selectedStage.color }}
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                        Expected output
                      </p>
                      <p className="mt-2 font-semibold text-gray-100">
                        {selectedStage.output}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-500">
                    {activeStage + 1} of {stages.length} stages
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveStage((activeStage + 1) % stages.length)
                    }
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#19c8ff] hover:text-white"
                  >
                    Next stage <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SIGNATURE INITIATIVES */}
      <section
        id="initiatives"
        className="scroll-mt-24 border-y border-white/[0.07] bg-[#0b1224] px-5 py-20 sm:px-8 sm:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#19c8ff]">
              Beyond the curriculum
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
              A framework for continuous growth.
            </h2>
            <p className="mt-5 leading-7 text-gray-400">
              IRDP proposes initiatives that connect learning, project
              development, progress tracking and industry interaction.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {initiatives.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition hover:-translate-y-1 hover:border-[#087bff]/40"
                >
                  <div className="inline-flex rounded-xl border border-[#087bff]/20 bg-[#087bff]/10 p-3 text-[#19c8ff]">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-6 text-lg font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-400">
                    {item.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#19c8ff]">
              Learn by building
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
              From classroom concepts to real applications.
            </h2>
            <p className="mt-5 leading-8 text-gray-400">
              Projects are intended to reinforce the skills students learn at
              each stage. These are examples from the proposal, not completed
              or currently available IRDP projects.
            </p>

            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#19c8ff]/15 bg-[#19c8ff]/[0.04] p-5">
              <BookOpen className="mt-0.5 shrink-0 text-[#19c8ff]" size={22} />
              <p className="text-sm leading-7 text-gray-300">
                Each project should involve planning, implementation, testing,
                documentation and a demonstration—not just a code submission.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {projects.map((project, index) => (
              <div
                key={project}
                className="group flex min-h-28 items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition hover:border-[#087bff]/40 hover:bg-white/[0.045]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#087bff]/10 text-xs font-bold text-[#19c8ff]">
                  0{index + 1}
                </span>
                <p className="pt-1 text-sm font-semibold leading-6 text-gray-200">
                  {project}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#101a33] via-[#0e1730] to-[#11102a] p-7 sm:p-12">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#19c8ff]">
              The signature methodology
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Every concept should lead to something you can demonstrate.
            </h2>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {[
              "Problem",
              "Algorithm",
              "Flowchart",
              "Code",
              "Test",
              "GitHub",
              "Mini Project",
              "Presentation",
            ].map((step, index, array) => (
              <React.Fragment key={step}>
                <span className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-gray-200">
                  {step}
                </span>
                {index < array.length - 1 && (
                  <ArrowRight
                    size={16}
                    className="text-[#19c8ff]"
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <p className="mt-7 max-w-3xl text-sm leading-7 text-gray-400">
            The objective is a repeatable learning cycle: understand the
            problem, design a solution, implement it, test it, document it and
            explain what you built.
          </p>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="px-5 pb-24 sm:px-8 sm:pb-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[#087bff]/25 bg-[#0e1730] px-6 py-14 text-center sm:px-12 sm:py-20"
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#087bff]/20 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#9270ff]/15 blur-[90px]" />

          <div className="relative mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#19c8ff]/25 bg-[#19c8ff]/10 text-[#19c8ff]">
              <Trophy size={26} />
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#19c8ff]">
              The proposed IRDP journey
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
              Your degree is four years.
              <span className="mt-2 block text-gray-400">
                Make every year count.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-400">
              Think clearly. Code consistently. Build useful products.
              Demonstrate your skills. That is the journey IRDP aims to create.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#roadmap"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#087bff] px-6 py-3.5 font-semibold text-white transition hover:bg-[#0066df]"
              >
                Revisit the roadmap <ArrowRight size={18} />
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 font-semibold text-gray-200 transition hover:border-[#19c8ff]/50 hover:bg-white/[0.04]"
              >
                Contact AARAMBH
              </Link>
            </div>
            <p className="mt-5 text-xs leading-5 text-gray-500">
              IRDP is presented as a proposed initiative. Program launch,
              participation, mentoring and industry opportunities depend on
              institutional approval and implementation.
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
