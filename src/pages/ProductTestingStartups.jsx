import { ArrowDown, ArrowUpRight, ClipboardList, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductTestingShell from '../components/product-testing/ProductTestingShell';
import ApplicationForm from '../components/product-testing/ApplicationForm';

const steps = [
  ['Application', 'Tell us about your product, testing goals and ideal student users.'],
  ['Pilot scoping', 'If selected, agree on the tasks, timeline and feedback questions with AARAMBH.'],
  ['Student testing', 'Students try the product using the agreed brief and share structured observations.'],
  ['Feedback report', 'Receive a report that brings together findings, recurring friction and opportunities to improve.'],
];

export default function ProductTestingStartups() {
  return (
    <ProductTestingShell audience="startups" title="Startup Product Testing Pilot | AARAMBH" description="Apply for AARAMBH’s proposed free 30-day pilot for one selected startup, targeting 30–50 student testers and a structured feedback report.">
      <header className="pt-startup-hero">
        <span className="pt-eyebrow">For startups / The first pilot</span><h1>Fresh eyes on your product.<br /><span>Clarity for your next step.</span></h1><p className="pt-lead">Put your early-stage product in front of student users. Understand the experience beyond your own team, with a focused testing brief and a structured feedback report.</p><a href="#startup-application" className="pt-button">Apply for a Product Testing Pilot <ArrowDown size={19} aria-hidden="true" /></a>
      </header>
      <section className="pt-pilot-panel" aria-labelledby="pt-pilot-title">
        <div className="pt-pilot-summary"><span className="pt-eyebrow">Proposed first pilot</span><h2 id="pt-pilot-title">One startup.<br />A focused month of learning.</h2><p>This first pilot is free for one selected startup. Acceptance is subject to review and agreement on the pilot scope.</p></div>
        <dl className="pt-pilot-facts"><div><dt>Program length</dt><dd>30 <span>days</span></dd></div><div><dt>Student tester target</dt><dd>30–50</dd></div><div><dt>Selected startup</dt><dd>01</dd></div><div><dt>First pilot cost</dt><dd>Free</dd></div></dl>
        <p className="pt-pilot-disclaimer">30–50 testers is our participation target, not a guaranteed number. The final group and schedule depend on product fit, student availability and pilot scoping.</p>
      </section>
      <section className="pt-section" aria-labelledby="pt-process-title"><span className="pt-eyebrow">From application to insight</span><h2 id="pt-process-title">A clear process, built around your questions.</h2><ol className="pt-process">{steps.map(([title, text], index) => <li key={title}><span className="pt-step-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>
      <section className="pt-report" aria-labelledby="pt-report-title"><ClipboardList size={36} aria-hidden="true" /><div><h2 id="pt-report-title">Feedback you can use.</h2><p>The pilot aims to bring student observations into a structured report, covering the testing questions agreed during scoping.</p></div><ul><li><Check size={18} aria-hidden="true" /> What users understood</li><li><Check size={18} aria-hidden="true" /> Where they faced friction</li><li><Check size={18} aria-hidden="true" /> Ideas for the next iteration</li></ul></section>
      <section className="pt-application pt-startup-application" id="startup-application" aria-label="Apply for a product testing pilot">
        <aside className="pt-application-aside"><span className="pt-eyebrow">Let’s explore the fit</span><h2>What would you like to learn?</h2><p>A clear testing question helps us scope a useful pilot. Share your product, who it is for, and the experience you want students to try.</p><div className="pt-aside-note"><h3>Before you apply</h3><p>Have a product, prototype or demo link ready. Please share only information needed to review the application; do not include passwords or private customer data.</p></div><p className="pt-small">We’ll review applications before selecting the first startup. Submitting this form does not reserve a pilot.</p><Link to="/product-testing/students" className="pt-inline-link">Here to test products? <ArrowUpRight size={17} aria-hidden="true" /></Link></aside>
        <ApplicationForm kind="startup" />
      </section>
    </ProductTestingShell>
  );
}
