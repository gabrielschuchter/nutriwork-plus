import { brazilStates } from '../data/brazilStates';
import BrazilMap from './BrazilMap';

export default function PartnersMapCard() {
  return (
    <article className="partners-map-card" aria-labelledby="partners-map-title">
      <div className="partners-map-card__copy">
        <h2 id="partners-map-title">Parceiros em todo o Brasil</h2>
        <p>Conectamos empresas, instituições e especialistas em uma rede nacional de colaboração.</p>
      </div>
      <BrazilMap className="partners-map-card__visual" />
      <p className="partners-map-card__meta"><span>{brazilStates.length}</span> estados prontos para a rede de parceiros</p>
    </article>
  );
}
