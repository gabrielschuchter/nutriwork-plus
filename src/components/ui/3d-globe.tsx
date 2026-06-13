import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

export interface GlobeMarker {
  lat: number;
  lng: number;
  src: string;
  label?: string;
  size?: number;
}

export interface Globe3DConfig {
  radius?: number;
  globeColor?: string;
  textureUrl?: string;
  bumpMapUrl?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereIntensity?: number;
  atmosphereBlur?: number;
  bumpScale?: number;
  autoRotateSpeed?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
  minDistance?: number;
  maxDistance?: number;
  initialRotation?: { x: number; y: number };
  markerSize?: number;
  showWireframe?: boolean;
  wireframeColor?: string;
  ambientIntensity?: number;
  pointLightIntensity?: number;
  backgroundColor?: string | null;
}

interface Globe3DProps {
  markers?: GlobeMarker[];
  config?: Globe3DConfig;
  className?: string;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

interface ProjectedPoint {
  x: number;
  y: number;
  z: number;
}

interface MarkerPosition extends ProjectedPoint {
  marker: GlobeMarker;
  radius: number;
}

const DEG_TO_RAD = Math.PI / 180;
const TWO_PI = Math.PI * 2;

function project(lat: number, lng: number, rotation: number): ProjectedPoint {
  const latitude = lat * DEG_TO_RAD;
  const longitude = lng * DEG_TO_RAD + rotation;
  const latitudeRadius = Math.cos(latitude);
  return {
    x: latitudeRadius * Math.sin(longitude),
    y: Math.sin(latitude),
    z: latitudeRadius * Math.cos(longitude)
  };
}

function drawWrappedTextureStrip(
  context: CanvasRenderingContext2D,
  texture: HTMLImageElement,
  sourceX: number,
  sourceY: number,
  sourceWidth: number,
  targetX: number,
  targetY: number,
  targetWidth: number,
  targetHeight: number
) {
  const textureWidth = texture.naturalWidth;
  const textureHeight = texture.naturalHeight;
  const start = ((sourceX % textureWidth) + textureWidth) % textureWidth;
  const safeSourceY = Math.max(0, Math.min(textureHeight - 2, sourceY));

  if (start + sourceWidth <= textureWidth) {
    context.drawImage(texture, start, safeSourceY, sourceWidth, 2, targetX, targetY, targetWidth, targetHeight);
    return;
  }

  const firstWidth = textureWidth - start;
  const firstTargetWidth = targetWidth * (firstWidth / sourceWidth);
  context.drawImage(texture, start, safeSourceY, firstWidth, 2, targetX, targetY, firstTargetWidth, targetHeight);
  context.drawImage(
    texture,
    0,
    safeSourceY,
    sourceWidth - firstWidth,
    2,
    targetX + firstTargetWidth,
    targetY,
    targetWidth - firstTargetWidth,
    targetHeight
  );
}

export function Globe3D({
  markers = [],
  config = {},
  className = '',
  onMarkerClick,
  onMarkerHover
}: Globe3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();
  const rotationRef = useRef(config.initialRotation?.y ?? 1.02);
  const markerPositionsRef = useRef<MarkerPosition[]>([]);
  const isVisibleRef = useRef(true);
  const isDraggingRef = useRef(false);
  const pointerXRef = useRef(0);
  const earthTextureRef = useRef<HTMLImageElement>();
  const markerImagesRef = useRef(new Map<string, HTMLImageElement>());
  const [reducedMotion, setReducedMotion] = useState(false);

  const settings = useMemo(() => ({
    atmosphereColor: config.atmosphereColor ?? '#4d8fff',
    atmosphereIntensity: config.atmosphereIntensity ?? 0.34,
    autoRotateSpeed: config.autoRotateSpeed ?? 0.24,
    markerSize: config.markerSize ?? 0.032,
    showAtmosphere: config.showAtmosphere ?? true,
    textureUrl: config.textureUrl ?? '/assets/earth-blue-marble.webp'
  }), [config]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const bounds = container.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, bounds.width < 560 ? 1.25 : 1.6);
    const width = Math.round(bounds.width * pixelRatio);
    const height = Math.round(bounds.height * pixelRatio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const context = canvas.getContext('2d');
    if (!context) return;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, bounds.width, bounds.height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    const centerX = bounds.width * 0.5;
    const centerY = bounds.height * 0.86;
    const radius = Math.min(bounds.width * 0.56, bounds.height * 0.76);
    const rotation = rotationRef.current;

    if (settings.showAtmosphere) {
      const atmosphere = context.createRadialGradient(centerX, centerY, radius * 0.86, centerX, centerY, radius * 1.1);
      atmosphere.addColorStop(0, 'transparent');
      atmosphere.addColorStop(0.72, 'transparent');
      atmosphere.addColorStop(0.9, settings.atmosphereColor + '28');
      atmosphere.addColorStop(1, 'transparent');
      context.globalAlpha = settings.atmosphereIntensity;
      context.fillStyle = atmosphere;
      context.fillRect(centerX - radius * 1.16, centerY - radius * 1.16, radius * 2.32, radius * 2.32);
      context.globalAlpha = 1;
    }

    context.save();
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, TWO_PI);
    context.clip();

    const texture = earthTextureRef.current;
    if (texture?.complete && texture.naturalWidth) {
      const textureSpan = texture.naturalWidth / 2;
      const textureCenter = (((0.5 - rotation / TWO_PI) % 1 + 1) % 1) * texture.naturalWidth;
      const stripHeight = bounds.width < 560 ? 2.5 : 2;
      context.filter = 'saturate(.82) contrast(1.12) brightness(.72)';

      for (let offsetY = -radius; offsetY <= radius; offsetY += stripHeight) {
        const normalizedY = -offsetY / radius;
        const latitude = Math.asin(Math.max(-1, Math.min(1, normalizedY)));
        const chord = radius * Math.cos(latitude);
        if (chord < 0.5) continue;
        const sourceY = (0.5 - latitude / Math.PI) * texture.naturalHeight;
        drawWrappedTextureStrip(
          context,
          texture,
          textureCenter - textureSpan / 2,
          sourceY,
          textureSpan,
          centerX - chord,
          centerY + offsetY,
          chord * 2,
          stripHeight + 0.6
        );
      }
      context.filter = 'none';
    } else {
      const fallback = context.createRadialGradient(centerX - radius * 0.32, centerY - radius * 0.38, 0, centerX, centerY, radius);
      fallback.addColorStop(0, '#173255');
      fallback.addColorStop(0.62, '#071426');
      fallback.addColorStop(1, '#01040a');
      context.fillStyle = fallback;
      context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
    }

    const lighting = context.createRadialGradient(
      centerX - radius * 0.38,
      centerY - radius * 0.42,
      radius * 0.06,
      centerX + radius * 0.06,
      centerY + radius * 0.08,
      radius * 1.16
    );
    lighting.addColorStop(0, 'rgba(165,205,255,.12)');
    lighting.addColorStop(0.42, 'rgba(5,13,28,.04)');
    lighting.addColorStop(0.72, 'rgba(1,5,14,.34)');
    lighting.addColorStop(1, 'rgba(0,2,8,.9)');
    context.fillStyle = lighting;
    context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

    const edgeShade = context.createRadialGradient(centerX, centerY, radius * 0.62, centerX, centerY, radius);
    edgeShade.addColorStop(0, 'transparent');
    edgeShade.addColorStop(0.76, 'rgba(0,4,12,.06)');
    edgeShade.addColorStop(1, 'rgba(0,3,10,.62)');
    context.fillStyle = edgeShade;
    context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
    context.restore();

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, TWO_PI);
    context.strokeStyle = 'rgba(84, 139, 230, .42)';
    context.lineWidth = 1;
    context.stroke();

    const markerPositions = markers
      .map((marker) => ({ marker, ...project(marker.lat, marker.lng, rotation) }))
      .filter((marker) => marker.z > 0.16)
      .sort((a, b) => a.z - b.z)
      .map((point) => {
        const surfaceX = centerX + point.x * radius;
        const surfaceY = centerY - point.y * radius;
        const directionX = surfaceX - centerX;
        const directionY = surfaceY - centerY;
        const directionLength = Math.max(1, Math.hypot(directionX, directionY));
        const lift = 8 + point.z * 5;
        return {
          ...point,
          x: surfaceX + (directionX / directionLength) * lift,
          y: surfaceY + (directionY / directionLength) * lift,
          radius: Math.max(5.5, (point.marker.size ?? settings.markerSize) * radius) * (0.84 + point.z * 0.16),
          surfaceX,
          surfaceY
        };
      });

    markerPositions.forEach((position) => {
      const image = markerImagesRef.current.get(position.marker.src);
      context.beginPath();
      context.moveTo(position.surfaceX, position.surfaceY);
      context.lineTo(position.x, position.y);
      context.strokeStyle = 'rgba(167, 199, 244, .58)';
      context.lineWidth = 0.7;
      context.stroke();

      context.save();
      context.shadowColor = 'rgba(37, 112, 255, .5)';
      context.shadowBlur = 6;
      context.beginPath();
      context.arc(position.x, position.y, position.radius + 1.6, 0, TWO_PI);
      context.fillStyle = '#dce9ff';
      context.fill();
      context.shadowBlur = 0;
      context.beginPath();
      context.arc(position.x, position.y, position.radius, 0, TWO_PI);
      context.clip();
      if (image?.complete && image.naturalWidth) {
        const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
        const sourceX = (image.naturalWidth - sourceSize) / 2;
        const sourceY = (image.naturalHeight - sourceSize) / 2;
        context.drawImage(
          image,
          sourceX,
          sourceY,
          sourceSize,
          sourceSize,
          position.x - position.radius,
          position.y - position.radius,
          position.radius * 2,
          position.radius * 2
        );
      } else {
        context.fillStyle = '#4c7fc8';
        context.fill();
      }
      context.restore();
    });

    markerPositionsRef.current = markerPositions;
  }, [markers, settings]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const texture = new Image();
    texture.decoding = 'async';
    texture.src = settings.textureUrl;
    texture.addEventListener('load', draw, { once: true });
    earthTextureRef.current = texture;
    return () => texture.removeEventListener('load', draw);
  }, [draw, settings.textureUrl]);

  useEffect(() => {
    markers.forEach((marker) => {
      if (markerImagesRef.current.has(marker.src)) return;
      const image = new Image();
      image.decoding = 'async';
      image.src = marker.src;
      image.addEventListener('load', draw, { once: true });
      markerImagesRef.current.set(marker.src, image);
    });
  }, [draw, markers]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver(draw);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { rootMargin: '120px' });
    resizeObserver.observe(container);
    intersectionObserver.observe(container);

    let previousTime = performance.now();
    const animate = (time: number) => {
      const elapsed = time - previousTime;
      if (elapsed >= 30) {
        previousTime = time;
        if (isVisibleRef.current && !isDraggingRef.current) {
          rotationRef.current += (elapsed / 1000) * settings.autoRotateSpeed * 0.34;
        }
        if (isVisibleRef.current) draw();
      }
      frameRef.current = window.requestAnimationFrame(animate);
    };

    draw();
    if (!reducedMotion && settings.autoRotateSpeed > 0) frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [draw, reducedMotion, settings.autoRotateSpeed]);

  const findMarker = (clientX: number, clientY: number) => {
    const bounds = canvasRef.current?.getBoundingClientRect();
    if (!bounds) return null;
    const x = clientX - bounds.left;
    const y = clientY - bounds.top;
    return [...markerPositionsRef.current].reverse().find((position) => (
      Math.hypot(position.x - x, position.y - y) <= position.radius + 5
    )) ?? null;
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      rotationRef.current += (event.clientX - pointerXRef.current) * 0.006;
      pointerXRef.current = event.clientX;
      draw();
      return;
    }
    onMarkerHover?.(findMarker(event.clientX, event.clientY)?.marker ?? null);
  };

  return (
    <div ref={containerRef} className={`globe-3d ${className}`.trim()}>
      <canvas
        ref={canvasRef}
        aria-label="Globo interativo com regiões da rede de parceiros Nutriwork"
        onClick={(event) => {
          const marker = findMarker(event.clientX, event.clientY);
          if (marker) onMarkerClick?.(marker.marker);
        }}
        onPointerDown={(event) => {
          isDraggingRef.current = true;
          pointerXRef.current = event.clientX;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => {
          isDraggingRef.current = false;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerLeave={() => {
          isDraggingRef.current = false;
          onMarkerHover?.(null);
        }}
      />
    </div>
  );
}

export default Globe3D;
