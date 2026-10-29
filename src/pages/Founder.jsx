
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";

export default function Founder() {
  return (
    <main className="min-h-screen bg-[#080d1a] px-4 py-6 text-white sm:px-8 lg:px-10 lg:py-10">
      <section className="mx-auto grid max-w-[1600px] overflow-hidden border border-[#29334b] bg-[#0b1020] lg:min-h-[calc(100vh-80px)] lg:grid-cols-[0.82fr_1.18fr]">
        {/* FOUNDER PHOTO */}
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative min-h-[460px] overflow-hidden bg-[#080d1a] sm:min-h-[600px] lg:min-h-[780px]"
        >
          <img
            src="/founder-photo-crop.png"
            alt="Sandarsh Jeripothula, founder of AARAMBH Community"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a]/70 via-transparent to-[#080d1a]/10" />

          <div className="absolute bottom-4 left-4 right-4 border border-white/20 bg-[#080d1a]/90 px-4 py-4 backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-gray-300 sm:text-[10px]">
              The person behind the first step
            </p>
          </div>
        </motion.div>

        {/* FOUNDER DETAILS */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex flex-col justify-center bg-gradient-to-br from-[#0a0f1e] to-[#111329] px-6 py-10 sm:px-10 sm:py-14 lg:px-12 xl:px-16"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#78aaff] sm:text-xs">
            Founder &amp; Community Builder
          </p>

          <h1 className="mt-6 text-5xl font-semibold leading-[0.98] tracking-[-0.065em] sm:text-6xl xl:text-7xl">
            Sandarsh
            <span className="mt-1 block bg-gradient-to-r from-[#9ee1ff] via-[#9d91ff] to-[#ffd18c] bg-clip-text italic text-transparent">
              Jeripothula.
            </span>
          </h1>

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-[#19c8ff]">
            Founder, AARAMBH
          </p>

          <div className="mt-7 space-y-4 text-sm leading-7 text-[#b8c5df] sm:text-base sm:leading-[1.9]">
            <p>
              I started AARAMBH around an idea I care about: making it easier
              for curious people to take their first step toward
              entrepreneurship. Whether someone is exploring a problem,
              building a product, or looking for people to learn with,
              beginnings should not have to feel like a solo journey.
            </p>

            <p>
              AARAMBH is being shaped into a community where students,
              founders, mentors, innovators, and ecosystem partners can meet,
              exchange perspectives, and explore what they might build
              together.
            </p>
          </div>

          {/* CONTACT ROWS */}
          <div className="mt-8 border-t border-[#30394e]">
            <a
              href="mailto:aarambh.community.team@gmail.com"
              className="group grid grid-cols-[82px_1fr_16px] items-center gap-3 border-b border-[#30394e] py-4 transition hover:text-[#19c8ff] sm:grid-cols-[100px_1fr_20px]"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#8ca8d8]">
                Email
              </span>
              <span className="break-all text-xs font-medium sm:text-sm">
                aarambh.community.team@gmail.com
              </span>
              <ArrowUpRight
                size={15}
                className="text-gray-500 transition group-hover:text-[#19c8ff]"
              />
            </a>

            <a
              href="https://wa.me/916304939885"
              target="_blank"
              rel="noreferrer"
              className="group grid grid-cols-[82px_1fr_16px] items-center gap-3 border-b border-[#30394e] py-4 transition hover:text-[#19c8ff] sm:grid-cols-[100px_1fr_20px]"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#8ca8d8]">
                WhatsApp
              </span>
              <span className="text-sm font-medium">+91 6304939885</span>
              <ArrowUpRight
                size={15}
                className="text-gray-500 transition group-hover:text-[#19c8ff]"
              />
            </a>

            <Link
              to="/contact"
              className="group grid grid-cols-[82px_1fr_16px] items-center gap-3 border-b border-[#30394e] py-4 transition hover:text-[#19c8ff] sm:grid-cols-[100px_1fr_20px]"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#8ca8d8]">
                More enquiries
              </span>
              <span className="text-sm font-medium">Contact AARAMBH</span>
              <ArrowUpRight
                size={15}
                className="text-gray-500 transition group-hover:text-[#19c8ff]"
              />
            </Link>
          </div>

          <p className="mt-8 text-base font-medium italic text-[#ffc66d] sm:text-lg">
            One step at a time. One idea at a time.
          </p>

          <div className="mt-8 flex flex-wrap gap-5 border-t border-white/[0.07] pt-5">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 transition hover:text-white"
            >
              Explore community <ArrowUpRight size={14} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 transition hover:text-white"
            >
              Take your first step <ArrowUpRight size={14} />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
