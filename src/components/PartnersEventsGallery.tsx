import './PartnersEventsGallery.css';
import type { CSSProperties } from 'react';

type GalleryItem = {
  number: string;
  src: string;
  caption: string;
  width: number;
  height: number;
  tone: 'hero' | 'wide' | 'tall' | 'standard';
  focus?: string;
};

const eventGalleryItems: GalleryItem[] = [
  {
    number: '1',
    src: '/assets/partners-events/event-01.webp',
    caption: 'Conheça a Equipe Nutriwork, responsável por tudo que foi construído até aqui.',
    width: 1800,
    height: 1200,
    tone: 'hero',
    focus: 'center center'
  },
  {
    number: '2',
    src: '/assets/partners-events/event-02.webp',
    caption: 'Igor Eckert e Thales Faccin em nosso Simpósio de Nutrição Baseada em Evidências, 2026',
    width: 1800,
    height: 1200,
    tone: 'hero',
    focus: 'center center'
  },
  {
    number: '3',
    src: '/assets/partners-events/event-03.webp',
    caption: 'Igor interagindo com a Equipe Nutriwork',
    width: 1400,
    height: 933,
    tone: 'wide',
    focus: 'center center'
  },
  {
    number: '4',
    src: '/assets/partners-events/event-04.webp',
    caption: 'Um momento marcante de uma das palestras oferecidas pelo Nutriwork',
    width: 1400,
    height: 933,
    tone: 'standard',
    focus: '62% center'
  },
  {
    number: '5',
    src: '/assets/partners-events/event-05.webp',
    caption: 'Recorte de como foi a palestra de Igor Eckert no Simpósio de Nutrição Baseada em Evidências, 2026',
    width: 1400,
    height: 933,
    tone: 'wide',
    focus: 'center center'
  },
  {
    number: '6',
    src: '/assets/partners-events/event-06.webp',
    caption: 'Palestra de Thales Faccin no Simpósio de Nutrição Baseada em Evidências, 2026',
    width: 1400,
    height: 933,
    tone: 'wide',
    focus: 'center center'
  },
  {
    number: '7',
    src: '/assets/partners-events/event-07.webp',
    caption: 'Amplinutri marcando presença em um evento Nutriwork',
    width: 1400,
    height: 933,
    tone: 'standard',
    focus: 'center center'
  },
  {
    number: '8',
    src: '/assets/partners-events/event-08.webp',
    caption: 'Quem sabe um dia não terá seu nome no meio desses crachás? ;)',
    width: 1400,
    height: 933,
    tone: 'standard',
    focus: 'center center'
  },
  {
    number: '9',
    src: '/assets/partners-events/event-09.webp',
    caption: 'Banner de nosso primeiro evento presencial, 2025',
    width: 1400,
    height: 2489,
    tone: 'tall',
    focus: 'center center'
  },
  {
    number: '10',
    src: '/assets/partners-events/event-10.webp',
    caption: 'Apresentação do Simpósio de Nutrição Esportiva Baseada em Evidências, 2025',
    width: 1400,
    height: 1867,
    tone: 'tall',
    focus: 'center center'
  },
  {
    number: '11',
    src: '/assets/partners-events/event-11.webp',
    caption: 'Roda de conversa em um evento oficial Nutriwork',
    width: 1400,
    height: 1867,
    tone: 'tall',
    focus: 'center center'
  },
  {
    number: '12',
    src: '/assets/partners-events/event-12.webp',
    caption: 'Palestra de Beatriz Gracia, Simpósio de Nutrição Esportiva Baseada em Evidências, 2025',
    width: 1400,
    height: 1867,
    tone: 'tall',
    focus: 'center center'
  },
  {
    number: '13',
    src: '/assets/partners-events/event-13.webp',
    caption: 'Primeira apresentação oficial do Nutriwork na Universidade Federal de Uberlândia, 2024',
    width: 1400,
    height: 788,
    tone: 'wide',
    focus: 'center center'
  },
  {
    number: '14',
    src: '/assets/partners-events/event-14.webp',
    caption: 'Nossas integrantes marcando presença na Vitaminar, uma clínica de nutrição infantil',
    width: 1400,
    height: 788,
    tone: 'wide',
    focus: 'center center'
  }
];

export default function PartnersEventsGallery() {
  return (
    <section className="section partners-events" aria-labelledby="partners-events-title">
      <div className="page-width">
        <div className="partners-events__heading">
          <h2 id="partners-events-title">Presença da Comunidade Nutriwork em espaços de formação, ensino e networking</h2>
          <span>Uma seleção de palestras, simpósios, encontros e momentos de troca que mostram o Nutriwork em movimento.</span>
        </div>
        <div className="partners-events__grid">
          {eventGalleryItems.map((item) => (
            <figure
              className={`partners-events__item partners-events__item--${item.tone}`}
              key={item.number}
              style={{ '--focus': item.focus ?? 'center center' } as CSSProperties}
            >
              <div className="partners-events__media">
                <img
                  src={item.src}
                  alt={item.caption}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 720px) 92vw, (max-width: 1100px) 45vw, 46vw"
                />
              </div>
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
