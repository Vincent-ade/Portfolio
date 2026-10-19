import { useState, type FormEvent } from "react";

const resources = [
  {
    category: "Career prep",
    number: "01",
    title: "The first tech résumé",
    description:
      "A thoughtful starting point for translating the work you have already done into a story recruiters can understand.",
    type: "Guide · 8 min read",
    mark: "CV",
  },
  {
    category: "Internships",
    number: "02",
    title: "Finding your first internship",
    description:
      "Where to look, when to apply, and how to make a small project feel like a real conversation starter.",
    type: "Field notes · 6 min read",
    mark: "↗",
  },
  {
    category: "Career prep",
    number: "03",
    title: "A kinder way to practice interviews",
    description:
      "A repeatable prep routine for getting unstuck on technical questions without turning your life into a bootcamp.",
    type: "Worksheet · 12 min",
    mark: "Q",
  },
  {
    category: "Building",
    number: "04",
    title: "Make a tiny thing, then share it",
    description:
      "A low-pressure weekend project recipe: pick a question, make a useful little answer, and put it out in the world.",
    type: "Project prompt · 4 min read",
    mark: "↗",
  },
];

const categories = ["Everything", "Career prep", "Internships", "Building"];

function ComputerMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 54 48" className="vincent-computer">
      <path d="M9 6.5h31.5c2 0 3.5 1.5 3.5 3.5v23H9c-2 0-3.5-1.5-3.5-3.5V10c0-2 1.5-3.5 3.5-3.5Z" />
      <path d="M12 11h28v17H12zM20 33v5m10-5v5m-13 1h19M44 12h4v16h-4" />
      <path d="m17 19 4-4m-4 4 4 4m7-8 4 4-4 4" />
      <path d="M3 8 1 5m49 4 2-3M7 3 5 1" />
    </svg>
  );
}

function SocialIcon({ kind }: { kind: "instagram" | "linkedin" | "youtube" | "mail" }) {
  if (kind === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.6" cy="6.7" r=".8" className="vincent-icon-fill" />
      </svg>
    );
  }
  if (kind === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 9v10M5 5.5v.1M10 19v-6c0-2.5 4.5-3.1 4.5.1V19M10 9v10M19 19v-6.2c0-5-6.2-5.2-8-2.6" />
      </svg>
    );
  }
  if (kind === "youtube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 7.2a2.5 2.5 0 0 0-1.8-1.8C17.6 5 12 5 12 5s-5.6 0-7.2.4A2.5 2.5 0 0 0 3 7.2 25 25 0 0 0 2.6 12a25 25 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C6.4 19 12 19 12 19s5.6 0 7.2-.4a2.5 2.5 0 0 0 1.8-1.8 25 25 0 0 0 .4-4.8 25 25 0 0 0-.4-4.8Z" />
        <path d="m10 9 5 3-5 3z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function VincentHomepage() {
  const [activeCategory, setActiveCategory] = useState("Everything");
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const visibleResources =
    activeCategory === "Everything"
      ? resources
      : resources.filter((resource) => resource.category === activeCategory);

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim()) setSubscribed(true);
  }

  return (
    <div className="vincent-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');
        .vincent-page {
          --ink: #252528;
          --muted: #66666d;
          --blue: #6878e7;
          --blue-dark: #5364d4;
          --line: #e8e7e5;
          --cream: #faf9f6;
          background: #fff;
          color: var(--ink);
          font-family: 'DM Sans', sans-serif;
          min-height: 100dvh;
          overflow: hidden;
          position: relative;
        }
        .vincent-page *, .vincent-page *::before, .vincent-page *::after { box-sizing: border-box; }
        .vincent-frame { max-width: 1440px; margin: 0 auto; border-left: 1px solid #f0efed; border-right: 1px solid #f0efed; }
        .vincent-header { border-bottom: 1px solid var(--line); padding: 0 7.1%; height: 88px; display: flex; align-items: center; justify-content: space-between; gap: 28px; }
        .vincent-brand { display: inline-flex; align-items: center; gap: 10px; color: var(--ink); text-decoration: none; flex-shrink: 0; }
        .vincent-computer { width: 41px; height: 37px; fill: none; stroke: var(--blue); stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
        .vincent-wordmark { font: 600 20px/1 'Playfair Display', Georgia, serif; letter-spacing: -.65px; }
        .vincent-nav { display: flex; align-items: center; gap: clamp(17px, 3vw, 43px); }
        .vincent-nav a { font-size: 13px; color: #4e4e53; text-decoration: none; transition: color .2s ease; white-space: nowrap; }
        .vincent-nav a:hover { color: var(--blue-dark); }
        .vincent-nav .vincent-nav-cta { padding: 12px 19px; color: white; background: var(--blue); border-radius: 999px; font-weight: 600; transition: transform .2s ease, background .2s ease; }
        .vincent-nav .vincent-nav-cta:hover { color: white; background: var(--blue-dark); transform: translateY(-2px); }
        .vincent-menu-toggle { display: none; border: 0; background: transparent; color: var(--ink); padding: 8px; cursor: pointer; }
        .vincent-menu-toggle svg { height: 22px; width: 22px; stroke: currentColor; fill: none; stroke-width: 1.7; }
        .vincent-hero { text-align: center; padding: 77px 22px 0; }
        .vincent-socials { display: flex; justify-content: center; align-items: center; gap: 11px; margin-bottom: 27px; }
        .vincent-social-link { width: 36px; height: 36px; border: 1px solid #dad9d8; border-radius: 50%; display: grid; place-items: center; color: #56565d; transition: color .2s, border-color .2s, transform .2s; }
        .vincent-social-link:hover { color: var(--blue); border-color: var(--blue); transform: translateY(-2px); }
        .vincent-social-link svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.65; stroke-linecap: round; stroke-linejoin: round; }
        .vincent-social-link .vincent-icon-fill { fill: currentColor; stroke: none; }
        .vincent-kicker { color: var(--blue-dark); font-size: 11px; font-weight: 700; letter-spacing: 1.9px; text-transform: uppercase; margin: 0 0 12px; }
        .vincent-hero h1 { margin: 0; font: 500 clamp(42px, 5.1vw, 67px)/1.09 'Playfair Display', Georgia, serif; letter-spacing: -2.5px; color: #26262a; }
        .vincent-hero h1 span { color: var(--blue); font-style: italic; }
        .vincent-hero-copy { max-width: 560px; margin: 20px auto 24px; color: #6b6b70; font-size: 16px; line-height: 1.8; }
        .vincent-button { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 48px; border-radius: 999px; border: 1px solid transparent; padding: 0 23px; background: var(--blue); color: white; font: 600 13px 'DM Sans', sans-serif; text-decoration: none; cursor: pointer; transition: transform .2s ease, background .2s ease, box-shadow .2s ease; }
        .vincent-button:hover { background: var(--blue-dark); transform: translateY(-2px); box-shadow: 0 9px 22px #596bd225; }
        .vincent-button svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
        .vincent-portrait-wrap { max-width: 1010px; margin: 59px auto 0; padding: 0 32px; position: relative; }
        .vincent-portrait { display: block; width: 100%; height: clamp(325px, 48vw, 555px); object-fit: cover; object-position: center 43%; border-radius: 18px; }
        .vincent-photo-caption { position: absolute; right: 53px; bottom: 22px; background: rgba(255,255,255,.92); padding: 10px 15px; border-radius: 999px; font-size: 11px; color: #505058; }
        .vincent-photo-caption span { color: var(--blue-dark); margin-right: 5px; }
        .vincent-section { padding: 112px 9%; }
        .vincent-about { display: grid; grid-template-columns: .75fr 1.25fr; gap: 12%; align-items: start; }
        .vincent-section-label { text-transform: uppercase; letter-spacing: 1.8px; font-weight: 700; color: var(--blue-dark); font-size: 11px; margin: 7px 0 14px; }
        .vincent-section h2 { font: 500 clamp(34px, 4vw, 48px)/1.15 'Playfair Display', Georgia, serif; letter-spacing: -1.15px; margin: 0; }
        .vincent-about-copy { color: var(--muted); font-size: 15px; line-height: 1.9; max-width: 600px; }
        .vincent-about-copy p { margin: 0 0 17px; }
        .vincent-signoff { color: var(--ink); font: italic 19px 'Playfair Display', Georgia, serif; margin-top: 24px !important; }
        .vincent-ethos { background: var(--cream); position: relative; overflow: hidden; }
        .vincent-ethos::after { content: ""; position: absolute; width: 290px; height: 290px; border: 1px solid #e7e5df; border-radius: 50%; right: -142px; top: 54px; box-shadow: 0 0 0 28px #faf9f680, 0 0 0 57px #faf9f680; pointer-events: none; }
        .vincent-ethos-inner { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: .95fr 1.05fr; gap: 11%; align-items: center; position: relative; z-index: 1; }
        .vincent-ethos h2 { max-width: 430px; }
        .vincent-ethos-copy { color: var(--muted); font-size: 15px; line-height: 1.9; }
        .vincent-ethos-copy p { margin: 0 0 19px; }
        .vincent-values { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 23px; }
        .vincent-value { border: 1px solid #dfded9; border-radius: 999px; padding: 9px 13px; color: #515158; font-size: 11px; }
        .vincent-resources { padding-top: 119px; }
        .vincent-resources-heading { display: flex; align-items: end; justify-content: space-between; gap: 30px; margin-bottom: 34px; }
        .vincent-resources-heading h2 { max-width: 530px; }
        .vincent-resource-intro { max-width: 380px; color: var(--muted); font-size: 14px; line-height: 1.8; margin: 0 0 4px; }
        .vincent-filters { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 25px; }
        .vincent-filter { border: 1px solid #e4e3e1; background: white; color: #66666c; border-radius: 999px; padding: 9px 15px; font: 500 12px 'DM Sans', sans-serif; cursor: pointer; transition: all .18s ease; }
        .vincent-filter:hover, .vincent-filter.active { background: #eef0ff; color: #4555bd; border-color: #d5d9ff; }
        .vincent-resource-list { border-top: 1px solid var(--line); }
        .vincent-resource { display: grid; grid-template-columns: 55px minmax(0, 1fr) 64px; gap: 22px; align-items: center; padding: 25px 5px; border-bottom: 1px solid var(--line); }
        .vincent-resource-number { color: #a1a0a2; font: 12px 'DM Sans', sans-serif; }
        .vincent-resource h3 { font: 500 22px 'Playfair Display', Georgia, serif; margin: 0 0 6px; }
        .vincent-resource p { font-size: 13px; color: var(--muted); line-height: 1.7; margin: 0; max-width: 690px; }
        .vincent-resource-type { color: #85848a; font-size: 11px; margin-top: 10px; }
        .vincent-resource-mark { width: 48px; height: 48px; border-radius: 50%; background: #f3f3fc; color: var(--blue-dark); display: grid; place-items: center; font: 500 17px 'Playfair Display', Georgia, serif; }
        .vincent-roadmap { margin-top: 54px; padding: 34px 38px; border: 1px solid #e4e5f5; border-radius: 14px; background: #f8f8ff; display: flex; align-items: center; justify-content: space-between; gap: 28px; }
        .vincent-roadmap small { color: var(--blue-dark); text-transform: uppercase; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; }
        .vincent-roadmap h3 { margin: 7px 0 8px; font: 500 25px 'Playfair Display', Georgia, serif; }
        .vincent-roadmap p { margin: 0; max-width: 580px; color: var(--muted); font-size: 13px; line-height: 1.7; }
        .vincent-newsletter { background: #6878e7; color: white; padding: 85px 9%; position: relative; overflow: hidden; }
        .vincent-newsletter::before, .vincent-newsletter::after { content: ""; width: 330px; height: 330px; border: 1px solid #ffffff22; border-radius: 50%; position: absolute; right: 4%; top: -190px; box-shadow: 0 0 0 30px #ffffff09, 0 0 0 60px #ffffff09; }
        .vincent-newsletter::after { left: -210px; right: auto; top: auto; bottom: -250px; }
        .vincent-newsletter-inner { max-width: 950px; margin: 0 auto; display: grid; grid-template-columns: 1fr .8fr; gap: 10%; align-items: center; position: relative; z-index: 1; }
        .vincent-newsletter .vincent-section-label { color: #dce0ff; }
        .vincent-newsletter h2 { max-width: 500px; }
        .vincent-newsletter-copy { color: #eef0ff; font-size: 14px; line-height: 1.8; margin: 16px 0 0; max-width: 470px; }
        .vincent-form { display: flex; flex-direction: column; gap: 10px; }
        .vincent-form label { font-size: 11px; color: #eef0ff; margin-bottom: 2px; }
        .vincent-form-row { display: flex; background: white; border-radius: 999px; padding: 5px; }
        .vincent-form input { min-width: 0; flex: 1; border: 0; outline: none; padding: 0 14px; border-radius: 999px; font: 13px 'DM Sans', sans-serif; color: var(--ink); }
        .vincent-form input::placeholder { color: #9b9aa1; }
        .vincent-form button { background: #272832; color: white; border: 0; padding: 0 18px; border-radius: 999px; font: 600 12px 'DM Sans', sans-serif; cursor: pointer; transition: background .2s, transform .2s; }
        .vincent-form button:hover { background: #41424d; transform: translateY(-1px); }
        .vincent-form-note { font-size: 11px; color: #e0e3ff; min-height: 16px; }
        .vincent-work { display: grid; grid-template-columns: .8fr 1.2fr; gap: 12%; align-items: center; }
        .vincent-work-copy { color: var(--muted); font-size: 15px; line-height: 1.9; }
        .vincent-work-copy p { margin: 0 0 21px; max-width: 570px; }
        .vincent-work-card { border-left: 2px solid var(--blue); padding: 4px 0 4px 22px; margin-top: 29px; color: #55555c; font-size: 13px; line-height: 1.8; }
        .vincent-work-card strong { display: block; color: var(--ink); font-size: 13px; margin-bottom: 3px; }
        .vincent-footer { border-top: 1px solid var(--line); padding: 25px 7.1%; display: flex; justify-content: space-between; align-items: center; gap: 18px; color: #818086; font-size: 11px; }
        .vincent-footer a { color: #5f5f65; text-decoration: none; }
        .vincent-footer a:hover { color: var(--blue-dark); }
        .vincent-footer-links { display: flex; gap: 22px; }
        @media (max-width: 760px) {
          .vincent-header { height: 73px; padding: 0 6%; }
          .vincent-wordmark { font-size: 18px; }
          .vincent-computer { width: 36px; height: 33px; }
          .vincent-menu-toggle { display: grid; place-items: center; }
          .vincent-nav { display: none; position: absolute; z-index: 5; left: 5%; right: 5%; top: 66px; background: white; padding: 17px; border: 1px solid var(--line); border-radius: 14px; box-shadow: 0 12px 30px #29293412; align-items: stretch; gap: 0; flex-direction: column; }
          .vincent-nav.open { display: flex; }
          .vincent-nav a { padding: 12px 9px; }
          .vincent-nav .vincent-nav-cta { text-align: center; margin-top: 7px; padding: 12px 16px; }
          .vincent-hero { padding-top: 60px; }
          .vincent-hero h1 { letter-spacing: -1.6px; }
          .vincent-hero-copy { font-size: 14px; max-width: 470px; margin-top: 16px; }
          .vincent-portrait-wrap { margin-top: 42px; padding: 0 17px; }
          .vincent-portrait { height: 390px; border-radius: 14px; object-position: 50% 45%; }
          .vincent-photo-caption { right: 30px; bottom: 14px; font-size: 10px; padding: 8px 12px; }
          .vincent-section { padding: 78px 8%; }
          .vincent-about, .vincent-ethos-inner, .vincent-work { grid-template-columns: 1fr; gap: 22px; }
          .vincent-ethos-inner { gap: 18px; }
          .vincent-resources { padding-top: 82px; }
          .vincent-resources-heading { display: block; }
          .vincent-resource-intro { margin-top: 17px; }
          .vincent-resource { grid-template-columns: 35px minmax(0, 1fr) 44px; gap: 12px; padding: 21px 0; }
          .vincent-resource h3 { font-size: 19px; }
          .vincent-resource p { font-size: 12px; }
          .vincent-resource-mark { width: 40px; height: 40px; }
          .vincent-roadmap { align-items: flex-start; flex-direction: column; padding: 27px 23px; }
          .vincent-newsletter { padding: 69px 8%; }
          .vincent-newsletter-inner { grid-template-columns: 1fr; gap: 28px; }
          .vincent-form-row { min-height: 49px; }
          .vincent-work { gap: 18px; }
          .vincent-footer { padding: 23px 6%; align-items: flex-start; flex-direction: column; }
        }
        @media (max-width: 420px) {
          .vincent-hero { padding-left: 18px; padding-right: 18px; }
          .vincent-hero h1 { font-size: 41px; }
          .vincent-hero-copy { font-size: 13px; }
          .vincent-portrait { height: 320px; }
          .vincent-resource { grid-template-columns: 26px minmax(0, 1fr); }
          .vincent-resource-mark { display: none; }
          .vincent-form-row { background: transparent; padding: 0; flex-direction: column; gap: 8px; border-radius: 0; }
          .vincent-form input { height: 47px; background: white; }
          .vincent-form button { min-height: 45px; }
        }
      `}</style>
      <div className="vincent-frame">
        <header className="vincent-header">
          <a className="vincent-brand" href="#top" aria-label="Vincent Gonzales home">
            <ComputerMark />
            <span className="vincent-wordmark">vincent gonzales</span>
          </a>
          <button
            className="vincent-menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
          <nav className={`vincent-nav${menuOpen ? " open" : ""}`} aria-label="Main navigation">
            <a onClick={() => setMenuOpen(false)} href="#about">About</a>
            <a onClick={() => setMenuOpen(false)} href="#ethos">Ethos</a>
            <a onClick={() => setMenuOpen(false)} href="#resources">Resources</a>
            <a onClick={() => setMenuOpen(false)} href="#work">Work with me</a>
            <a className="vincent-nav-cta" onClick={() => setMenuOpen(false)} href="#newsletter">Get the newsletter</a>
          </nav>
        </header>

        <main id="top">
          <section className="vincent-hero">
            <div className="vincent-socials" aria-label="Social links">
              <a className="vincent-social-link" href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><SocialIcon kind="instagram" /></a>
              <a className="vincent-social-link" href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><SocialIcon kind="linkedin" /></a>
              <a className="vincent-social-link" href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube"><SocialIcon kind="youtube" /></a>
              <a className="vincent-social-link" href="mailto:hello@vincentgonzales.com" aria-label="Email"><SocialIcon kind="mail" /></a>
            </div>
            <p className="vincent-kicker">A little corner of the internet</p>
            <h1>Hi, I’m Vincent. <span>Glad you’re here.</span></h1>
            <p className="vincent-hero-copy">
              I’m a creator, curious technologist, and work-in-progress. I share the resources and experiments that helped me find my way into tech — in case they help you find yours, too.
            </p>
            <a className="vincent-button" href="#about">
              A little about me
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4" /></svg>
            </a>
            <div className="vincent-portrait-wrap">
              <img
                className="vincent-portrait"
                src="/__mockup/images/vincent-homepage-portrait.jpg"
                alt="A fictional creator enjoying a sunny afternoon in a leafy garden"
              />
              <div className="vincent-photo-caption"><span>•</span> learning out loud, always</div>
            </div>
          </section>

          <section className="vincent-section vincent-about" id="about">
            <div>
              <p className="vincent-section-label">A bit about me</p>
              <h2>Tech didn’t feel like a place for me. Then I made it one.</h2>
            </div>
            <div className="vincent-about-copy">
              <p>
                I’m Vincent — a creator and builder who took the scenic route into technology. I know what it feels like to be interested in a thousand things and still wonder whether you belong in the room.
              </p>
              <p>
                The turning point wasn’t one big breakthrough. It was asking better questions, finding generous people, and making little things before I felt ready. Now I’m sharing those notes as I go: what worked, what didn’t, and what I’m still figuring out.
              </p>
              <p className="vincent-signoff">No perfect roadmap. Just a few good next steps.</p>
            </div>
          </section>

          <section className="vincent-section vincent-ethos" id="ethos">
            <div className="vincent-ethos-inner">
              <div>
                <p className="vincent-section-label">The Ethos</p>
                <h2>There’s room for the way you do it.</h2>
              </div>
              <div className="vincent-ethos-copy">
                <p>
                  This space is for the curious ones — the career-switchers, the first-gen students, the creative builders, and anyone who has ever opened a job listing and thought, “I don’t know if I’m qualified.”
                </p>
                <p>
                  We can take our work seriously without taking ourselves too seriously. Ask for help. Make a small thing. Be a beginner in public. Your path is allowed to look like yours.
                </p>
                <div className="vincent-values">
                  <span className="vincent-value">Curiosity over credentials</span>
                  <span className="vincent-value">Progress over polish</span>
                  <span className="vincent-value">Community over competition</span>
                </div>
              </div>
            </div>
          </section>

          <section className="vincent-section vincent-resources" id="resources">
            <div className="vincent-resources-heading">
              <div>
                <p className="vincent-section-label">The resource library</p>
                <h2>Useful things for your next step.</h2>
              </div>
              <p className="vincent-resource-intro">
                Notes from the messy middle, made practical. Start with what you need today; you can come back for the rest.
              </p>
            </div>
            <div className="vincent-filters" role="group" aria-label="Filter resources by topic">
              {categories.map((category) => (
                <button
                  className={`vincent-filter${activeCategory === category ? " active" : ""}`}
                  key={category}
                  type="button"
                  aria-pressed={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="vincent-resource-list" aria-live="polite">
              {visibleResources.map((resource) => (
                <article className="vincent-resource" key={resource.number}>
                  <span className="vincent-resource-number">{resource.number}</span>
                  <div>
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                    <div className="vincent-resource-type">{resource.type} · {resource.category}</div>
                  </div>
                  <span className="vincent-resource-mark" aria-hidden="true">{resource.mark}</span>
                </article>
              ))}
            </div>
            <div className="vincent-roadmap">
              <div>
                <small>Coming together now</small>
                <h3>A more human roadmap into tech.</h3>
                <p>A guided collection of the steps I wish I could hand my past self: choosing a direction, building proof, and finding people who get it.</p>
              </div>
              <a className="vincent-button" href="#newsletter">Join the early list <span aria-hidden="true">→</span></a>
            </div>
          </section>

          <section className="vincent-newsletter" id="newsletter">
            <div className="vincent-newsletter-inner">
              <div>
                <p className="vincent-section-label">A note from me to you</p>
                <h2>Good things take a few drafts.</h2>
                <p className="vincent-newsletter-copy">
                  A short, occasional letter with new resources, honest lessons, and little things I’m making. No noise; just something useful to take with you.
                </p>
              </div>
              <form className="vincent-form" onSubmit={handleSubscribe}>
                <label htmlFor="vincent-email">Your email, if you’d like</label>
                <div className="vincent-form-row">
                  <input
                    id="vincent-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => { setEmail(event.target.value); setSubscribed(false); }}
                    placeholder="you@example.com"
                    aria-describedby="vincent-form-note"
                  />
                  <button type="submit">{subscribed ? "You’re on the list" : "Count me in"}</button>
                </div>
                <span className="vincent-form-note" id="vincent-form-note" role="status">
                  {subscribed ? "Thanks for being here. Your first note is on its way." : "A little encouragement, delivered occasionally."}
                </span>
              </form>
            </div>
          </section>

          <section className="vincent-section vincent-work" id="work">
            <div>
              <p className="vincent-section-label">Work with me</p>
              <h2>Let’s make something that helps someone begin.</h2>
            </div>
            <div className="vincent-work-copy">
              <p>
                I love working with people and teams who want to make tech feel more welcoming. Bring me a thoughtful collaboration, a useful resource to make together, or a story worth sharing.
              </p>
              <a className="vincent-button" href="mailto:hello@vincentgonzales.com?subject=Let%E2%80%99s%20work%20together">
                Say hello
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4" /></svg>
              </a>
              <div className="vincent-work-card">
                <strong>Good things start with a note.</strong>
                Partnerships · workshops · speaking · friendly hellos
              </div>
            </div>
          </section>
        </main>

        <footer className="vincent-footer">
          <a className="vincent-brand" href="#top">
            <ComputerMark />
            <span className="vincent-wordmark">vincent gonzales</span>
          </a>
          <span>Made with care, and a lot of open tabs.</span>
          <div className="vincent-footer-links">
            <a href="#resources">Resources</a>
            <a href="mailto:hello@vincentgonzales.com">Contact</a>
            <a href="#top">Back to top ↑</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
