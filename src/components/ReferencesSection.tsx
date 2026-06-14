import { useCallback, useEffect, useRef } from 'react';
import { referenceProfiles } from '../data/references';
import './ReferencesSection.css';

const wrapOffset = (offset: number, width: number) => ((offset % width) + width) % width;

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );
}

function ReferenceGroup({ duplicate, groupRef }: { duplicate: boolean; groupRef?: React.RefObject<HTMLDivElement> }) {
  return (
    <div
      className="references-group"
      ref={groupRef}
      role={duplicate ? undefined : 'list'}
      aria-hidden={duplicate ? 'true' : undefined}
    >
      {referenceProfiles.map((profile, index) => (
        <article className="reference-card" role={duplicate ? undefined : 'listitem'} key={`${duplicate ? 'copy' : 'original'}-${profile.name}`}>
          <div className="reference-card__photo">
            <img
              src={profile.image}
              alt={duplicate ? '' : profile.name}
              width="720"
              height="900"
              loading={!duplicate && index < 3 ? 'eager' : 'lazy'}
              decoding="async"
              draggable="false"
            />
          </div>
          <div className="reference-card__content">
            <h3>{profile.name}</h3>
            <p>{profile.credential}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function ReferencesSection() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstGroupRef = useRef<HTMLDivElement>(null);
  const groupWidthRef = useRef(0);
  const offsetRef = useRef(0);
  const nudgeRemainingRef = useRef(0);
  const reduceMotionRef = useRef(false);

  const applyPosition = useCallback(() => {
    const track = trackRef.current;
    const width = groupWidthRef.current;
    if (!track || width <= 0) return;

    offsetRef.current = wrapOffset(offsetRef.current, width);
    track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const firstGroup = firstGroupRef.current;
    if (!viewport || !firstGroup) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotionPreference = () => {
      reduceMotionRef.current = motionQuery.matches;
      if (motionQuery.matches) nudgeRemainingRef.current = 0;
    };
    syncMotionPreference();
    motionQuery.addEventListener('change', syncMotionPreference);

    const measure = () => {
      const previousWidth = groupWidthRef.current;
      const nextWidth = firstGroup.offsetWidth;
      if (nextWidth <= 0) return;

      if (previousWidth > 0) offsetRef.current = (offsetRef.current / previousWidth) * nextWidth;
      groupWidthRef.current = nextWidth;
      applyPosition();
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(firstGroup);
    resizeObserver.observe(viewport);
    measure();

    let frame = 0;
    let previousTime = performance.now();
    const animate = (time: number) => {
      const elapsed = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      if (groupWidthRef.current > 0) {
        const autoplaySpeed = viewport.clientWidth <= 720 ? 16 : 20;
        const autoplayDelta = reduceMotionRef.current ? 0 : autoplaySpeed * elapsed;
        const easing = 1 - Math.exp(-7 * elapsed);
        const manualDelta = nudgeRemainingRef.current * easing;

        if (autoplayDelta !== 0 || manualDelta !== 0) {
          offsetRef.current += autoplayDelta + manualDelta;
          nudgeRemainingRef.current -= manualDelta;
          if (Math.abs(nudgeRemainingRef.current) < 0.5) nudgeRemainingRef.current = 0;
          applyPosition();
        }
      }

      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      motionQuery.removeEventListener('change', syncMotionPreference);
    };
  }, [applyPosition]);

  const move = (direction: -1 | 1) => {
    const width = groupWidthRef.current;
    if (width <= 0) return;

    const viewportWidth = viewportRef.current?.clientWidth ?? 360;
    const step = Math.min(Math.max(viewportWidth * 0.48, 220), 560);

    if (reduceMotionRef.current) {
      offsetRef.current += direction * step;
      applyPosition();
      return;
    }

    nudgeRemainingRef.current += direction * step;
  };

  return (
    <section className="references-section" aria-labelledby="references-title">
      <div className="references-section__header">
        <div>
          <p className="references-section__eyebrow">Conhecimento que deixa legado</p>
          <h2 id="references-title">Referências que fazem parte da nossa trajetória:</h2>
        </div>
        <div className="references-section__controls" aria-label="Controles do carrossel de referências">
          <button type="button" onClick={() => move(-1)} aria-label="Ver referências anteriores">
            <ArrowIcon direction="left" />
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Ver próximas referências">
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>

      <div
        className="references-carousel"
        ref={viewportRef}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Referências profissionais do Nutriwork"
        aria-describedby="references-help"
      >
        <p className="sr-only" id="references-help">
          Carrossel contínuo. Use os botões de anterior e próxima referência para navegar.
        </p>
        <div className="references-track" ref={trackRef}>
          <ReferenceGroup duplicate={false} groupRef={firstGroupRef} />
          <ReferenceGroup duplicate />
        </div>
      </div>
    </section>
  );
}
