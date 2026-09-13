import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HouseJourney.css';

gsap.registerPlugin(ScrollTrigger);

// Four acts, one continuous "camera push" through the house. Each act pairs
// a real photo with a few gold/navy line accents so it still reads as the
// Amrut brand rather than generic stock. Swap PHOTO urls for real
// site/project photography whenever it's available — nothing else changes.
const ACTS = [
  {
    key: 'exterior',
    eyebrow: 'Since 2007',
    title: 'A name Sangli has trusted for two decades.',
    body: 'Every project starts the same way — a plot, a plan, and a family who will call it home.',
    photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80',
  },
  {
    key: 'gate',
    eyebrow: 'Step inside',
    title: 'Every approval checked before you sign anything.',
    body: 'RERA-registered, title-clear, and walked through in person before it ever reaches a brochure.',
    photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80',
  },
  {
    key: 'living',
    eyebrow: 'Living room',
    title: 'Spaces planned around how a family actually lives.',
    body: 'Light, layout and proportion, decided before a single wall goes up.',
    photo: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80',
  },
  {
    key: 'rooms',
    eyebrow: 'Your dream property',
    title: 'Your dream property, our commitment.',
    body: 'Plotting, residential, commercial and investment consultancy — under one name.',
    photo: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=80',
    isFinal: true,
  },
];

export default function HouseJourney() {
  const wrapRef = useRef(null);
  const sceneRefs = useRef([]);
  const textRefs = useRef([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const scenes = sceneRefs.current;
    const texts = textRefs.current;
    if (!wrap || scenes.some((s) => !s)) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.set(scenes, { autoAlpha: 0, scale: 1.08 });
        gsap.set(scenes[0], { autoAlpha: 1, scale: 1 });
        gsap.set(texts, { autoAlpha: 0, y: 18 });
        gsap.set(texts[0], { autoAlpha: 1, y: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: `+=${ACTS.length * 900}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
        });

        ACTS.forEach((_, i) => {
          if (i === 0) return;
          const prevScene = scenes[i - 1];
          const scene = scenes[i];
          const prevText = texts[i - 1];
          const text = texts[i];
          const label = `act${i}`;

          tl.addLabel(label)
            .to(prevScene, { autoAlpha: 0, scale: 0.94, duration: 1 }, label)
            .to(prevText, { autoAlpha: 0, y: -14, duration: 0.6 }, label)
            .fromTo(
              scene,
              { autoAlpha: 0, scale: 1.08 },
              { autoAlpha: 1, scale: 1, duration: 1 },
              label
            )
            .fromTo(
              text,
              { autoAlpha: 0, y: 18 },
              { autoAlpha: 1, y: 0, duration: 0.6 },
              `${label}+=0.45`
            );
        });
      }, wrap);

      return () => ctx.revert();
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(scenes, { autoAlpha: 0 });
      gsap.set(scenes[scenes.length - 1], { autoAlpha: 1 });
      gsap.set(texts, { autoAlpha: 0 });
      gsap.set(texts[texts.length - 1], { autoAlpha: 1 });
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="journey" ref={wrapRef}>
      <div className="journey-stage">
        {ACTS.map((act, i) => (
          <div
            className="journey-scene"
            key={act.key}
            ref={(el) => (sceneRefs.current[i] = el)}
            style={{
              backgroundImage: `url(${act.photo})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <svg
              viewBox="0 0 1200 800"
              preserveAspectRatio="none"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            >
              <SceneAccent index={i} />
            </svg>
          </div>
        ))}

        <div className="journey-overlay" />

        {ACTS.map((act, i) => (
          <div
            className={`journey-text ${act.isFinal ? 'journey-text-final' : ''}`}
            key={act.key}
            ref={(el) => (textRefs.current[i] = el)}
          >
            <p className="journey-eyebrow">{act.eyebrow}</p>
            <h2>{act.title}</h2>
            <p className="journey-body">{act.body}</p>
            {act.isFinal && (
              <a href="#contact" className="btn-gold">Explore projects</a>
            )}
          </div>
        ))}

        <div className="journey-progress">
          {ACTS.map((act) => (
            <span key={act.key} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Thin gold/navy accents drawn over each photo ------------------------
// Keeps the brand's hand visible on top of stock photography — a corner
// frame, a roofline mark, a room-divider line — swappable independent of
// the photo itself.

function SceneAccent({ index }) {
  switch (index) {
    case 0:
      return (
        <g stroke="var(--gold)" strokeWidth="3" fill="none" opacity="0.9">
          <path d="M40 40 L40 120" />
          <path d="M40 40 L120 40" />
          <path d="M1160 760 L1160 680" />
          <path d="M1160 760 L1080 760" />
          <path d="M60 700 L60 660 L110 630 L160 660 L160 700" strokeWidth="2.5" />
        </g>
      );
    case 1:
      return (
        <g stroke="var(--gold-light)" strokeWidth="3" fill="none" opacity="0.9">
          <rect x="470" y="80" width="260" height="640" rx="4" opacity="0.7" />
          <path d="M470 80 Q600 30 730 80" />
        </g>
      );
    case 2:
      return (
        <g stroke="var(--gold)" strokeWidth="2.5" fill="none" opacity="0.85">
          <line x1="40" y1="40" x2="40" y2="760" opacity="0.3" />
          <line x1="1160" y1="40" x2="1160" y2="760" opacity="0.3" />
          <circle cx="1080" cy="120" r="34" />
        </g>
      );
    case 3:
    default:
      return (
        <g stroke="var(--gold)" strokeWidth="3" fill="none" opacity="0.9">
          <path d="M540 700 L600 640 L660 700" />
          <path d="M40 760 L1160 760" opacity="0.4" strokeWidth="2" />
        </g>
      );
  }
}