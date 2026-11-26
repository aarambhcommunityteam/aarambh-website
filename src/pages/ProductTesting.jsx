import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Rocket, MessageSquare, RefreshCw } from 'lucide-react';
import ProductTestingShell from '../components/product-testing/ProductTestingShell';

export default function ProductTesting() {
  return (
    <ProductTestingShell title="Product Testing | AARAMBH Community" description="Connect student perspectives with early-stage products. Apply as a student tester or a startup for AARAMBH’s first product-testing pilot.">
      <header className="pt-entry-hero">
        <span className="pt-eyebrow">Real people. Useful feedback.</span>
        <h1>Better products start with <span>real feedback.</span></h1>
        <p>A space for curious students to explore new products, and for startups to learn from the people using them.</p>
      </header>
      <section className="pt-choices" aria-label="Choose your product testing path">
        <Link to="/product-testing/students" className="pt-choice pt-choice-student">
          <div className="pt-choice-top"><GraduationCap size={30} aria-hidden="true" /><span>FOR THE CURIOUS</span></div>
          <h2>I’m a Student</h2>
          <p>Try something new. Share what you notice. Get a closer look at how startups build and improve their products.</p>
          <span className="pt-choice-footer">Explore student testing <ArrowRight size={22} aria-hidden="true" /></span>
        </Link>
        <Link to="/product-testing/startups" className="pt-choice pt-choice-startup">
          <div className="pt-choice-top"><Rocket size={30} aria-hidden="true" /><span>FOR THE BUILDERS</span></div>
          <h2>I’m a Startup</h2>
          <p>Bring an early-stage product to fresh eyes. Apply for a focused pilot built around student testing and structured feedback.</p>
          <span className="pt-choice-footer">Explore the startup pilot <ArrowRight size={22} aria-hidden="true" /></span>
        </Link>
      </section>
      <section className="pt-entry-note" aria-labelledby="pt-loop-title">
        <div className="pt-note-icon" aria-hidden="true"><MessageSquare /><RefreshCw size={18} /></div>
        <div><h2 id="pt-loop-title">A small pilot. A meaningful feedback loop.</h2><p>We’re proposing a free, 30-day program for one selected startup, aiming to bring together 30–50 student testers. Applications are reviewed for fit, and participation depends on the pilot scope.</p></div>
      </section>
    </ProductTestingShell>
  );
}
