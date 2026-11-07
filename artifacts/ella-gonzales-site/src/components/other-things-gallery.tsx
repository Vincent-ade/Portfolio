import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

type DrumSound = 'kick' | 'snare' | 'hat';
type CraftKind = 'editing' | 'design' | 'music' | 'photography';

type OtherThing = {
  index: string;
  kind: CraftKind;
  title: string;
  line: string;
  annotation: string;
  mediaPath?: string;
  mediaAlt?: string;
  steps?: DrumSound[];
};

const otherThings: OtherThing[] = [
  {
    index: '01',
    kind: 'editing',
    title: 'Video editing',
    line: 'Cutting toward the feeling of a story.',
    annotation: 'take 3',
    mediaPath: '/images/capcut-editing.png',
    mediaAlt: 'CapCut editing workspace with video and audio tracks on the timeline',
  },
  {
    index: '02',
    kind: 'design',
    title: 'Graphic design',
    line: 'Giving ideas a visual voice and point of view.',
    annotation: 'keep this one',
  },
  {
    index: '03',
    kind: 'music',
    title: 'Music and drums',
    line: 'I play drums, always listening for the pocket.',
    annotation: 'off beat, on purpose',
    steps: ['kick', 'hat', 'hat', 'snare', 'hat', 'kick', 'hat', 'snare', 'kick', 'hat', 'hat', 'snare', 'hat', 'kick', 'hat', 'snare'],
  },
  {
    index: '04',
    kind: 'photography',
    title: 'Photography',
    line: 'Looking closely at ordinary light and passing moments.',
    annotation: 'wait for the light',
    mediaPath: '/images/photography.jpg',
    mediaAlt: 'Close-up photograph of a hand wearing a diamond ring in warm light',
  },
];

const CHAPTER_COUNT = otherThings.length;

function formatTimecode(progress: number) {
  const totalFrames = Math.round(Math.max(0, Math.min(1, progress)) * (12 * 24 + 8));
  const seconds = Math.floor(totalFrames / 24);
  const frames = totalFrames % 24;
  return `00:00:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
}

function synthesizeDrumHit(context: AudioContext, sound: DrumSound) {
  const now = context.currentTime;

  if (sound === 'kick') {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(145, now);
    oscillator.frequency.exponentialRampToValueAtTime(42, now + 0.14);
    gain.gain.setValueAtTime(0.78, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.21);
    return;
  }

  const duration = sound === 'snare' ? 0.19 : 0.055;
  const frameCount = Math.max(1, Math.floor(context.sampleRate * duration));
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const noise = buffer.getChannelData(0);
  for (let frame = 0; frame < frameCount; frame += 1) noise[frame] = Math.random() * 2 - 1;

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = buffer;
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(sound === 'snare' ? 1150 : 6800, now);
  gain.gain.setValueAtTime(sound === 'snare' ? 0.34 : 0.16, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  source.start(now);
  source.stop(now + duration);
}

function EditingVisual({
  thing,
  progress,
  active,
  staticLayout,
  onJumpCut,
}: {
  thing: OtherThing;
  progress: MotionValue<number>;
  active: boolean;
  staticLayout: boolean;
  onJumpCut: () => void;
}) {
  const previousBoundary = useRef(0);
  const timecode = useTransform(progress, formatTimecode);
  const imageScale = useTransform(progress, [0, 1], [1.035, 1.12]);
  const imageX = useTransform(progress, [0, 1], [0, -12]);
  const imageY = useTransform(progress, [0, 1], [5, -5]);

  useMotionValueEvent(progress, 'change', (value) => {
    const boundary = Math.floor(value * 4);
    if (active && boundary > previousBoundary.current) onJumpCut();
    previousBoundary.current = boundary;
  });

  return (
    <div className="vincent-craft-editing" data-cursor-label="play">
      <div className="vincent-edit-frame">
        {thing.mediaPath && <motion.img src={thing.mediaPath} width="1368" height="768" alt={thing.mediaAlt ?? ''} loading="lazy" decoding="async" style={staticLayout ? undefined : { scale: imageScale, x: imageX, y: imageY }} />}
        <span className="vincent-edit-frame-mark" aria-hidden="true">REC / 01</span>
      </div>
      <div className="vincent-timeline-head"><span>VINCENT / SEQUENCE 01</span><span className="vincent-timecode"><motion.span>{timecode}</motion.span> <span>24 FPS</span></span></div>
      <div className="vincent-film-timeline" aria-label="Film-editing timeline">
        <div className="vincent-timeline-ruler" aria-hidden="true"><span>00:00</span><span>00:04</span><span>00:08</span><span>00:12</span></div>
        <div className="vincent-timeline-row"><span>V1</span><div className="vincent-timeline-track"><i className="is-clay" /><i className="is-ink" /><i className="is-clay is-short" /><i className="is-ink is-short" /></div></div>
        <div className="vincent-timeline-row"><span>V2</span><div className="vincent-timeline-track"><i className="is-ink is-short" /><i className="is-clay is-long" /><i className="is-ink" /></div></div>
        <div className="vincent-timeline-row"><span>A1</span><div className="vincent-timeline-track vincent-audio-wave"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div>
        <motion.div className="vincent-playhead" aria-hidden="true" style={{ scaleX: progress }} />
      </div>
      <span className="vincent-edit-annotation">{thing.annotation}</span>
    </div>
  );
}

function DesignVisual({ thing, progress, staticLayout }: { thing: OtherThing; progress: MotionValue<number>; staticLayout: boolean }) {
  const scale = useTransform(progress, [0, 1], [0.78, 1.04]);
  const rotate = useTransform(progress, [0, 1], [-3, 1.5]);
  const offsetY = useTransform(progress, [0, 1], [14, -8]);

  return (
    <div className="vincent-design-board" tabIndex={0} aria-label="Design study; focus or hover to reveal layout guides" data-cursor-label="cut">
      <span className="vincent-crop-mark is-top-left" aria-hidden="true" /><span className="vincent-crop-mark is-top-right" aria-hidden="true" />
      <span className="vincent-crop-mark is-bottom-left" aria-hidden="true" /><span className="vincent-crop-mark is-bottom-right" aria-hidden="true" />
      <div className="vincent-design-grid" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      <div className="vincent-design-guides" aria-hidden="true"><span>BASELINE / 08</span><span>TYPE SCALE / 1.618</span><i /><i /></div>
      <motion.span className="vincent-design-letter" aria-hidden="true" style={staticLayout ? undefined : { scale, rotate, y: offsetY }}>Aa</motion.span>
      <div className="vincent-design-swatches" aria-label="Site color palette"><i /><i /><i /></div>
      <span className="vincent-design-annotation">{thing.annotation}</span>
    </div>
  );
}

function DrumSequencer({
  thing,
  progress,
  active,
  staticLayout,
}: {
  thing: OtherThing;
  progress: MotionValue<number>;
  active: boolean;
  staticLayout: boolean;
}) {
  const steps = thing.steps ?? [];
  const [activeStep, setActiveStep] = useState(0);
  const [hitStep, setHitStep] = useState<number | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const audioContext = useRef<AudioContext | null>(null);
  const audioUnlocked = useRef(false);
  const hitTimer = useRef<number | null>(null);

  useMotionValueEvent(progress, 'change', (value) => {
    if (!staticLayout && active) {
      setActiveStep(Math.min(steps.length - 1, Math.floor(value * steps.length)));
    }
  });

  useEffect(() => () => {
    if (hitTimer.current !== null) window.clearTimeout(hitTimer.current);
    void audioContext.current?.close();
  }, []);

  const playStep = (sound: DrumSound) => {
    if (typeof window.AudioContext === 'undefined') {
      setAudioAvailable(false);
      return false;
    }

    try {
      const context = audioContext.current ?? new window.AudioContext();
      audioContext.current = context;
      const play = () => synthesizeDrumHit(context, sound);
      if (context.state === 'suspended') void context.resume().then(play).catch(() => setAudioAvailable(false));
      else play();
      return true;
    } catch {
      setAudioAvailable(false);
      return false;
    }
  };

  const handlePadClick = (stepIndex: number) => {
    const sound = steps[stepIndex];
    if (!sound || !audioAvailable) return;
    setActiveStep(stepIndex);
    setHitStep(stepIndex);
    if (hitTimer.current !== null) window.clearTimeout(hitTimer.current);
    hitTimer.current = window.setTimeout(() => setHitStep(null), 140);

    if (!audioUnlocked.current) {
      audioUnlocked.current = true;
      if (playStep(sound)) setSoundOn(true);
      return;
    }
    if (soundOn) playStep(sound);
  };

  const toggleSound = () => {
    if (!audioAvailable) return;
    audioUnlocked.current = true;
    setSoundOn((enabled) => !enabled);
  };

  return (
    <div className="vincent-drum-machine" data-cursor-label="play">
      <div className="vincent-sequencer-labels"><span>STEP SEQUENCER / 16</span><span>{staticLayout ? 'TAP A PAD' : 'SCROLL TO MOVE'}</span></div>
      <div className="vincent-sequencer" role="group" aria-label="16-step drum sequencer">
        {steps.map((sound, index) => {
          const current = index === activeStep;
          const hit = index === hitStep;
          return (
            <button
              key={index}
              type="button"
              className={`vincent-sequencer-pad is-${sound}${current ? ' is-current' : ''}${hit ? ' is-hit' : ''}`}
              aria-label={`Step ${index + 1}, ${sound === 'hat' ? 'hi-hat' : sound}; play ${sound === 'hat' ? 'hi-hat' : sound} sound`}
              aria-current={current ? 'step' : undefined}
              disabled={!active && !staticLayout}
              onClick={() => handlePadClick(index)}
            ><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></button>
          );
        })}
      </div>
      <div className="vincent-drum-footer">
        <span className="vincent-drum-hint" aria-live="polite">{audioAvailable ? soundOn ? 'Sound on · tap any step' : 'Sound off · tap a step to play' : 'Audio is not available in this browser'}</span>
        <button className="vincent-sound-toggle" type="button" aria-pressed={soundOn} aria-label={soundOn ? 'Mute drum sounds' : 'Enable drum sounds'} disabled={!audioAvailable} onClick={toggleSound}>
          {soundOn ? <Volume2 aria-hidden="true" size={15} /> : <VolumeX aria-hidden="true" size={15} />}
          <span>{soundOn ? 'Sound on' : 'Sound off'}</span>
        </button>
      </div>
      <span className="vincent-drum-annotation">{thing.annotation}</span>
    </div>
  );
}

function PhotographyVisual({ thing, progress, staticLayout }: { thing: OtherThing; progress: MotionValue<number>; staticLayout: boolean }) {
  const developFilter = useTransform(progress, [0, 1], ['blur(9px) brightness(.46)', 'blur(0px) brightness(1)']);
  const lightLeakOpacity = useTransform(progress, [0, 0.5, 1], [0.2, 0.12, 0.04]);
  const aperture = useTransform(progress, (value) => `f/${(1.8 + (1 - value) * 2).toFixed(1)}`);
  const shutter = useTransform(progress, (value) => `1/${Math.round(250 + (1 - value) * 500)}`);
  const iso = useTransform(progress, (value) => String(Math.round(200 + (1 - value) * 800)));

  return (
    <div className="vincent-photo-rig" data-cursor-label="focus">
      <div className="vincent-photo-print">
        {thing.mediaPath && <motion.img src={thing.mediaPath} width="900" height="600" alt={thing.mediaAlt ?? ''} loading="lazy" decoding="async" style={staticLayout ? undefined : { filter: developFilter }} />}
        <motion.span className="vincent-photo-light-leak" aria-hidden="true" style={staticLayout ? undefined : { opacity: lightLeakOpacity }} />
        <svg className="vincent-photo-grain" viewBox="0 0 180 120" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <filter id="vincent-photo-noise"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch" /></filter>
          <rect width="100%" height="100%" filter="url(#vincent-photo-noise)" opacity=".13" />
        </svg>
        <span className="vincent-focus-box" aria-hidden="true" />
        <div className="vincent-viewfinder-corners" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="vincent-exposure" aria-label="Exposure settings">
          <span>{staticLayout ? 'f/1.8' : <motion.span>{aperture}</motion.span>}</span>
          <span>{staticLayout ? '1/250' : <motion.span>{shutter}</motion.span>}</span>
          <span>ISO {staticLayout ? '200' : <motion.span>{iso}</motion.span>}</span>
        </div>
      </div>
      <span className="vincent-photo-annotation">{thing.annotation}</span>
    </div>
  );
}

function ChapterArtwork({
  thing,
  progress,
  active,
  staticLayout,
  onJumpCut,
}: {
  thing: OtherThing;
  progress: MotionValue<number>;
  active: boolean;
  staticLayout: boolean;
  onJumpCut: () => void;
}) {
  if (thing.kind === 'editing') return <EditingVisual thing={thing} progress={progress} active={active} staticLayout={staticLayout} onJumpCut={onJumpCut} />;
  if (thing.kind === 'design') return <DesignVisual thing={thing} progress={progress} staticLayout={staticLayout} />;
  if (thing.kind === 'music') return <DrumSequencer thing={thing} progress={progress} active={active} staticLayout={staticLayout} />;
  return <PhotographyVisual thing={thing} progress={progress} staticLayout={staticLayout} />;
}

function CraftChapter({
  thing,
  chapterIndex,
  progress,
  activeIndex,
  onJumpCut,
}: {
  thing: OtherThing;
  chapterIndex: number;
  progress: MotionValue<number>;
  activeIndex: number;
  onJumpCut: () => void;
}) {
  const start = chapterIndex / CHAPTER_COUNT;
  const end = (chapterIndex + 1) / CHAPTER_COUNT;
  const enter = Math.max(0, start - 0.045);
  const reveal = Math.min(1, start + 0.045);
  const settle = Math.max(reveal, end - 0.045);
  const exit = Math.min(1, end + 0.045);
  const isActive = chapterIndex === activeIndex;
  const opacity = useTransform(progress, (value) => {
    if (chapterIndex === 0 && value <= reveal) return 1;
    if (chapterIndex === CHAPTER_COUNT - 1 && value >= settle) return 1;
    if (value <= enter || value >= exit) return 0;
    if (value <= reveal) return (value - enter) / (reveal - enter);
    if (value <= settle) return 1;
    return 1 - (value - settle) / (exit - settle);
  });
  const clipPath = useTransform(progress, (value) => {
    if ((chapterIndex === 0 && value <= reveal) || (chapterIndex === CHAPTER_COUNT - 1 && value >= settle)) return 'inset(0)';
    if (value <= enter || value >= exit) return 'inset(0 100% 0 0)';
    if (value <= reveal) return `inset(0 ${(1 - (value - enter) / (reveal - enter)) * 100}% 0 0)`;
    if (value <= settle) return 'inset(0)';
    return `inset(0 ${((value - settle) / (exit - settle)) * 100}% 0 0)`;
  });
  const localProgress = useTransform(progress, [start, end], [0, 1]);
  const titleMask = useTransform(localProgress, [0, 0.14], ['inset(0 0 100% 0)', 'inset(0)']);
  const titleRise = useTransform(localProgress, [0, 0.14], [18, 0]);

  return (
    <motion.article
      className={`vincent-craft-chapter is-${thing.kind}`}
      aria-hidden={isActive ? undefined : true}
      style={{ opacity, clipPath, zIndex: chapterIndex + 1, pointerEvents: isActive ? 'auto' : 'none' }}
    >
      <div className="vincent-craft-copy">
        <span className="vincent-craft-index">{thing.index} <span>/ 04</span></span>
        <motion.h3 style={{ clipPath: titleMask, y: titleRise }}>{thing.title}</motion.h3>
        <p>{thing.line}</p>
      </div>
      <div className="vincent-craft-artwork">
        <ChapterArtwork thing={thing} progress={localProgress} active={isActive} staticLayout={false} onJumpCut={onJumpCut} />
      </div>
    </motion.article>
  );
}

function StaticCraftChapter({ thing, index, reduceMotion }: { thing: OtherThing; index: number; reduceMotion: boolean }) {
  const chapterRef = useRef<HTMLElement>(null);
  const { scrollYProgress: progress } = useScroll({ target: chapterRef, offset: ['start end', 'end start'] });
  const noJumpCut = () => undefined;

  return (
    <motion.article
      ref={chapterRef}
      className={`vincent-craft-static-chapter is-${thing.kind}`}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: reduceMotion ? 0 : 0.52, delay: reduceMotion ? 0 : index * 0.12 }}
    >
      <div className="vincent-static-chapter-copy">
        <span className="vincent-craft-index">{thing.index} <span>/ 04</span></span>
        <h3>{thing.title}</h3>
        <p>{thing.line}</p>
        <span className="vincent-craft-annotation">{thing.annotation}</span>
      </div>
      <div className="vincent-craft-static-artwork">
        <ChapterArtwork thing={thing} progress={progress} active staticLayout={reduceMotion} onJumpCut={noJumpCut} />
      </div>
    </motion.article>
  );
}

export function OtherThingsGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorPoint = useRef({ x: 0, y: 0 });
  const cursorFrame = useRef<number | null>(null);
  const lastJumpCut = useRef(0);
  const jumpCutTimer = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches);
  const [cursorLabel, setCursorLabel] = useState('move');
  const [cursorVisible, setCursorVisible] = useState(false);
  const [jumpCut, setJumpCut] = useState(false);
  const reduceMotion = Boolean(useReducedMotion());
  const staticLayout = reduceMotion;
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const { scrollYProgress: introProgress } = useScroll({ target: headingRef, offset: ['start 0.92', 'center 0.48'] });
  const headingClip = useTransform(introProgress, [0, 0.9], ['inset(0 100% 0 0)', 'inset(0)']);
  const headingRise = useTransform(introProgress, [0, 0.9], [22, 0]);
  const introClip = useTransform(introProgress, [0.12, 0.92], ['inset(0 0 100% 0)', 'inset(0)']);
  const introOpacity = useTransform(introProgress, [0.12, 0.7], [0.35, 1]);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)');
    const updateLayout = () => setIsMobile(query.matches);
    query.addEventListener('change', updateLayout);
    return () => query.removeEventListener('change', updateLayout);
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const nextIndex = Math.min(CHAPTER_COUNT - 1, Math.floor(value * CHAPTER_COUNT));
    setActiveIndex((current) => current === nextIndex ? current : nextIndex);
  });

  useEffect(() => () => {
    if (cursorFrame.current !== null) window.cancelAnimationFrame(cursorFrame.current);
    if (jumpCutTimer.current !== null) window.clearTimeout(jumpCutTimer.current);
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (isMobile || staticLayout || event.pointerType !== 'mouse') return;
    const section = sectionRef.current;
    if (!section) return;

    const bounds = section.getBoundingClientRect();
    cursorPoint.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    const target = event.target as HTMLElement;
    const label = target.closest<HTMLElement>('[data-cursor-label]')?.dataset.cursorLabel ?? 'move';
    setCursorLabel((current) => current === label ? current : label);
    setCursorVisible(true);

    if (cursorFrame.current !== null) return;
    cursorFrame.current = window.requestAnimationFrame(() => {
      cursorRef.current?.style.setProperty('--cursor-x', `${cursorPoint.current.x}px`);
      cursorRef.current?.style.setProperty('--cursor-y', `${cursorPoint.current.y}px`);
      cursorFrame.current = null;
    });
  };

  const requestJumpCut = () => {
    const now = performance.now();
    if (now - lastJumpCut.current < 380) return;
    lastJumpCut.current = now;
    setJumpCut(true);
    if (jumpCutTimer.current !== null) window.clearTimeout(jumpCutTimer.current);
    jumpCutTimer.current = window.setTimeout(() => setJumpCut(false), 120);
  };

  const activeThing = otherThings[activeIndex];

  return (
    <section
      ref={sectionRef}
      className={`vincent-section vincent-creative${staticLayout ? ' is-static' : ''}`}
      id="creative"
      aria-labelledby="creative-heading"
      onPointerEnter={(event) => { if (!isMobile && !staticLayout && event.pointerType === 'mouse') setCursorVisible(true); }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setCursorVisible(false)}
    >
      <div className="vincent-creative-inner">
        <motion.div className="vincent-creative-heading" ref={headingRef}>
          <motion.p className="vincent-section-label" style={reduceMotion ? undefined : { opacity: introOpacity }}>Outside the usual frame</motion.p>
          <motion.h2 id="creative-heading" style={reduceMotion ? undefined : { clipPath: headingClip, y: headingRise }}>Other things I do.</motion.h2>
          <motion.p className="vincent-creative-intro" style={reduceMotion ? undefined : { clipPath: introClip, opacity: introOpacity }}>Some days I cut a story. Some days I keep time. Always looking closer.</motion.p>
        </motion.div>

        {staticLayout ? (
          <div className="vincent-craft-static-list">
            {otherThings.map((thing, index) => <StaticCraftChapter key={thing.index} thing={thing} index={index} reduceMotion={reduceMotion} />)}
          </div>
        ) : (
          <div className="vincent-craft-scroll-track" ref={trackRef}>
            <div className="vincent-craft-pin">
              <div className="vincent-craft-pin-inner">
                <div className="vincent-craft-status">
                  <span>MAKING, IN MOTION</span>
                  <span className="vincent-craft-current" aria-live="polite" aria-atomic="true"><b>{activeThing.index}</b><span>/ 04</span><i>{activeThing.title}</i></span>
                </div>
                <div className="vincent-craft-progress" role="progressbar" aria-label="Creative chapter progress" aria-valuemin={1} aria-valuemax={CHAPTER_COUNT} aria-valuenow={activeIndex + 1} aria-valuetext={`Chapter ${activeIndex + 1} of ${CHAPTER_COUNT}: ${activeThing.title}`}>
                  <motion.span style={{ scaleX: scrollYProgress }} />
                </div>
                <div className={`vincent-craft-stage${jumpCut ? ' is-jump-cut' : ''}`} aria-label="Scroll through four creative chapters">
                  {otherThings.map((thing, index) => <CraftChapter key={thing.index} thing={thing} chapterIndex={index} progress={scrollYProgress} activeIndex={activeIndex} onJumpCut={requestJumpCut} />)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div ref={cursorRef} className={`vincent-craft-cursor${cursorVisible && !isMobile && !staticLayout ? ' is-visible' : ''}`} aria-hidden="true"><span>{cursorLabel}</span></div>
    </section>
  );
}