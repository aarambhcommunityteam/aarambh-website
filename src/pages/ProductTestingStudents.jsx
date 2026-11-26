import { ArrowDown, ArrowUpRight, BookOpen, MessageSquare, MousePointer2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductTestingShell from '../components/product-testing/ProductTestingShell';
import ApplicationForm from '../components/product-testing/ApplicationForm';

export default function ProductTestingStudents() {
  return (
    <ProductTestingShell audience="students" title="Become a Student Product Tester | AARAMBH" description="Try early-stage products, follow a short testing brief and share structured feedback. Apply to be an AARAMBH student tester.">
      <header className="pt-student-hero">
        <div><span className="pt-eyebrow">For students / Learn by trying</span><h1>Your perspective can shape <span>what’s next.</span></h1><p className="pt-lead">Get hands-on exposure to startups. Explore an early-stage product and help its team understand what works, what feels confusing, and what could be better.</p><a href="#student-application" className="pt-button">Apply to Be a Tester <ArrowDown size={19} aria-hidden="true" /></a><p className="pt-small">Curiosity and honest feedback are a great place to start.</p></div>
        <aside className="pt-brief" aria-labelledby="pt-brief-title">
          <div className="pt-brief-heading"><span className="pt-eyebrow">Inside the experience</span><span className="pt-dot" aria-hidden="true" /></div>
          <h2 id="pt-brief-title">Your role in the loop</h2>
          <ol>
            <li><span>01</span><div><h3>Try the product</h3><p>Follow a short brief and explore a few key tasks.</p></div></li>
            <li><span>02</span><div><h3>Notice the details</h3><p>Where did you pause? What felt useful or unclear?</p></div></li>
            <li><span>03</span><div><h3>Share your feedback</h3><p>Turn your observations into structured, useful answers.</p></div></li>
          </ol>
          <div className="pt-brief-foot">Your experience → a clearer next step for the team</div>
        </aside>
      </header>
      <section className="pt-section" aria-labelledby="pt-student-benefits">
        <span className="pt-eyebrow">Beyond simply trying an app</span><h2 id="pt-student-benefits">See product building from the inside.</h2>
        <div className="pt-benefits">
          <article><MousePointer2 aria-hidden="true" /><h3>Hands-on startup exposure</h3><p>Experience a product while it is still taking shape and discover the decisions behind everyday features.</p></article>
          <article><MessageSquare aria-hidden="true" /><h3>A voice in the process</h3><p>Practise describing your experience clearly, with specific observations a product team can act on.</p></article>
          <article><BookOpen aria-hidden="true" /><h3>Learn through iteration</h3><p>See how user feedback can guide improvements, and build a more thoughtful eye for the products you use.</p></article>
        </div>
      </section>
      <section className="pt-application pt-student-application" id="student-application" aria-label="Apply to be a tester">
        <aside className="pt-application-aside"><span className="pt-eyebrow">Ready to take part?</span><h2>Start with a little about you.</h2><p>Tell us your interests and availability so we can look for a fit with the pilot.</p><div className="pt-aside-note"><h3>What happens next?</h3><p>The AARAMBH team reviews applications and contacts suitable students by email with a testing brief, scope and schedule. Applying does not guarantee a place.</p></div><Link to="/product-testing/startups" className="pt-inline-link">Building a product instead? <ArrowUpRight size={17} aria-hidden="true" /></Link></aside>
        <ApplicationForm kind="student" />
      </section>
    </ProductTestingShell>
  );
}
