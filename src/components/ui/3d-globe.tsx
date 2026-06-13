import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
const SPHERE_POINTS = Array.from({ length: 180 }, (_, index) => {
  const y = 1 - (index / 179) * 2;
  const radius = Math.sqrt(1 - y * y);
  const theta = Math.PI * (3 - Math.sqrt(5)) * index;
  return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius };
});

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

function rotatePoint(point: ProjectedPoint, rotation: number): ProjectedPoint {
  const sin = Math.sin(rotation);
  const cos = Math.cos(rotation);
  return {
    x: point.x * cos + point.z * sin,
    y: point.y,
    z: point.z * cos - point.x * sin
  };
}

function getCssColor(element: HTMLElement, variable: string, fallback: string) {
  return getComputedStyle(element).getPropertyValue(variable).trim() || fallback;
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
  const rotationRef = useRef(config.initialRotation?.y ?? -0.55);
  const markerPositionsRef = useRef<MarkerPosition[]>([]);
  const isVisibleRef = useRef(true);
  const isDraggingRef = useRef(false);
  const pointerXRef = useRef(0);
  const imageMapRef = useRef(new Map<string, HTMLImageElement>());
  const [hoveredMarker, setHoveredMarker] = useState<MarkerPosition | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const settings = useMemo(() => ({
    atmosphereColor: config.atmosphereColor ?? '#1263ff',
    atmosphereIntensity: config.atmosphereIntensity ?? 0.72,
    autoRotateSpeed: config.autoRotateSpeed ?? 0.34,
    markerSize: config.markerSize ?? 0.06,
    showAtmosphere: config.showAtmosphere ?? true,
    showWireframe: config.showWireframe ?? true,
    backgroundColor: config.backgroundColor ?? null
  }), [config]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const bounds = container.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, bounds.width < 560 ? 1.35 : 1.75);
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

    const centerX = bounds.width * 0.54;
    const centerY = bounds.height * 0.56;
    const radius = Math.min(bounds.width * 0.43, bounds.height * 0.48);
    const rotation = rotationRef.current;
    const surface = getCssColor(container, '--globe-surface', '#071b42');
    const surfaceEdge = getCssColor(container, '--globe-surface-edge', '#020711');
    const grid = getCssColor(container, '--globe-grid', 'rgba(127, 177, 255, .22)');
    const dots = getCssColor(container, '--globe-dots', 'rgba(175, 211, 255, .46)');
    const markerRing = getCssColor(container, '--globe-marker-ring', '#dcecff');

    if (settings.backgroundColor) {
      context.fillStyle = settings.backgroundColor;
      context.fillRect(0, 0, bounds.width, bounds.height);
    }

    if (settings.showAtmosphere) {
      const glow = context.createRadialGradient(centerX, centerY, radius * 0.72, centerX, centerY, radius * 1.34);
      glow.addColorStop(0, 'transparent');
      glow.addColorStop(0.62, 'transparent');
      glow.addColorStop(0.8, settings.atmosphereColor + '42');
      glow.addColorStop(1, 'transparent');
      context.globalAlpha = settings.atmosphereIntensity;
      context.fillStyle = glow;
      context.fillRect(centerX - radius * 1.4, centerY - radius * 1.4, radius * 2.8, radius * 2.8);
      context.globalAlpha = 1;
    }

    const sphere = context.createRadialGradient(
      centerX - radius * 0.36,
      centerY - radius * 0.42,
      radius * 0.05,
      centerX,
      centerY,
      radius
    );
    sphere.addColorStop(0, surface);
    sphere.addColorStop(0.58, surface);
    sphere.addColorStop(1, surfaceEdge);
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.fillStyle = sphere;
    context.fill();
    context.strokeStyle = settings.atmosphereColor + '8a';
    context.lineWidth = 1.15;
    context.stroke();

    context.save();
    context.beginPath();
    context.arc(centerX, centerY, radius - 1, 0, Math.PI * 2);
    context.clip();

    const drawGridLine = (points: ProjectedPoint[]) => {
      let drawing = false;
      context.beginPath();
      points.forEach((point) => {
        if (point.z <= 0) {
          drawing = false;
          return;
        }
        const x = centerX + point.x * radius;
        const y = centerY - point.y * radius;
        if (!drawing) context.moveTo(x, y);
        else context.lineTo(x, y);
        drawing = true;
      });
      context.stroke();
    };

    context.strokeStyle = grid;
    context.lineWidth = 0.72;
    [-60, -30, 0, 30, 60].forEach((latitude) => {
      drawGridLine(Array.from({ length: 121 }, (_, index) => project(latitude, index * 3 - 180, rotation)));
    });
    if (settings.showWireframe) {
      for (let longitude = -180; longitude < 180; longitude += 30) {
        drawGridLine(Array.from({ length: 91 }, (_, index) => project(index * 2 - 90, longitude, rotation)));
      }
    }

    context.fillStyle = dots;
    SPHERE_POINTS.forEach((point) => {
      const rotated = rotatePoint(point, rotation);
      if (rotated.z <= 0.02) return;
      const depth = 0.55 + rotated.z * 0.45;
      context.globalAlpha = depth * 0.8;
      context.beginPath();
      context.arc(centerX + rotated.x * radius, centerY - rotated.y * radius, 0.65 + depth * 0.75, 0, Math.PI * 2);
      context.fill();
    });
    context.globalAlpha = 1;

    const markerPositions = markers
      .map((marker) => ({ marker, ...project(marker.lat, marker.lng, rotation) }))
      .filter((marker) => marker.z > 0.05)
      .sort((a, b) => a.z - b.z)
      .map((point) => ({
        ...point,
        x: centerX + point.x * radius,
        y: centerY - point.y * radius,
        radius: Math.max(8, (point.marker.size ?? settings.markerSize) * radius * 2.2) * (0.78 + point.z * 0.22)
      }));

    context.setLineDash([3, 5]);
    context.lineWidth = 0.8;
    context.strokeStyle = settings.atmosphereColor + '55';
    for (let index = 1; index < markerPositions.length; index += 2) {
      const start = markerPositions[index - 1];
      const end = markerPositions[index];
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.quadraticCurveTo((start.x + end.x) / 2, Math.min(start.y, end.y) - radius * 0.16, end.x, end.y);
      context.stroke();
    }
    context.setLineDash([]);

    markerPositions.forEach((position) => {
      const image = imageMapRef.current.get(position.marker.src);
      context.save();
      context.shadowColor = settings.atmosphereColor;
      context.shadowBlur = 12;
      context.beginPath();
      context.arc(position.x, position.y, position.radius + 3, 0, Math.PI * 2);
      context.fillStyle = settings.atmosphereColor + '52';
      context.fill();
      context.shadowBlur = 0;
      context.beginPath();
      context.arc(position.x, position.y, position.radius, 0, Math.PI * 2);
      context.clip();
      if (image?.complete) {
        context.drawImage(image, position.x - position.radius, position.y - position.radius, position.radius * 2, position.radius * 2);
      } else {
        context.fillStyle = settings.atmosphereColor;
        context.fill();
      }
      context.restore();
      context.beginPath();
      context.arc(position.x, position.y, position.radius + 1, 0, Math.PI * 2);
      context.strokeStyle = markerRing;
      context.lineWidth = 1.25;
      context.stroke();
    });

    markerPositionsRef.current = markerPositions;
    context.restore();

    const sheen = context.createRadialGradient(
      centerX - radius * 0.42,
      centerY - radius * 0.48,
      0,
      centerX - radius * 0.28,
      centerY - radius * 0.34,
      radius * 0.76
    );
    sheen.addColorStop(0, 'rgba(255,255,255,.16)');
    sheen.addColorStop(0.44, 'rgba(255,255,255,.025)');
    sheen.addColorStop(1, 'transparent');
    context.beginPath();
    context.arc(centerX, centerY, radius - 1, 0, Math.PI * 2);
    context.fillStyle = sheen;
    context.fill();
  }, [markers, settings]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    markers.forEach((marker) => {
      if (imageMapRef.current.has(marker.src)) return;
      const image = new Image();
      image.decoding = 'async';
      image.src = marker.src;
      image.addEventListener('load', draw, { once: true });
      imageMapRef.current.set(marker.src, image);
    });
  }, [draw, markers]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver(draw);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { rootMargin: '120px' });
    const themeObserver = new MutationObserver(draw);
    resizeObserver.observe(container);
    intersectionObserver.observe(container);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    let previousTime = performance.now();
    const animate = (time: number) => {
      const elapsed = Math.min(time - previousTime, 40);
      previousTime = time;
      if (isVisibleRef.current && !isDraggingRef.current) {
        rotationRef.current += (elapsed / 1000) * settings.autoRotateSpeed * 0.34;
      }
      if (isVisibleRef.current) draw();
      frameRef.current = window.requestAnimationFrame(animate);
    };

    draw();
    if (!reducedMotion && settings.autoRotateSpeed > 0) frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [draw, reducedMotion, settings.autoRotateSpeed]);

  const findMarker = (clientX: number, clientY: number) => {
    const bounds = canvasRef.current?.getBoundingClientRect();
    if (!bounds) return null;
    const x = clientX - bounds.left;
    const y = clientY - bounds.top;
    return [...markerPositionsRef.current].reverse().find((position) => (
      Math.hypot(position.x - x, position.y - y) <= position.radius + 7
    )) ?? null;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      rotationRef.current += (event.clientX - pointerXRef.current) * 0.008;
      pointerXRef.current = event.clientX;
      draw();
      return;
    }
    const marker = findMarker(event.clientX, event.clientY);
    setHoveredMarker(marker);
    onMarkerHover?.(marker?.marker ?? null);
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
          setHoveredMarker(null);
          onMarkerHover?.(null);
        }}
      />
      {hoveredMarker?.marker.label && (
        <span className="globe-3d__tooltip" style={{ left: hoveredMarker.x, top: hoveredMarker.y - hoveredMarker.radius - 10 }}>
          {hoveredMarker.marker.label}
        </span>
      )}
    </div>
  );
}

export default Globe3D;
