import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, Menu, Search, X } from 'lucide-react';

type Resource = {
  category: 'Career prep' | 'Internships' | 'Building';
  title: string;
  description: string;
  type: string;
  url: string;
};

const SUBSTACK = 'https://substack.com/@dadavincent/subscribe';

const resources: Resource[] = [
  { category: 'Building', title: 'Resume-Ready Project Guide', description: 'A practical guide to choosing, building, and presenting projects that help your skills speak for themselves.', type: 'Project guide', url: 'https://vincent-project-guide.vincentalanagonzales.chatgpt.site/' },
  { category: 'Internships', title: 'Internship Job Boards 2027', description: 'A curated list of places to find internships, from familiar boards to opportunities worth a closer look.', type: 'Resource list', url: 'https://docs.google.com/document/d/1kCZu7bYroCU1ltCAB-10eNw6WSfmqakcoXHpPaBu1Q0/edit?usp=sharing' },
  { category: 'Career prep', title: 'Resume Template', description: 'A clean starting point for turning your experiences, projects, and strengths into a clear résumé.', type: 'Template', url: 'https://docs.google.com/document/d/1V2G6nmcZtVSNs6uCAB6M6JW0wZPsCzv9Ig8m9wUrwZE/edit?usp=drive_link' },
  { category: 'Career prep', title: 'Big Tech Interview Prep Guide', description: 'A structured guide to preparing for technical interviews with a plan that keeps the process manageable.', type: 'Interview guide', url: 'https://docs.google.com/document/d/1RerAsQMKFT6Y3l82SdSYDPCKtBgO9pxC4asqec0GEGc/edit?usp=sharing' },
  { category: 'Career prep', title: 'CARL Behavioral Interview Template', description: 'Shape a strong story about your experience with context, action, result, and learning.', type: 'Interview template', url: 'https://docs.google.com/document/d/1_cAmrP3CESgID6pD9BAmvRHxiKzM78dPs1nF1_FqCOo/edit?usp=drive_link' },
  { category: 'Career prep', title: 'Behavioral Skill Map', description: 'Map your examples to the skills interviewers are looking for, and spot the stories you still need.', type: 'Worksheet', url: 'https://docs.google.com/document/d/1EcTedk7uyt4AFePkyRHZgsKr3HM3r6ouCrsZPlF-VqM/edit?usp=sharing' },
  { category: 'Career prep', title: 'Email Templates', description: 'Thoughtful starting points for outreach, follow-ups, and the small messages that move a search forward.', type: 'Template collection', url: 'https://docs.google.com/document/d/1_ZPa8WlOlo8nxrEKoLJCAuPolEnFnJtCuIdwp6akUo/edit?usp=sharing' },
  { category: 'Internships', title: 'Week 1 Internship Checklist', description: 'A simple guide for getting oriented, meeting your people, and setting yourself up for a good first week.', type: 'Checklist', url: 'https://docs.google.com/document/d/1wlc_BmCL3Ac_g4Ptllj0Nn57t9U9gZ_CR8AAENo-3Ts/edit?usp=sharing' },
  { category: 'Internships', title: '1:1s With Your Manager', description: 'Make recurring one-on-ones feel useful with a repeatable rhythm for questions, feedback, and next steps.', type: 'Field guide', url: 'https://docs.google.com/document/d/1PNuhyRAY3VKr6VOQ8OzGoyuqSxHRLPnYz2Z1c8ePdbY/edit?usp=sharing' },
  { category: 'Internships', title: 'Manager Questions', description: 'Good questions to help you learn the context, expectations, and working style of your team.', type: 'Prompt list', url: 'https://docs.google.com/document/d/1zUpgkP7JeAGEQMViFQP7dMoopm8kojq5xuWmZ3mG0WA/edit?usp=sharing' },
  { category: 'Internships', title: 'Internship Question Tracker', description: 'Keep questions, answers, and follow-ups in one place so you can keep learning as you go.', type: 'Tracker', url: 'https://docs.google.com/document/d/1aMBwzt6TP4_sJAVieGUvN5O65KHDxE5CTGhWT-Swq80/edit?usp=sharing' },
  { category: 'Internships', title: 'Internship Networking Guide', description: 'Build real connections at work without making networking feel like another performance.', type: 'Guide', url: 'https://docs.google.com/document/d/1NQssBKOfvjMKzofgM_eIPRrvYpzDi5WbxkWOOzV1UOM/edit?usp=sharing' },
  { category: 'Internships', title: 'Internship Networking Tracker', description: 'Remember the people you meet, what you talked about, and the small ways to stay in touch.', type: 'Tracker', url: 'https://docs.google.com/document/d/1ocRphm8wI-OLh9zdFxBgpEfFP7CQDz6P3MDa3V7kWwM/edit?usp=sharing' },
  { category: 'Internships', title: 'Make Your Work Visible as an Intern', description: 'Capture progress and communicate your contributions while the details are still fresh.', type: 'Guide', url: 'https://docs.google.com/document/d/1umyHHoLDugwccXCuAZSsG3U3fBYVn6xmGyTfHnt_9f8/edit?usp=sharing' },
  { category: 'Internships', title: 'Internship Brag Sheet', description: 'A running record of wins, feedback, and useful details to draw on later.', type: 'Worksheet', url: 'https://docs.google.com/document/d/1MrqQJWj7PtF9KWh85vuDFzFju6FjpQuukgL17VAU-Mc/edit?usp=sharing' },
  { category: 'Internships', title: 'Internship Log', description: 'Reflect on what you are learning and make your growth easier to see over time.', type: 'Journal', url: 'https://docs.google.com/document/d/1BV9VJ4AaFmO-Yc01IDLRfFRMWeaRhx3JsZqnEvAW0zA/edit?usp=sharing' },
  { category: 'Internships', title: 'How to Ask for a Return Offer', description: 'Prepare for a clear, confident conversation about your work and what could come next.', type: 'Conversation guide', url: 'https://docs.google.com/document/d/1OrbVyTkezr7HdXyFvdPLbzyQ_wqeAHKMXM_3gf_lRaw/edit?usp=sharing' },
  { category: 'Internships', title: 'The Return Offer Playbook', description: 'A practical playbook for building momentum toward your next opportunity during an internship.', type: 'Playbook', url: 'https://docs.google.com/document/d/1tdf6zSAzsCisKj6Q-o05mSwV5Mywz0ikPElZCqY6_E8/edit?usp=sharing' },
  { category: 'Career prep', title: 'Women in Tech Resources', description: 'Communities and resources to help women find support, mentorship, and room to grow in tech.', type: 'Resource list', url: 'https://docs.google.com/document/d/1w1nEnFwZ5h4_Leg6nqg5v6dKIpDt2eoNO2Y7hJMOfrc/edit?usp=sharing' },
];

const categories = ['Everything', 'Career prep', 'Internships', 'Building'];

function ComputerMark() {
  return <svg aria-hidden="true" viewBox="0 0 54 48" className="vincent-computer"><path d="M9 6.5h31.5c2 0 3.5 1.5 3.5 3.5v23H9c-2 0-3.5-1.5-3.5-3.5V10c0-2 1.5-3.5 3.5-3.5Z" /><path d="M12 11h28v17H12zM20 33v5m10-5v5m-13 1h19M44 12h4v16h-4" /><path d="m17 19 4-4m-4 4 4 4m7-8 4 4-4 4" /><path d="M3 8 1 5m49 4 2-3M7 3 5 1" /></svg>;
}

function SocialIcon({ kind }: { kind: 'instagram' | 'linkedin' | 'youtube' | 'mail' | 'tiktok' | 'x' }) {
  if (kind === 'instagram') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.6" cy="6.7" r=".8" className="vincent-icon-fill" /></svg>;
  if (kind === 'linkedin') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v10M5 5.5v.1M10 19v-6c0-2.5 4.5-3.1 4.5.1V19M10 9v10M19 19v-6.2c0-5-6.2-5.2-8-2.6" /></svg>;
  if (kind === 'youtube') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 7.2a2.5 2.5 0 0 0-1.8-1.8C17.6 5 12 5 12 5s-5.6 0-7.2.4A2.5 2.5 0 0 0 3 7.2 25 25 0 0 0 2.6 12a25 25 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C6.4 19 12 19 12 19s5.6 0 7.2-.4a2.5 2.5 0 0 0 1.8-1.8 25 25 0 0 0 .4-4.8 25 25 0 0 0-.4-4.8Z" /><path d="m10 9 5 3-5 3z" /></svg>;
  if (kind === 'tiktok') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11a4 4 0 1 1-4-4M14 3c.7 3.2 2.7 5 6 5" /></svg>;
  if (kind === 'x') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 4 14 16M19 4 5 20" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
}

function App() {
  const [activeCategory, setActiveCategory] = useState('Everything');
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const visibleResources = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return resources.filter((resource) => {
      const categoryMatch = activeCategory === 'Everything' || resource.category === activeCategory;
      const searchMatch = !query || `${resource.title} ${resource.description} ${resource.category} ${resource.type}`.toLowerCase().includes(query);
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, searchTerm]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="vincent-page">
      <div className="vincent-frame">
        <header className="vincent-header">
          <a className="vincent-brand" href="#top" aria-label="Vincent Dada home" onClick={closeMenu} data-testid="link-home">
            <ComputerMark /><span className="vincent-wordmark">Dada Vincent</span>
          </a>
          <button className="vincent-menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen((open) => !open)} data-testid="button-mobile-menu">
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <nav id="main-navigation" className={`vincent-nav${menuOpen ? ' open' : ''}`} aria-label="Main navigation">
            <a onClick={closeMenu} href="#about">About</a>
            <a onClick={closeMenu} href="#Cohort">Cohort</a>
            <a onClick={closeMenu} href="#resources">Resources</a>
            <a onClick={closeMenu} href="#work">Work with me</a>
            <a className="vincent-nav-cta" onClick={closeMenu} href={SUBSTACK} target="_blank" rel="noopener noreferrer">Get the newsletter</a>
          </nav>
        </header>

        <main id="top">
          <section className="vincent-hero" aria-labelledby="hero-heading">
            <div className="vincent-socials" aria-label="Social links">
              <a className="vincent-social-link" href="https://www.instagram.com/itsvincentgonzales/" target="_blank" rel="noopener noreferrer" aria-label="Instagram (opens in a new tab)" data-testid="link-instagram"><SocialIcon kind="instagram" /></a>
              <a className="vincent-social-link" href="https://www.linkedin.com/in/vincentgonzales/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" data-testid="link-linkedin"><SocialIcon kind="linkedin" /></a>
              <a className="vincent-social-link" href="https://www.youtube.com/@imvincentgonzales" target="_blank" rel="noopener noreferrer" aria-label="YouTube (opens in a new tab)" data-testid="link-youtube"><SocialIcon kind="youtube" /></a>
              <a className="vincent-social-link" href="https://www.tiktok.com/@imvincentgonzales" target="_blank" rel="noopener noreferrer" aria-label="TikTok (opens in a new tab)" data-testid="link-tiktok"><SocialIcon kind="tiktok" /></a>
              <a className="vincent-social-link" href="https://x.com/itsvincentgonzales" target="_blank" rel="noopener noreferrer" aria-label="X (opens in a new tab)" data-testid="link-x"><SocialIcon kind="x" /></a>
              <a className="vincent-social-link" href="mailto:vincentg@undercurrent.net" aria-label="Email Vincent" data-testid="link-email-social"><SocialIcon kind="mail" /></a>
            </div>
            <p className="vincent-kicker">A little corner of the internet</p>
            <h1 id="hero-heading">Hi, I’m Vincent. <span>Glad you’re here.</span></h1>
            <p className="vincent-hero-copy">I’m a creator, curious technologist, and work-in-progress. I share the resources and experiments that helped me find my way into tech — in case they help you find yours, too.</p>
            <a className="vincent-button" href="#about">A little about me <ArrowRight aria-hidden="true" /></a>
            <div className="vincent-portrait-wrap">
              <img className="vincent-portrait" src="/images/vincent-homepage-portrait.jpg" alt="Vincent enjoying a sunny afternoon in a leafy garden" fetchPriority="high" data-testid="img-vincent-portrait" />
              <div className="vincent-photo-caption"><span aria-hidden="true">•</span> learning out loud, always</div>
            </div>
          </section>

          <section className="vincent-section vincent-about" id="about">
            <div><p className="vincent-section-label">A bit about me</p><h2>Tech didn’t feel like a place for me. Then I made it one.</h2></div>
            <div className="vincent-about-copy">
              <p>I’m Vincent — a creator and builder who took the scenic route into technology. I know what it feels like to be interested in a thousand things and still wonder whether you belong in the room.</p>
              <p>The turning point wasn’t one big breakthrough. It was asking better questions, finding generous people, and making little things before I felt ready. Now I’m sharing those notes as I go: what worked, what didn’t, and what I’m still figuring out.</p>
              <p className="vincent-signoff">No perfect roadmap. Just a few good next steps.</p>
            </div>
          </section>

          <section className="vincent-section vincent-ethos" id="ethos">
            <div className="vincent-ethos-inner">
              <div><p className="vincent-section-label">The Cohort</p><h2>There’s room for the way you do it.</h2></div>
              <div className="vincent-ethos-copy">
                <p>This space is for programmers who want to build real things: beginners with big ideas, self-taught developers, students, and anyone ready to move from tutorials to shipped projects. All skill levels are welcome, but effort is required.</p>
                <p>Here, we work in teams, use Git and GitHub, review each other’s code, and give honest feedback with respect. We expect consistency: members who go quiet for two weeks without notice make room for others. Apply, show up, and build something that matters.</p>
                <div className="vincent-values"><span className="vincent-value">Curiosity over credentials</span><span className="vincent-value">Progress over polish</span><span className="vincent-value">Community over competition</span></div>
                <a className="vincent-button vincent-ethos-action" href="https://forms.gle/fi1YQCTBT9K2rvu69" target="_blank" rel="noopener noreferrer">Apply to Cohort Creator Lab <ExternalLink aria-hidden="true" /></a>
              </div>
            </div>
          </section>

          <section className="vincent-section vincent-resources" id="resources">
            <div className="vincent-resources-heading">
              <div><p className="vincent-section-label">The resource library</p><h2>Useful things for your next step.</h2></div>
              <p className="vincent-resource-intro">Notes from the messy middle, made practical. Start with what you need today; you can come back for the rest.</p>
            </div>
            <div className="vincent-tools">
              <div className="vincent-filters" role="group" aria-label="Filter resources by topic">
                {categories.map((category) => <button className={`vincent-filter${activeCategory === category ? ' active' : ''}`} key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)} data-testid={`filter-${category.toLowerCase().replaceAll(' ', '-')}`}>{category}</button>)}
              </div>
              <label className="vincent-search"><Search aria-hidden="true" /><span className="sr-only">Search resources</span><input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search resources" aria-label="Search resources" data-testid="input-resource-search" /></label>
            </div>
            <div className="vincent-resource-list" aria-live="polite" aria-relevant="additions text">
              {visibleResources.map((resource, index) => (
                <article className="vincent-resource" key={resource.title} data-testid={`resource-${index + 1}`}>
                  <span className="vincent-resource-number">{String(index + 1).padStart(2, '0')}</span>
                  <a className="vincent-resource-link" href={resource.url} target="_blank" rel="noopener noreferrer" aria-label={`${resource.title} — opens in a new tab`}>
                    <div><h3>{resource.title}</h3><p>{resource.description}</p><div className="vincent-resource-type">{resource.type} · {resource.category}</div></div>
                    <span className="vincent-resource-mark" aria-hidden="true"><ExternalLink size={16} /></span>
                  </a>
                </article>
              ))}
              {visibleResources.length === 0 && <div className="vincent-empty" role="status"><strong>No resources found just yet.</strong>Try a different search or choose another topic.</div>}
            </div>
            <div className="vincent-roadmap">
              <div><small>Coming together now</small><h3>A more human roadmap into tech.</h3><p>A guided collection of the steps I wish I could hand my past self: choosing a direction, building proof, and finding people who get it.</p></div>
              <a className="vincent-button" href="https://cs-roadmap-waitlist.vincentalanagonzales.chatgpt.site/" target="_blank" rel="noopener noreferrer">Join the early list <ArrowRight aria-hidden="true" /></a>
            </div>
          </section>

          <section className="vincent-newsletter" id="newsletter">
            <div className="vincent-newsletter-inner">
              <div><p className="vincent-section-label">A note from me to you</p><h2>Good things take a few drafts.</h2><p className="vincent-newsletter-copy">A short, occasional letter with new resources, honest lessons, and little things I’m making. No noise; just something useful to take with you.</p></div>
              <div>
                <p className="vincent-newsletter-copy">Get the occasional note in your inbox.</p>
                <a className="vincent-newsletter-link" href={SUBSTACK} target="_blank" rel="noopener noreferrer" data-testid="link-newsletter-subscribe">Subscribe on Substack <ArrowRight aria-hidden="true" size={16} /></a>
              </div>
            </div>
          </section>

          <section className="vincent-section vincent-work" id="work">
            <div><p className="vincent-section-label">Work with me</p><h2>Let’s make something that helps someone begin.</h2></div>
            <div className="vincent-work-copy">
              <p>I love working with people and teams who want to make tech feel more welcoming. Bring me a thoughtful collaboration, a useful resource to make together, or a story worth sharing.</p>
              <a className="vincent-button" href="mailto:dadaademolav@gmail.com">Say hello <ArrowRight aria-hidden="true" /></a>
              <div className="vincent-work-card"><strong>Good things start with a note.</strong>Partnerships · workshops · speaking · friendly hellos</div>
              <p style={{ marginTop: 22, fontSize: 13 }}>For Cohort partnerships, reach <a href="/">David at Cohort Growth Labs</a>.</p>
            </div>
          </section>
        </main>

        <footer className="vincent-footer">
          <a className="vincent-brand" href="#top" aria-label="Vincent Gonzales — back to top"><ComputerMark /><span className="vincent-wordmark">Dada Vincent</span></a>
          <span>Made with care, and a lot of open tabs.</span>
          <div className="vincent-footer-links"><a href="#resources">Resources</a><a href="mailto:dadaademolav@gmail.com">Contact</a><a href="#top">Back to top ↑</a></div>
        </footer>
      </div>
    </div>
  );
}

export default App;
