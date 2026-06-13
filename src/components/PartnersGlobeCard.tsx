import { Globe3D, type GlobeMarker } from './ui/3d-globe';

const partnerIdentities = [
  '/assets/globe-partner-orbit.svg',
  '/assets/globe-partner-link.svg',
  '/assets/globe-partner-nodes.svg',
  '/assets/globe-partner-signal.svg'
];
const partnerMarkers: GlobeMarker[] = [
  { lat: -23.5505, lng: -46.6333, src: partnerIdentities[0], label: 'São Paulo' },
  { lat: 19.4326, lng: -99.1332, src: partnerIdentities[1], label: 'Cidade do México' },
  { lat: 40.7128, lng: -74.006, src: partnerIdentities[2], label: 'Nova York' },
  { lat: 38.7223, lng: -9.1393, src: partnerIdentities[3], label: 'Lisboa' },
  { lat: 51.5074, lng: -0.1278, src: partnerIdentities[0], label: 'Londres' },
  { lat: -33.9249, lng: 18.4241, src: partnerIdentities[1], label: 'Cidade do Cabo' },
  { lat: 25.2048, lng: 55.2708, src: partnerIdentities[2], label: 'Dubai' },
  { lat: 28.6139, lng: 77.209, src: partnerIdentities[3], label: 'Nova Délhi' },
  { lat: 1.3521, lng: 103.8198, src: partnerIdentities[0], label: 'Singapura' },
  { lat: 35.6762, lng: 139.6503, src: partnerIdentities[1], label: 'Tóquio' },
  { lat: -33.8688, lng: 151.2093, src: partnerIdentities[2], label: 'Sydney' }
];

export default function PartnersGlobeCard() {
  return (
    <article className="partners-globe-card" aria-labelledby="partners-globe-title">
      <div className="partners-globe-card__copy">
        <h2 id="partners-globe-title">Parceiros em todo o mundo</h2>
        <p>Conectamos empresas, instituições e especialistas em uma rede global de colaboração.</p>
      </div>
      <Globe3D
        className="partners-globe-card__visual"
        markers={partnerMarkers}
        config={{
          textureUrl: '/assets/earth-blue-marble.webp',
          atmosphereColor: '#1263ff',
          atmosphereIntensity: 0.26,
          autoRotateSpeed: 0.34,
          markerSize: 0.029,
          showAtmosphere: true,
          showWireframe: false
        }}
      />
      <p className="partners-globe-card__meta"><span>{partnerMarkers.length}</span> regiões estratégicas conectadas</p>
    </article>
  );
}
