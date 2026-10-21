
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter, Link, NavLink, Route, Routes, useLocation
} from 'react-router-dom';
import * as THREE from 'three';
import './styles.css';

const email = 'aarambh.community.team@gmail.com';
const whatsapp = 'https://wa.me/916304939885';
const siteUrl = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '');
const logo = '/assets/aarambh-logo.png';
const founderPhoto = '/assets/founder-photo.jpg';

const navigation = [
  ['/about', 'About'],
  ['/community', 'Community'],
  ['/opportunities', 'Opportunities'],
  ['/events', 'Events'],
  ['/founder', 'Founder'],
  ['/contact', 'Contact']
];

const pageSEO = {
  '/': {
    title: 'AARAMBH | The First Step of Entrepreneurship',
    description: 'Discover AARAMBH, an entrepreneurship and innovation community connecting students, aspiring founders, builders, mentors, and curious minds.'
  },
  '/about': {
    title: 'About AARAMBH | Our Mission and Vision',
    description: 'Learn about AARAMBH, its mission, vision, and approach to making entrepreneurship more accessible.'
  },
  '/community': {
    title: 'Community | AARAMBH',
    description: 'Explore the AARAMBH community for students, founders, mentors, innovators, institutions, and volunteers.'
  },
  '/opportunities': {
    title: 'Startup Opportunities | AARAMBH',
    description: 'Explore the AARAMBH opportunities directory for verified startup, learning, mentorship, and community opportunities.'
  },
  '/events': {
    title: 'Events and Gatherings | AARAMBH',
    description: 'Discover AARAMBH events and community gatherings as confirmed dates and participation details become available.'
  },
  '/founder': {
    title: 'Founder | Sandarsh Jeripothula | AARAMBH',
    description: 'Meet Sandarsh Jeripothula, founder of AARAMBH, an entrepreneurship and innovation community.'
  },
  '/join': {
    title: 'Join AARAMBH | Take Your First Step',
    description: 'Express your interest in joining AARAMBH and exploring entrepreneurship, innovation, and community.'
  },
  '/contact': {
    title: 'Contact AARAMBH | Get in Touch',
    description: 'Contact AARAMBH about community participation, collaboration, volunteering, and entrepreneurship initiatives.'
  },
  '/privacy': {
    title: 'Privacy Policy | AARAMBH',
    description: 'Read the AARAMBH website privacy information.'
  },
  '/terms': {
    title: 'Terms of Use | AARAMBH',
    description: 'Read the terms for using the AARAMBH website.'
  }
};

function Arrow() {
  return <span className="arrow" aria-hidden="true">↗</span>;
}

function Brand({ footer = false }) {
  return (
    <Link
      to="/"
      className={`brand ${footer ? 'footer-brand' : ''}`}
      aria-label="AARAMBH — home"
    >
      <img className="brand-logo" src={logo} alt="AARAMBH — The First Step of Entrepreneurship" />
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className="site-header">
      <Brand />
      <button
        className="menu-btn"
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
      >
        {open ? 'Close −' : 'Menu +'}
      </button>
      <nav className={`nav ${open ? 'open' : ''}`} aria-label="Main navigation">
        {navigation.map(([href, label]) => (
          <NavLink
            key={href}
            to={href}
            end={false}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            {label}
          </NavLink>
        ))}
        <Link className="nav-cta" to="/join">
          Join the community <Arrow />
        </Link>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-about">
          <Brand footer />
          <p>Curiosity into motion.<br />Ideas into first steps.</p>
          <span className="footer-tagline">THE FIRST STEP OF ENTREPRENEURSHIP.</span>
        </div>
        <div className="footer-links">
          <div>
            <b>Explore</b>
            <Link to="/about">About</Link>
            <Link to="/community">Community</Link>
            <Link to="/opportunities">Opportunities</Link>
            <Link to="/events">Events</Link>
          </div>
          <div>
            <b>Connect</b>
            <Link to="/founder">Founder</Link>
            <Link to="/contact">Contact</Link>
            <a href={`mailto:${email}`}>Email the team ↗</a>
            <a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp ↗</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} AARAMBH Community</span>
        <span><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}

/*
 * Brand-inspired 3D scene:
 * illuminated steps rise toward a sunrise, with orbiting rings and particles.
 * It uses procedural Three.js geometry, so no extra 3D asset is required.
 */
function Scene() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer;
    let raf = 0;
    let observer;
    let disposed = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.1, 11);

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch {
      host.classList.add('scene-fallback');
      return () => {};
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    scene.add(new THREE.AmbientLight(0x819dff, 1.5));

    const blueLight = new THREE.PointLight(0x087bff, 22, 18);
    blueLight.position.set(-3, 2, 4);
    scene.add(blueLight);

    const goldLight = new THREE.PointLight(0xffbd70, 28, 16);
    goldLight.position.set(2, 1.5, 2);
    scene.add(goldLight);

    const makeMaterial = (color, emissive = 0x000000, intensity = 0) =>
      new THREE.MeshStandardMaterial({
        color,
        emissive,
        emissiveIntensity: intensity,
        metalness: 0.55,
        roughness: 0.28
      });

    const stepMaterials = [
      makeMaterial(0x0759ce, 0x064dff, 0.45),
      makeMaterial(0x168cff, 0x087bff, 0.55),
      makeMaterial(0x7058df, 0x593dff, 0.45),
      makeMaterial(0xa38aff, 0x7659ff, 0.4),
      makeMaterial(0xffc777, 0xffa53b, 0.5),
      makeMaterial(0xffe3a3, 0xffbd62, 0.6)
    ];

    // Staircase rises toward the center of the sunrise.
    const stairGroup = new THREE.Group();
    root.add(stairGroup);

    for (let i = 0; i < 8; i++) {
      const width = 3.9 - i * 0.31;
      const height = 0.15;
      const depth = 0.48;
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = stepMaterials[Math.min(i, stepMaterials.length - 1)];
      const step = new THREE.Mesh(geometry, material);
      step.position.set(0, -1.55 + i * 0.28, 1.6 - i * 0.49);
      stairGroup.add(step);

      const edge = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.98, 0.025, 0.025),
        new THREE.MeshBasicMaterial({
          color: i < 3 ? 0x1ccaff : i < 6 ? 0x9b82ff : 0xffd28b
        })
      );
      edge.position.set(0, step.position.y + height / 2 + 0.012, step.position.z + depth / 2);
      stairGroup.add(edge);
    }

    // Sunrise disc and its atmospheric halo.
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.62, 48, 32),
      new THREE.MeshBasicMaterial({ color: 0xffd18b })
    );
    sun.scale.set(1, 0.9, 0.22);
    sun.position.set(0, 0.5, -2.55);
    root.add(sun);

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.84, 0.025, 12, 96),
      new THREE.MeshBasicMaterial({
        color: 0xffbd70,
        transparent: true,
        opacity: 0.8
      })
    );
    halo.position.copy(sun.position);
    root.add(halo);

    const orbitGroup = new THREE.Group();
    root.add(orbitGroup);

    [
      { radius: 3.2, color: 0x168cff, tilt: 0.95 },
      { radius: 3.65, color: 0x9878ff, tilt: 1.35 },
      { radius: 4.05, color: 0xffc777, tilt: 0.45 }
    ].forEach(({ radius, color, tilt }) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.009, 8, 180),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.48
        })
      );
      ring.rotation.x = tilt;
      ring.rotation.y = tilt * 0.35;
      orbitGroup.add(ring);
    });

    const particlePositions = [];
    for (let i = 0; i < 260; i++) {
      particlePositions.push(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 7
      );
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(particlePositions, 3)
    );
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0x91c9ff,
        size: 0.025,
        transparent: true,
        opacity: 0.65
      })
    );
    root.add(particles);

    const pointer = { x: 0, y: 0 };
    const targetPointer = { x: 0, y: 0 };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onPointerMove = event => {
      const rect = host.getBoundingClientRect();
      targetPointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.55;
      targetPointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.3;
    };
    const onPointerLeave = () => {
      targetPointer.x = 0;
      targetPointer.y = 0;
    };

    host.addEventListener('pointermove', onPointerMove);
    host.addEventListener('pointerleave', onPointerLeave);

    const resize = () => {
      if (!renderer || disposed) return;
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 600 ? 13 : 11;
      camera.updateProjectionMatrix();
    };

    observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    let scrollTarget = 0;
    const onScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight, 1
      );
      scrollTarget = Math.min(window.scrollY / maxScroll, 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const clock = new THREE.Clock();

    const animate = () => {
      if (disposed) return;
      const time = clock.getElapsedTime();

      pointer.x += (targetPointer.x - pointer.x) * 0.04;
      pointer.y += (targetPointer.y - pointer.y) * 0.04;

      if (!reducedMotion) {
        root.rotation.y = pointer.x + Math.sin(time * 0.18) * 0.08 + scrollTarget * 0.25;
        root.rotation.x = pointer.y + scrollTarget * 0.1;
        stairGroup.position.y = Math.sin(time * 0.6) * 0.045;
        orbitGroup.rotation.y += 0.0015;
        orbitGroup.rotation.z = pointer.x * 0.3;
        particles.rotation.y += 0.0005;
        halo.scale.setScalar(1 + Math.sin(time * 1.3) * 0.035);
      } else {
        root.rotation.y = 0.08;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener('scroll', onScroll);
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerleave', onPointerLeave);

      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material)
            ? object.material : [object.material];
          materials.forEach(material => material.dispose());
        }
      });

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="scene-wrap" ref={hostRef} aria-label="Three-dimensional sunrise and staircase">
      <div className="scene-glow" />
      <div className="scene-caption">
        <span className="live-dot" /> AN IDEA IS A BEGINNING
      </div>
      <div className="scene-coordinate">01 — THE FIRST STEP</div>
    </div>
  );
}

function Home() {
  const audiences = [
    ['01', 'Students', 'Turn curiosity into your first experiment.'],
    ['02', 'Founders', 'Find thoughtful peers for the work ahead.'],
    ['03', 'Mentors', 'Share perspective that helps others move forward.'],
    ['04', 'Innovators', 'Explore, build, test, and learn together.'],
    ['05', 'Investors', 'Discover the people and ideas taking shape.'],
    ['06', 'Institutions', 'Help create more ways to explore entrepreneurship.']
  ];

  return (
    <>
      <main id="top">
        <section className="hero">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> A COMMUNITY FOR WHAT COMES NEXT</p>
            <h1>Every great venture begins with <em>a first step.</em></h1>
            <p className="lede">
              AARAMBH brings curious minds, aspiring founders, innovators, and
              the people who help ideas take their first steps together.
            </p>
            <div className="actions">
              <Link className="button solid" to="/community">Find your people <Arrow /></Link>
              <Link className="button ghost" to="/about">Discover AARAMBH <Arrow /></Link>
            </div>
            <div className="hero-proof">
              <span className="proof-star">✳</span>
              <span>Curiosity is a starting point.</span>
              <span className="proof-divider" />
              <span>Entrepreneurship is a journey.</span>
            </div>
          </div>
          <Scene />
          <a className="scroll-hint" href="#idea"><span /> SCROLL TO BEGIN <span className="scroll-arrow">↓</span></a>
          <span className="hero-index">AARAMBH® · THE FIRST STEP OF ENTREPRENEURSHIP</span>
        </section>

        <section className="chapter dark" id="idea">
          <div className="chapter-index">01 / THE IDEA</div>
          <div className="chapter-content">
            <p className="eyebrow">A beginning is not small</p>
            <h2>Start with a question.<br /><span>Leave room for the answer.</span></h2>
            <p className="body-copy">
              AARAMBH is being built as a space for people who want to
              understand entrepreneurship by doing it — together, openly,
              and one honest conversation at a time.
            </p>
            <Link className="text-link" to="/about">Read our story <Arrow /></Link>
          </div>
          <div className="chapter-decoration" aria-hidden="true">A.</div>
        </section>

        <section className="audience-section" id="community">
          <div className="section-heading">
            <p className="eyebrow">02 / THE ECOSYSTEM</p>
            <h2>Find your people.<br /><em>Make something real.</em></h2>
            <p>Different starting lines. One shared direction.</p>
          </div>
          <div className="audience-grid">
            {audiences.map(([number, title, copy]) => (
              <Link to="/community" className="audience-card" key={title}>
                <span className="audience-number">{number} / COMMUNITY</span>
                <span className="audience-symbol" aria-hidden="true">
                  {['↗', '◈', '✳', '⌘', '◎', '△'][Number(number) - 1]}
                </span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <span className="audience-link">Explore this path <Arrow /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="invite">
          <p className="eyebrow">03 / YOUR TURN</p>
          <h2>Your first step<br /><em>starts here.</em></h2>
          <p className="lede">
            There is no perfect time to begin. There is only the moment you
            decide to look closer.
          </p>
          <Link className="button solid" to="/join">Take the first step <Arrow /></Link>
          <div className="invite-sun" aria-hidden="true">✳</div>
        </section>
      </main>
      <Footer />
    </>
  );
}

const pageData = {
  '/about': {
    kicker: '01 / ABOUT',
    title: <>A place to begin<br /><em>without pretending.</em></>,
    intro: 'AARAMBH is an entrepreneurship and innovation community in the making — a space to explore ideas, meet people, and learn through action.',
    sections: [
      ['Mission', 'Help people move from curiosity to a clear, considered first step.'],
      ['Vision', 'A culture where more people feel able to explore entrepreneurship, regardless of where they start.'],
      ['Values', 'Open-minded, action-oriented, generous with context, honest about the work.']
    ]
  },
  '/community': {
    kicker: '02 / COMMUNITY',
    title: <>Find the room<br /><em>that fits your next move.</em></>,
    intro: 'AARAMBH is for the whole path around an idea. Choose the perspective you bring today; it can change tomorrow.',
    sections: [
      ['Students & aspiring entrepreneurs', 'Explore the questions behind an idea, build confidence, and meet people who are also beginning.'],
      ['Founders & builders', 'Share the real work, trade practical lessons, and find thoughtful peers for the road ahead.'],
      ['Mentors & professionals', 'Offer context, experience, and perspective without taking the steering wheel.'],
      ['Investors & ecosystem partners', 'Discover emerging ideas and help support a thoughtful entrepreneurship ecosystem.'],
      ['Institutions & volunteers', 'Help make entrepreneurship more accessible through programs, spaces, and community energy.']
    ]
  },
  '/opportunities': {
    kicker: '03 / OPPORTUNITIES',
    title: <>Keep an eye on<br /><em>what could open next.</em></>,
    intro: 'A directory for verified opportunities as they become available. No invented deadlines, no vague promises.',
    sections: [
      ['Coming into focus', 'AARAMBH will share relevant calls, workshops, fellowships, and ways to participate when details are confirmed.'],
      ['Want to contribute one?', 'Email the team with the opportunity name, source, and a public link so the community can review it.']
    ]
  },
  '/events': {
    kicker: '04 / EVENTS',
    title: <>Meet the moment<br /><em>in the room.</em></>,
    intro: 'Planned gatherings will make space for honest questions, useful connections, and the energy that happens when people show up.',
    sections: [
      ['Events are being shaped', 'Confirmed dates, venues, and registration links will appear here once they are ready.'],
      ['Suggest a format', 'A workshop, open studio, founder circle, campus conversation — tell us what would help you take the next step.']
    ]
  },
  '/contact': {
    kicker: '08 / CONTACT',
    title: <>Let’s make the<br /><em>next conversation count.</em></>,
    intro: 'For general enquiries, collaborations, institutions, volunteering, or event-related questions, reach out directly.',
    sections: [
      ['Email', email],
      ['WhatsApp', '+91 6304939885'],
      ['Good to know', 'A short note about what you are exploring helps the team point you in the right direction.']
    ]
  }
};

function Founder() {
  return (
    <>
      <main className="founder-page">
        <div className="founder-intro">
          <p className="eyebrow">06 / THE FOUNDER</p>
          <h1>Big journeys<br />begin <em>somewhere.</em></h1>
          <p className="lede">
            AARAMBH begins with a simple belief: the first step into
            entrepreneurship should feel more possible, more human, and less solitary.
          </p>
        </div>

        <section className="founder-profile">
          <div className="founder-image-wrap">
            <img
              src={founderPhoto}
              alt="Sandarsh Jeripothula, founder of AARAMBH"
              className="founder-image"
              loading="eager"
              fetchPriority="high"
              onError={event => {
                event.currentTarget.style.display = 'none';
                event.currentTarget.parentElement.classList.add('image-missing');
              }}
            />
            <span className="image-label">THE PERSON BEHIND THE FIRST STEP</span>
          </div>

          <div className="founder-details">
            <p className="eyebrow">FOUNDER & COMMUNITY BUILDER</p>
            <h2>Sandarsh<br /><em>Jeripothula.</em></h2>
            <p className="founder-role">Founder, AARAMBH</p>
            <p>
              I started AARAMBH around an idea I care about: making it easier
              for curious people to take their first step toward entrepreneurship.
              Whether someone is exploring a problem, building a product, or
              looking for people to learn with, beginnings should not have to
              feel like a solo journey.
            </p>
            <p>
              AARAMBH is being shaped into a community where students,
              founders, mentors, innovators, and ecosystem partners can meet,
              exchange perspectives, and explore what they might build together.
            </p>
            <div className="founder-contact">
              <a href={`mailto:${email}`}><span>Email</span>{email} <Arrow /></a>
              <a href={whatsapp} target="_blank" rel="noreferrer"><span>WhatsApp</span>+91 6304939885 <Arrow /></a>
              <Link to="/contact"><span>More enquiries</span>Contact AARAMBH <Arrow /></Link>
            </div>
            <p className="founder-note">One step at a time. One idea at a time.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Editorial({ data }) {
  return (
    <>
      <main className="editorial">
        <p className="eyebrow">{data.kicker}</p>
        <h1>{data.title}</h1>
        <p className="lede">{data.intro}</p>
        <div className="editorial-grid">
          {data.sections.map(([heading, body], index) => (
            <article className="info-card" key={heading}>
              <span>{String(index + 1).padStart(2, '0')} / AARAMBH</span>
              <h2>{heading}</h2>
              <p>
                {heading === 'Email'
                  ? <a href={`mailto:${body}`}>{body}</a>
                  : heading === 'WhatsApp'
                    ? <a href={whatsapp} target="_blank" rel="noreferrer">{body} ↗</a>
                    : body}
              </p>
            </article>
          ))}
        </div>
        {data.kicker === '08 / CONTACT' && (
          <div className="actions">
            <a className="button solid" href={`mailto:${email}`}>Send an email <Arrow /></a>
            <a className="button ghost" href={whatsapp} target="_blank" rel="noreferrer">Open WhatsApp <Arrow /></a>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function Join() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', contact: '', city: '', role: '', interest: '', group: '', reason: ''
  });

  const update = event => setFormData({
    ...formData,
    [event.target.name]: event.target.value
  });

  const submit = event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setError('');
    setSubmitted(true);
  };

  const emailBody = [
    'AARAMBH Community Interest',
    '',
    `Name: ${formData.name}`,
    `Email: ${formData.contact}`,
    `City: ${formData.city}`,
    `Background: ${formData.role}`,
    `Interest: ${formData.interest}`,
    `Community group: ${formData.group}`,
    `Why I want to join: ${formData.reason}`
  ].join('\n');

  return (
    <>
      <main className="form-page">
        <p className="eyebrow">07 / JOIN THE COMMUNITY</p>
        <h1>Bring your curiosity.<br /><em>We’ll bring the room.</em></h1>
        <p className="lede">
          Tell us a little about yourself. Your details stay in this page
          until you choose to open an email draft; this form does not send
          information to a server.
        </p>

        {submitted ? (
          <div className="success">
            <span>✓</span>
            <h2>Your first step is ready.</h2>
            <p>
              Open an email draft with your details and send it to the AARAMBH team.
            </p>
            <a
              className="button solid"
              href={`mailto:${email}?subject=${encodeURIComponent('AARAMBH Community Interest')}&body=${encodeURIComponent(emailBody)}`}
            >
              Open email draft <Arrow />
            </a>
            <button className="button ghost" onClick={() => setSubmitted(false)}>Edit response</button>
          </div>
        ) : (
          <form className="join-form" onSubmit={submit}>
            <div className="form-grid">
              <label>Full name
                <input name="name" value={formData.name} onChange={update} required placeholder="Your name" />
              </label>
              <label>Email address
                <input type="email" name="contact" value={formData.contact} onChange={update} required placeholder="you@example.com" />
              </label>
              <label>City
                <input name="city" value={formData.city} onChange={update} required placeholder="Where are you based?" />
              </label>
              <label>Current role or background
                <input name="role" value={formData.role} onChange={update} required placeholder="Student, founder, designer…" />
              </label>
              <label>Areas of interest
                <select name="interest" value={formData.interest} onChange={update} required>
                  <option value="">Choose one</option>
                  <option>Starting an idea</option>
                  <option>Building a startup</option>
                  <option>Learning and mentorship</option>
                  <option>Community and events</option>
                  <option>Investing and ecosystem support</option>
                </select>
              </label>
              <label>Preferred community group
                <select name="group" value={formData.group} onChange={update} required>
                  <option value="">Choose one</option>
                  <option>Student / aspiring entrepreneur</option>
                  <option>Founder / builder</option>
                  <option>Mentor / professional</option>
                  <option>Investor / ecosystem partner</option>
                  <option>Institution / volunteer</option>
                </select>
              </label>
            </div>
            <label>What would you like to explore?
              <textarea name="reason" value={formData.reason} onChange={update} required placeholder="A few lines about what you are exploring…" />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button solid" type="submit">Prepare my note <Arrow /></button>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}

function Legal({ terms = false }) {
  return (
    <>
      <main className="legal">
        <p className="eyebrow">{terms ? '10 / TERMS' : '09 / PRIVACY'}</p>
        <h1>{terms ? <>Terms of <em>use.</em></> : <>Privacy, <em>plainly stated.</em></>}</h1>
        <p className="lede">Last updated: October 2026</p>
        <div className="legal-copy">
          {terms ? (
            <>
              <h2>Use of this website</h2>
              <p>AARAMBH is a community website for information and future participation. Content is provided in good faith and may change as initiatives develop.</p>
              <h2>Opportunities and events</h2>
              <p>Only confirmed details will be presented as confirmed. Please verify important information with the team before acting on it.</p>
              <h2>Contact</h2>
              <p>Questions about these terms can be sent to <a href={`mailto:${email}`}>{email}</a>.</p>
            </>
          ) : (
            <>
              <h2>What we collect</h2>
              <p>Public browsing does not require an account. If you contact AARAMBH or prepare a join note, you choose what personal information to include.</p>
              <h2>How it is used</h2>
              <p>The join form creates an email draft only when you choose to open it. This website does not claim to save join-form details to a database.</p>
              <h2>Contact</h2>
              <p>For privacy questions, email <a href={`mailto:${email}`}>{email}</a>.</p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <>
      <main className="editorial not-found">
        <p className="eyebrow">404 / NOT FOUND</p>
        <h1>This path<br /><em>hasn’t begun yet.</em></h1>
        <p className="lede">Try a different direction or return to the first step.</p>
        <Link className="button solid" to="/">Back to AARAMBH <Arrow /></Link>
      </main>
      <Footer />
    </>
  );
}

function SEO() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const page = pageSEO[path] || {
      title: 'Page not found | AARAMBH',
      description: 'Explore AARAMBH, the first step of entrepreneurship.'
    };

    document.title = page.title;

    const setMeta = (selector, attribute, value) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const [key, keyValue] = selector.match(/\[(name|property)="([^"]+)"\]/).slice(1);
        element.setAttribute(key, keyValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    setMeta('meta[name="description"]', 'content', page.description);
    setMeta('meta[property="og:title"]', 'content', page.title);
    setMeta('meta[property="og:description"]', 'content', page.description);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', page.title);
    setMeta('meta[name="twitter:description"]', 'content', page.description);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (siteUrl) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = `${siteUrl}${path === '/' ? '/' : path}`;
    } else if (canonical) {
      canonical.remove();
    }
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <>
      <SEO />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Editorial data={pageData['/about']} />} />
        <Route path="/community" element={<Editorial data={pageData['/community']} />} />
        <Route path="/opportunities" element={<Editorial data={pageData['/opportunities']} />} />
        <Route path="/events" element={<Editorial data={pageData['/events']} />} />
        <Route path="/founder" element={<Founder />} />
        <Route path="/join" element={<Join />} />
        <Route path="/contact" element={<Editorial data={pageData['/contact']} />} />
        <Route path="/privacy" element={<Legal />} />
        <Route path="/terms" element={<Legal terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter><App /></BrowserRouter>
);
