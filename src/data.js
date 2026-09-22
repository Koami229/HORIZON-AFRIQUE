/* =====================================================================
   HORIZON AFRIQUE — Données de démonstration de la maquette
   Toutes les données sont fictives et servent à illustrer les écrans.
   ===================================================================== */

const img = (p) => `/img/${p}`

/* ------------------------------ Visuels ------------------------------ */
export const IMG = {
  hero: img('gen/hero.jpg'),
  brandBanner: img('gen/brand-banner.jpg'),
  eventPoster: img('gen/event-poster.jpg'),
  marketplaceStory: img('gen/marketplace-story.jpg'),
  garment: [
    img('people/model-dress-vlisco.jpg'),
    img('people/collection-trio.jpg'),
    img('people/model-beaded.jpg'),
    img('people/model-gold-turban.jpg'),
    img('runway/runway-1.jpg'),
    img('runway/runway-5.jpg'),
    img('people/model-man-suit.jpg'),
    img('people/model-gold-makeup.jpg'),
    img('runway/runway-3.jpg'),
    img('people/model-man-blazer.jpg'),
    img('people/model-woman-black.jpg'),
    img('runway/runway-4.jpg'),
  ],
  people: [
    img('people/designer-woman-fabric.jpg'),
    img('people/model-man-suit.jpg'),
    img('people/makeup-artist.jpg'),
    img('people/model-beaded.jpg'),
    img('people/model-gold-turban.jpg'),
    img('people/model-man-blazer.jpg'),
    img('people/model-woman-black.jpg'),
    img('people/model-man-studio.jpg'),
    img('people/model-gold-makeup.jpg'),
    img('people/model-dress-vlisco.jpg'),
    img('people/collection-trio.jpg'),
    img('people/designer-woman-fabric.jpg'),
  ],
  atelier: [
    img('atelier/goldsmith-1.jpg'),
    img('atelier/goldsmith-2.jpg'),
    img('atelier/goldsmith-3.jpg'),
    img('atelier/goldsmith-4.jpg'),
    img('atelier/goldsmith-5.jpg'),
  ],
  runway: [
    img('runway/runway-1.jpg'),
    img('runway/runway-2.jpg'),
    img('runway/runway-3.jpg'),
    img('runway/runway-4.jpg'),
    img('runway/runway-5.jpg'),
  ],
  decor: [
    img('decor/basket-1.jpg'),
    img('decor/basket-2.jpg'),
    img('decor/basket-3.jpg'),
    img('decor/basket-4.jpg'),
    img('decor/basket-5.jpg'),
  ],
  art: [img('art/art-painting.jpg'), img('art/art-photo.jpg'), img('art/art-sculpture.jpg')],
  texture: [
    img('textures/pattern-patchwork.jpg'),
    img('textures/pattern-wax-super.jpg'),
    img('textures/pattern-wax-folded.jpg'),
    img('textures/pattern-wax-blue.jpg'),
    img('textures/pattern-wax-green.jpg'),
    img('textures/pattern-wax-red.jpg'),
    img('textures/pattern-geo.jpg'),
  ],
  bags: [
    img('products/bag-1.jpg'),
    img('products/bag-2.jpg'),
    img('products/bag-3.jpg'),
    img('products/bag-4.jpg'),
    img('products/bag-5.jpg'),
  ],
}

/* ------------------------------ Géographie ---------------------------- */
export const COUNTRIES = [
  { name: 'Bénin', flag: '🇧🇯', cities: ['Cotonou', 'Porto-Novo', 'Abomey-Calavi', 'Parakou', 'Ouidah'] },
  { name: "Côte d'Ivoire", flag: '🇨🇮', cities: ['Abidjan', 'Bouaké', 'Yamoussoukro', 'Grand-Bassam'] },
  { name: 'Sénégal', flag: '🇸🇳', cities: ['Dakar', 'Saint-Louis', 'Thiès', 'Mbour'] },
  { name: 'Nigeria', flag: '🇳🇬', cities: ['Lagos', 'Abuja', 'Ibadan', 'Port Harcourt'] },
  { name: 'Ghana', flag: '🇬🇭', cities: ['Accra', 'Kumasi', 'Tamale'] },
  { name: 'Mali', flag: '🇲🇱', cities: ['Bamako', 'Ségou', 'Mopti'] },
  { name: 'Burkina Faso', flag: '🇧🇫', cities: ['Ouagadougou', 'Bobo-Dioulasso'] },
  { name: 'Togo', flag: '🇹🇬', cities: ['Lomé', 'Kpalimé', 'Sokodé'] },
  { name: 'Cameroun', flag: '🇨🇲', cities: ['Douala', 'Yaoundé', 'Bafoussam'] },
  { name: 'RD Congo', flag: '🇨🇩', cities: ['Kinshasa', 'Lubumbashi', 'Goma'] },
  { name: 'Kenya', flag: '🇰🇪', cities: ['Nairobi', 'Mombasa', 'Kisumu'] },
  { name: 'Afrique du Sud', flag: '🇿🇦', cities: ['Johannesburg', 'Le Cap', 'Durban'] },
  { name: 'Rwanda', flag: '🇷🇼', cities: ['Kigali', 'Rubavu'] },
  { name: 'Maroc', flag: '🇲🇦', cities: ['Casablanca', 'Marrakech', 'Rabat', 'Fès'] },
  { name: 'Tunisie', flag: '🇹🇳', cities: ['Tunis', 'Sousse', 'Djerba'] },
  { name: 'Éthiopie', flag: '🇪🇹', cities: ['Addis-Abeba', 'Adama'] },
  { name: 'Gabon', flag: '🇬🇦', cities: ['Libreville', 'Port-Gentil'] },
  { name: 'Guinée', flag: '🇬🇳', cities: ['Conakry', 'Kankan'] },
  { name: 'Niger', flag: '🇳🇪', cities: ['Niamey', 'Agadez'] },
  { name: 'Madagascar', flag: '🇲🇬', cities: ['Antananarivo', 'Toamasina'] },
]

export const countryFlag = (name) => COUNTRIES.find((c) => c.name === name)?.flag || '🌍'

/* ------------------------------ Catégories ---------------------------- */
export const TALENT_CATEGORIES = [
  { name: 'Stylistes', slug: 'stylistes', icon: '✂️', count: 428, desc: 'Créateurs de silhouettes, couturiers et directeurs artistiques.' },
  { name: 'Designers', slug: 'designers', icon: '✏️', count: 361, desc: 'Design textile, produit, espace et identité visuelle.' },
  { name: 'Mannequins', slug: 'mannequins', icon: '👠', count: 512, desc: 'Profils de podium, éditoriaux et publicité.' },
  { name: 'Photographes', slug: 'photographes', icon: '📷', count: 274, desc: 'Mode, portrait, reportage et direction photo.' },
  { name: 'Artistes', slug: 'artistes', icon: '🎨', count: 233, desc: 'Peintres, performers, plasticiens et street art.' },
  { name: 'Artisans', slug: 'artisans', icon: '🧵', count: 619, desc: 'Bijoux, vannerie, maroquinerie, poterie, tissage.' },
  { name: 'Maquilleurs', slug: 'maquilleurs', icon: '💄', count: 187, desc: 'Beauty artists, SFX et maquillage éditorial.' },
  { name: 'Coiffeurs', slug: 'coiffeurs', icon: '💫', count: 205, desc: 'Tresses, perruques, coiffures d’événements.' },
  { name: 'Illustrateurs', slug: 'illustrateurs', icon: '🖌️', count: 142, desc: 'Illustration de mode, croquis, BD et édition.' },
  { name: 'Sculpteurs', slug: 'sculpteurs', icon: '🗿', count: 96, desc: 'Bois, bronze, pierre et installations.' },
  { name: 'Créateurs', slug: 'createurs', icon: '🌟', count: 704, desc: 'Créateurs multidisciplinaires et jeunes marques.' },
]

export const CREATION_CATEGORIES = ['Mode', 'Art', 'Artisanat', 'Design', 'Décoration', 'Accessoires']
export const EVENT_CATEGORIES = ['Fashion Week', 'Défilés', 'Castings', 'Concours', 'Festivals', 'Expositions', 'Salons', 'Lancements']
export const OPPORTUNITY_TYPES = ['Offre d’emploi', 'Casting', 'Stage', 'Concours', 'Collaboration', 'Appel à projets', 'Mission']
export const NEWS_CATEGORIES = ['Mode', 'Art', 'Artisanat', 'Design', 'Interviews', 'Tendances', 'Success Stories', 'Événements']
export const PRODUCT_CATEGORIES = ['Vêtements', 'Sacs', 'Chaussures', 'Bijoux', 'Accessoires', 'Tableaux', 'Art', 'Artisanat', 'Décoration', 'Faits main']
export const VIDEO_CATEGORIES = ['Défilés', 'Collections', 'Présentations de marques', 'Interviews', 'Backstage', 'Créations', 'Tutoriels']
export const STYLES = ['Contemporain', 'Wax chic', 'Minimaliste', 'Luxe artisanal', 'Streetwear', 'Traditionnel revisité', 'Haute couture']
export const AVAILABILITY = ['Disponible immédiatement', 'Sous 2 semaines', 'Sur rendez-vous', 'Non disponible']
export const ACCOUNT_TYPES = [
  { key: 'talent', label: 'Talent', icon: '🎨', desc: 'Styliste, designer, mannequin, photographe, artisan, artiste…' },
  { key: 'marque', label: 'Marque', icon: '🏷️', desc: 'Maison de mode, griffe, label ou studio de création.' },
  { key: 'boutique', label: 'Boutique', icon: '🛍️', desc: 'Vendre des produits et gérer des commandes.' },
  { key: 'partenaire', label: 'Partenaire', icon: '🤝', desc: 'Institution, école, média, agence, incubateur.' },
  { key: 'sponsor', label: 'Sponsor', icon: '💎', desc: 'Entreprise qui soutient les talents et les événements.' },
]

/* ------------------------------ Talents ------------------------------- */
const rawTalents = [
  ['Aïcha Kora', 'Styliste', 'Bénin', 'Cotonou', 'Wax chic', 'Wax chic', 84500, true, 12, 'Directrice artistique de la maison Kora, Aïcha réinvente le pagne béninois en pièces de soirée sculpturales.'],
  ['Koffi Mensah', 'Designer', 'Ghana', 'Accra', 'Contemporain', 'Design textile', 62300, true, 9, 'Designer textile et fondateur du studio Kente Lab à Accra.'],
  ['Fatou Diallo', 'Mannequin', 'Sénégal', 'Dakar', 'Editorial', 'Podium', 121400, true, 8, 'Mannequin international, 42 défilés, Dakar Fashion Week, Lagos FW.'],
  ['Ngozi Okafor', 'Photographe', 'Nigeria', 'Lagos', 'Portrait', 'Mode & portrait', 38600, true, 15, 'Photographe de mode basée à Lagos, direction artistique couleur.'],
  ['Amara Touré', 'Créateur', 'Côte d’Ivoire', 'Abidjan', 'Luxe artisanal', 'Prêt-à-porter', 51200, false, 7, 'Créateur touareg-abidjanais, travaille le cuir et le bogolan.'],
  ['Yannick Dossou', 'Photographe', 'Bénin', 'Porto-Novo', 'Reportage', 'Événementiel', 21800, false, 5, 'Reportage mode et culture, basé entre Porto-Novo et Cotonou.'],
  ['Mariam Sawadogo', 'Maquilleuse', 'Burkina Faso', 'Ouagadougou', 'Beauty', 'Éditorial & défilé', 29400, true, 11, 'Beauty artist, directrice maquillage FESPACO.'],
  ['Zita Bongo', 'Coiffeur', 'Gabon', 'Libreville', 'Afro', 'Tresses & éditorial', 18700, false, 6, 'Spécialiste coiffures afro-éditoriales et perruques sur mesure.'],
  ['Emeka Obi', 'Sculpteur', 'Nigeria', 'Abuja', 'Contemporain', 'Bronze & bois', 15200, true, 20, 'Sculpteur bronze, exposé à Lagos, Accra et Dakar.'],
  ['Sira Camara', 'Illustrateur', 'Mali', 'Bamako', 'Illustration', 'Mode illustrée', 26800, false, 4, 'Illustratrice de mode, plume et encre, éditions Bamako.'],
  ['Kwame Boateng', 'Designer', 'Ghana', 'Kumasi', 'Minimaliste', 'Design produit', 33100, true, 10, 'Designer produit, mobilier et objets en raphia.'],
  ['Leila Ben Salah', 'Styliste', 'Tunisie', 'Tunis', 'Méditerranée', 'Broderie', 44200, true, 13, 'Styliste, broderie tunisienne contemporaine.'],
  ['Amadou Keïta', 'Artisan', 'Mali', 'Ségou', 'Bijoux', 'Or & argent', 12100, true, 22, 'Orfèvre, bijoux filigranes, atelier familial depuis 1954.'],
  ['Thandiwe Moyo', 'Artiste', 'Afrique du Sud', 'Johannesburg', 'Plasticienne', 'Installation', 57700, true, 18, 'Plasticienne, installations textiles et mémoire.'],
  ['Cheikh Ndiaye', 'Styliste', 'Sénégal', 'Dakar', 'Traditionnel revisité', 'Bazin & broderie', 71900, true, 16, 'Maison Ndiaye, bazin riche et broderie main.'],
  ['Adjoa Mensah', 'Créateur', 'Ghana', 'Accra', 'Streetwear', 'Upcycling', 25600, false, 3, 'Upcycling, streetwear à base de tissus recyclés.'],
  ['Divine Nkurunziza', 'Mannequin', 'Rwanda', 'Kigali', 'Editorial', 'Beauté & podium', 40300, false, 4, 'Mannequin, ambassadrice beauté Kigali.'],
  ['Anifa Rasoanaivo', 'Artisan', 'Madagascar', 'Antananarivo', 'Vannerie', 'Raphia & soie', 9800, false, 9, 'Vannerie raphia, coopérative de 24 femmes.'],
  ['Binta Bah', 'Coiffeur', 'Guinée', 'Conakry', 'Afro', 'Coiffure mariage', 14200, false, 7, 'Coiffures de mariage et événements.'],
  ['Ousmane Sy', 'Photographe', 'Sénégal', 'Saint-Louis', 'Documentaire', 'Mode urbaine', 30500, true, 12, 'Photographe documentaire, séries urbaines.'],
  ['Ramata Koné', 'Maquilleuse', 'Côte d’Ivoire', 'Abidjan', 'Beauty', 'Mariage & défilé', 22900, false, 8, 'Maquillage mariage, peau noire et métissée.'],
  ['Chidi Nwosu', 'Illustrateur', 'Nigeria', 'Lagos', 'Concept art', 'Direction artistique', 19800, false, 5, 'Illustrateur concept, capsules capsules digitales.'],
  ['Zola Dlamini', 'Styliste', 'Afrique du Sud', 'Le Cap', 'Avant-garde', 'Tailleur', 66400, true, 14, 'Tailleur avant-gardiste, Le Cap.'],
  ['Naïma El Fassi', 'Créateur', 'Maroc', 'Marrakech', 'Luxe artisanal', 'Maroquinerie', 39800, true, 11, 'Maroquinerie de luxe, tanneries de Fès.'],
  ['Tiguidanké Barry', 'Mannequin', 'Guinée', 'Conakry', 'Editorial', 'Podium & beauté', 27600, false, 3, 'Nouvelle figure du podium guinéen.'],
  ['Séna Adjovi', 'Designer', 'Bénin', 'Abomey-Calavi', 'Contemporain', 'Design d’espace', 17600, false, 6, 'Designer d’espace, scénographie d’exposition.'],
  ['Pélagie Zinsou', 'Artisan', 'Bénin', 'Ouidah', 'Poterie', 'Terre cuite', 8400, false, 12, 'Potière, atelier de Ouidah, terre cuite émaillée.'],
  ['Basile Ahouandjinou', 'Sculpteur', 'Bénin', 'Abomey', 'Traditionnel', 'Bois & bronze', 11300, false, 17, 'Sculpteur bois, inspiration royale d’Abomey.'],
  ['Kagiso Mokoena', 'Designer', 'Afrique du Sud', 'Johannesburg', 'Industriel', 'Mobilier', 24100, true, 9, 'Designer industriel, mobilier contemporain africain.'],
  ['Hosni Ben Amor', 'Artisan', 'Tunisie', 'Djerba', 'Céramique', 'Zellige & poterie', 13400, false, 15, 'Céramiste, carreaux de Djerba.'],
]

export const talents = rawTalents.map((t, i) => {
  const [name, job, country, city, style, specialty, followers, verified, years, bio] = t
  const cat = TALENT_CATEGORIES.find((c) => c.name.toLowerCase().startsWith(job.toLowerCase().slice(0, 5)))
  return {
    id: `tal-${i + 1}`,
    slug: name.toLowerCase().replace(/[^a-z]+/g, '-'),
    name,
    job,
    category: cat ? cat.name : 'Créateurs',
    country,
    city,
    flag: countryFlag(country),
    style,
    specialty,
    followers,
    verified,
    years,
    bio,
    cover: IMG.garment[i % IMG.garment.length],
    avatar: IMG.people[i % IMG.people.length],
    portfolio: [0, 1, 2, 3, 4, 5].map((k) => IMG.garment[(i + k * 2) % IMG.garment.length]),
    rating: (4 + ((i % 10) / 10)).toFixed(1),
    reviews: 12 + ((i * 7) % 90),
    availability: AVAILABILITY[i % 4],
    height: [172, 178, 181, 168, 185, 176][i % 6],
    gender: i % 3 === 0 ? 'Femme' : i % 3 === 1 ? 'Homme' : 'Femme',
    experience: 1 + (i % 12),
    services: [
      { name: 'Création sur mesure', price: 'À partir de 45 000 FCFA', delay: '10 jours' },
      { name: 'Direction artistique', price: 'À partir de 120 000 FCFA', delay: 'Sur devis' },
      { name: 'Atelier / formation', price: 'À partir de 25 000 FCFA', delay: '2 jours' },
    ],
    awards: ['Prix Création Horizon 2024', 'Sélection Dakar Fashion Week', 'Label Fait en Afrique'],
    social: { instagram: `@${name.split(' ')[0].toLowerCase()}`, tiktok: `@${name.split(' ')[0].toLowerCase()}`, website: 'horizonafrique.com' },
    roles: ['talent'],
  }
})

/* ------------------------------ Marques ------------------------------- */
const rawBrands = [
  ['TOURÉ.', 'Bénin', 'Mode & couture', 'Cotonou', 184200, true, 2016, 'TOURÉ. est une maison béninoise de prêt-à-porter de luxe qui travaille le pagne wax, le coton biologique et les broderies artisanales. Chaque collection est produite en séries courtes dans l’atelier de Cotonou.'],
  ['Wax & Co', 'Sénégal', 'Prêt-à-porter', 'Dakar', 96500, true, 2014, 'Wax & Co habille une génération urbaine avec des pièces faciles à porter, fabriquées à Dakar.'],
  ['Aso Kente', 'Ghana', 'Tissage & luxe', 'Kumasi', 74200, true, 2011, 'Tisserands de Kente depuis trois générations, Aso Kente propose des étoffes et pièces d’exception.'],
  ['Nubia Studio', 'Nigeria', 'Contemporary luxury', 'Lagos', 152800, true, 2018, 'Studio nigérian de luxe contemporain, récompensé par plusieurs prix continentaux.'],
  ['Bogolan Mali', 'Mali', 'Artisanat & textile', 'Bamako', 43100, true, 2009, 'Le bogolan malien, teinture naturelle et motifs bambara, en pièces utilitaires et décoratives.'],
  ['Kinshasa Couture', 'RD Congo', 'Haute couture', 'Kinshasa', 68800, false, 2015, 'Maison de haute couture kinoise, drapés et satin, défilés à Kinshasa et Brazzaville.'],
  ['Adire House', 'Nigeria', 'Indigo & artisanat', 'Ibadan', 37900, true, 2017, 'Indigo naturel, adire et tie-dye, atelier communautaire de 60 teinturières.'],
  ['Sahara Loom', 'Maroc', 'Tapis & maison', 'Marrakech', 52400, true, 2012, 'Tapis Beni Ouarain et pièces de maison tissées main au Maroc.'],
  ['Nairobi Street', 'Kenya', 'Streetwear', 'Nairobi', 61200, false, 2019, 'Streetwear nairobi, sérigraphie locale et matières recyclées.'],
  ['Zanzibar Silk', 'Tanzanie', 'Soie & accessoires', 'Zanzibar', 28800, false, 2020, 'Soie sauvage de Zanzibar et accessoires tissés main.'],
]

export const brands = rawBrands.map((b, i) => {
  const [name, country, category, city, followers, verified, since, bio] = b
  return {
    id: `brd-${i + 1}`,
    slug: name.toLowerCase().replace(/[^a-z]+/g, '-'),
    name,
    country,
    flag: countryFlag(country),
    city,
    category,
    followers,
    verified,
    since,
    bio,
    logo: name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase(),
    banner: i === 0 ? IMG.brandBanner : IMG.garment[(i + 3) % IMG.garment.length],
    avatar: IMG.garment[(i + 1) % IMG.garment.length],
    lastPost: ['Nouvelle collection « Sable & Or »', 'Défilé Dakar FW', 'Capsule Kente été', 'Lookbook Lagos Nights', 'Bogolan home'][i % 5],
    collections: [
      { name: 'Collection Sable & Or', season: 'Automne 2026', pieces: 24, cover: IMG.garment[i % IMG.garment.length] },
      { name: 'Héritage', season: 'Printemps 2026', pieces: 18, cover: IMG.garment[(i + 2) % IMG.garment.length] },
      { name: 'Nuit de Cotonou', season: 'Été 2025', pieces: 31, cover: IMG.runway[i % IMG.runway.length] },
    ],
    contact: { email: `contact@${name.toLowerCase().replace(/[^a-z]/g, '')}.africa`, phone: '+229 21 30 44 12', website: `${name.toLowerCase().replace(/[^a-z]/g, '')}.africa` },
  }
})

/* ------------------------------ Créations ----------------------------- */
const creationTitles = [
  'Robe « Azalaï »', 'Ensemble Bogolan Urbain', 'Tunique Wax Ciel', 'Boubou Sculpté Or', 'Veste Kente Contemporaine',
  'Tapis Beni Ouarain', 'Bague filigrane Ségou', 'Tableau « Mémoire »', 'Sac cuir de Fès', 'Panier Raphia Tressé',
  'Robe de mariée « Sika »', 'Pagne tissé main', 'Masque contemporain', 'Coussin Adire', 'Collier perles Kabylie',
  'Sculpture « Kanda »', 'Jupe plissée Wax', 'Chemise brodée Bazin', 'Lampe céramique Djerba', 'Écharpe soie sauvage',
]
export const creations = creationTitles.map((title, i) => {
  const cat = CREATION_CATEGORIES[i % CREATION_CATEGORIES.length]
  const t = talents[(i * 3) % talents.length]
  const b = brands[i % brands.length]
  const byBrand = i % 2 === 0
  return {
    id: `cre-${i + 1}`,
    title,
    category: cat,
    author: byBrand ? b.name : t.name,
    authorId: byBrand ? b.id : t.id,
    authorType: byBrand ? 'marque' : 'talent',
    country: byBrand ? b.country : t.country,
    flag: byBrand ? b.flag : t.flag,
    city: byBrand ? b.city : t.city,
    date: new Date(2026, 8, 20 - i).toISOString(),
    likes: 320 + ((i * 137) % 4200),
    comments: 12 + ((i * 13) % 180),
    saves: 20 + ((i * 7) % 300),
    views: 1200 + ((i * 431) % 48000),
    image: IMG.garment[i % IMG.garment.length],
    gallery: [IMG.garment[i % IMG.garment.length], IMG.garment[(i + 4) % IMG.garment.length], IMG.texture[i % IMG.texture.length]],
    boost: i % 7 === 0,
    price: i % 3 === 0 ? `${(35 + i * 2) * 1000} FCFA` : null,
    description: 'Pièce réalisée à la main dans notre atelier. Matières naturelles, teintures écologiques, finitions traditionnelles revisitées pour un usage contemporain.',
  }
})

/* ------------------------------ Vidéos -------------------------------- */
export const videos = [
  ['Défilé TOURÉ. — Sable & Or', 'TOURÉ.', 'Défilés', '12:04', 148200, 3],
  ['Backstage Dakar Fashion Week', 'Wax & Co', 'Backstage', '06:21', 87400, 6],
  ['Interview : Aïcha Kora, styliste', 'Horizon Afrique', 'Interviews', '09:12', 32100, 1],
  ['Collection Héritage — Lookbook', 'Bogolan Mali', 'Collections', '04:48', 51200, 9],
  ['Atelier : le bogolan pas à pas', 'Bogolan Mali', 'Tutoriels', '14:32', 66800, 12],
  ['Nigeria Contemporary — Lagos FW', 'Nubia Studio', 'Défilés', '08:57', 112900, 4],
  ['Présentation de marque : Aso Kente', 'Aso Kente', 'Présentations de marques', '05:10', 27400, 15],
  ['Créations : le raphia de Madagascar', 'Anifa Rasoanaivo', 'Créations', '07:45', 19800, 2],
  ['Interview : Emeka Obi, sculpteur', 'Horizon Afrique', 'Interviews', '11:26', 24300, 20],
  ['Backstage Maison Ndiaye', 'Cheikh Ndiaye', 'Backstage', '03:58', 41500, 5],
  ['Masterclass teinture indigo', 'Adire House', 'Tutoriels', '18:09', 38900, 8],
  ['Défilé Kinshasa Couture — Finale', 'Kinshasa Couture', 'Défilés', '09:33', 72300, 7],
].map((v, i) => {
  const [title, author, category, duration, views, days] = v
  return {
    id: `vid-${i + 1}`,
    title,
    author,
    category,
    duration,
    views,
    date: new Date(2026, 8, 20 - days).toISOString(),
    thumb: IMG.runway[i % IMG.runway.length],
    poster: IMG.runway[(i + 2) % IMG.runway.length],
  }
})

/* ------------------------------ Événements ---------------------------- */
export const events = [
  ['Dakar Fashion Week 2026', 'Fashion Week', 'Sénégal', 'Dakar', '2026-10-14', '2026-10-18', 'Dakar FW Organisation', 45000],
  ['Lagos Fashion & Design Week', 'Fashion Week', 'Nigeria', 'Lagos', '2026-11-05', '2026-11-08', 'Style House Files', 60000],
  ['Bénin Fashion Show', 'Défilés', 'Bénin', 'Cotonou', '2026-10-03', '2026-10-03', 'Bénin Créatif', 12000],
  ['Casting pour la collection TOURÉ.', 'Castings', 'Bénin', 'Cotonou', '2026-09-28', '2026-09-29', 'TOURÉ.', 0],
  ['Abidjan Art Expo', 'Expositions', 'Côte d’Ivoire', 'Abidjan', '2026-10-22', '2026-11-02', 'Galerie Akwaba', 8000],
  ['Concours Jeunes Créateurs 2026', 'Concours', 'Burkina Faso', 'Ouagadougou', '2026-11-12', '2026-11-14', 'Faso Créatif', 5000],
  ['Festival International du Wax', 'Festivals', 'Ghana', 'Accra', '2026-12-01', '2026-12-06', 'Accra Arts Council', 15000],
  ['Salon Afrique Décoration', 'Salons', 'Maroc', 'Casablanca', '2026-10-09', '2026-10-12', 'SAD Expo', 20000],
  ['Lancement Wax & Co « Teranga »', 'Lancements', 'Sénégal', 'Dakar', '2026-09-27', '2026-09-27', 'Wax & Co', 0],
  ['Kigali Design Summit', 'Salons', 'Rwanda', 'Kigali', '2026-11-19', '2026-11-21', 'Kigali Innovation', 25000],
].map((e, i) => {
  const [name, category, country, city, start, end, organizer, price] = e
  return {
    id: `evt-${i + 1}`,
    name, category, country, city, start, end, organizer, price,
    flag: countryFlag(country),
    poster: i === 0 ? IMG.eventPoster : IMG.runway[i % IMG.runway.length],
    gallery: [IMG.runway[i % 5], IMG.runway[(i + 1) % 5], IMG.garment[(i + 2) % IMG.garment.length], IMG.atelier[i % 5]],
    venue: ['Palais des Congrès', 'Grand Théâtre', 'Institut Français', 'Espace Kora', 'Sofitel', 'Palais de la Culture'][i % 6],
    time: ['19h00 — 23h00', '10h00 — 18h00', '16h00 — 21h00', '09h00 — 20h00'][i % 4],
    participants: 120 + i * 34,
    description:
      'Une rencontre professionnelle qui rassemble créateurs, marques, mannequins, photographes et institutions autour de la création africaine contemporaine. Programme : défilés, ateliers, networking, showroom et rencontres B2B.',
    programme: [
      { time: 'Jour 1 — 10h00', title: 'Ouverture & discours des partenaires' },
      { time: 'Jour 1 — 14h00', title: 'Défilés jeunes créateurs' },
      { time: 'Jour 2 — 11h00', title: 'Table ronde : financer la mode africaine' },
      { time: 'Jour 2 — 19h00', title: 'Défilé de clôture & remise des prix' },
    ],
    partners: ['Ministère de la Culture', 'Chambre de Commerce', 'Orange Fab', 'École des Arts'],
    sponsors: ['Bank of Africa', 'MTN', 'Bénin Terminal', 'Air Sénégal'],
    boost: i < 3,
  }
})

/* ------------------------------ Opportunités -------------------------- */
export const opportunities = [
  ['Styliste senior — prêt-à-porter', 'TOURÉ.', 'Offre d’emploi', 'Bénin', 'Cotonou', 'Mode', 2],
  ['Casting mannequins — Défilé Bénin Fashion Show', 'Bénin Créatif', 'Casting', 'Bénin', 'Cotonou', 'Mode', 18],
  ['Photographe produit (freelance)', 'Wax & Co', 'Mission', 'Sénégal', 'Dakar', 'Photographie', 30],
  ['Stage design textile', 'Kente Lab', 'Stage', 'Ghana', 'Accra', 'Design', 25],
  ['Concours Jeunes Créateurs 2026', 'Faso Créatif', 'Concours', 'Burkina Faso', 'Ouagadougou', 'Création', 40],
  ['Collaboration capsule homme', 'Nubia Studio', 'Collaboration', 'Nigeria', 'Lagos', 'Mode', 12],
  ['Appel à projets : résidence d’artistes', 'Galerie Akwaba', 'Appel à projets', 'Côte d’Ivoire', 'Abidjan', 'Art', 21],
  ['Community manager bilingue', 'Nairobi Street', 'Offre d’emploi', 'Kenya', 'Nairobi', 'Marketing', 15],
  ['Modéliste-produit (bazin)', 'Maison Ndiaye', 'Offre d’emploi', 'Sénégal', 'Dakar', 'Mode', 9],
  ['Responsable boutique — Marrakech', 'Sahara Loom', 'Offre d’emploi', 'Maroc', 'Marrakech', 'Commerce', 26],
  ['Artisan vannerie — commande groupée', 'Coopérative Raphia', 'Mission', 'Madagascar', 'Antananarivo', 'Artisanat', 33],
  ['Réalisateur clip lookbook', 'Adire House', 'Mission', 'Nigeria', 'Ibadan', 'Vidéo', 20],
].map((o, i) => {
  const [title, org, type, country, city, domain, deadlineInDays] = o
  const deadline = new Date(2026, 8, 22 + deadlineInDays)
  return {
    id: `opp-${i + 1}`,
    title, org, type, country, city, domain,
    flag: countryFlag(country),
    deadline: deadline.toISOString(),
    daysLeft: deadlineInDays,
    contract: ['CDI', 'Freelance', 'Mission 3 mois', 'Stage 6 mois', 'Prix + dotation'][i % 5],
    budget: ['300 000 – 450 000 FCFA / mois', 'À négocier', '150 000 FCFA', 'Gratifié', '1 000 000 FCFA de dotation'][i % 5],
    applicants: 8 + ((i * 17) % 180),
    featured: i % 4 === 0,
    missions: [
      'Concevoir et développer les pièces de la prochaine collection.',
      'Encadrer l’équipe d’atelier et suivre la production.',
      'Collaborer avec les partenaires et les fournisseurs locaux.',
      'Participer aux événements et showrooms de la marque.',
    ],
    conditions: [
      'Minimum 3 ans d’expérience dans un poste similaire.',
      'Portfolio exigeant et démontrable.',
      'Disponibilité immédiate.',
      'Français courant, anglais apprécié.',
    ],
    skills: ['Modélisme', 'Direction artistique', 'Gestion de production', 'Travail d’équipe', 'Sourcing matières'],
    description:
      'Nous recherchons un profil passionné pour rejoindre une équipe créative panafricaine. Le poste offre une grande autonomie, un accompagnement de carrière et une visibilité internationale à travers nos événements et nos campagnes.',
  }
})

/* ------------------------------ Produits ------------------------------ */
export const products = [
  ['Robe « Azalaï »', 'Vêtements', 78000, 'TOURÉ.', 'Bénin'],
  ['Tunique Wax Ciel', 'Vêtements', 42000, 'Wax & Co', 'Sénégal'],
  ['Ensemble Bogolan Urbain', 'Vêtements', 95000, 'Bogolan Mali', 'Mali'],
  ['Sac cuir de Fès', 'Sacs', 120000, 'Sahara Loom', 'Maroc'],
  ['Panier Raphia Tressé', 'Décoration', 24000, 'Coopérative Raphia', 'Madagascar'],
  ['Bague filigrane Ségou', 'Bijoux', 65000, 'Amadou Keïta', 'Mali'],
  ['Boubou Sculpté Or', 'Vêtements', 145000, 'TOURÉ.', 'Bénin'],
  ['Tableau « Mémoire »', 'Tableaux', 320000, 'Thandiwe Moyo', 'Afrique du Sud'],
  ['Sculpture « Kanda »', 'Art', 210000, 'Emeka Obi', 'Nigeria'],
  ['Coussin Adire', 'Décoration', 18000, 'Adire House', 'Nigeria'],
  ['Collier perles Kabylie', 'Bijoux', 32000, 'Amadou Keïta', 'Mali'],
  ['Lampe céramique Djerba', 'Décoration', 56000, 'Hosni Ben Amor', 'Tunisie'],
  ['Écharpe soie sauvage', 'Accessoires', 38000, 'Zanzibar Silk', 'Tanzanie'],
  ['Veste Kente Contemporaine', 'Vêtements', 135000, 'Aso Kente', 'Ghana'],
  ['Sandales cuir tressé', 'Chaussures', 45000, 'Naïma El Fassi', 'Maroc'],
  ['Masque contemporain', 'Artisanat', 88000, 'Basile Ahouandjinou', 'Bénin'],
  ['Sac Wax Bohème', 'Sacs', 39000, 'Wax & Co', 'Sénégal'],
  ['Chemise brodée Bazin', 'Vêtements', 52000, 'Maison Ndiaye', 'Sénégal'],
  ['Tapis Beni Ouarain', 'Décoration', 240000, 'Sahara Loom', 'Maroc'],
  ['Pot décoratif émaillé', 'Faits main', 29000, 'Pélagie Zinsou', 'Bénin'],
]

export const productImg = (i) => {
  const pool = [IMG.bags, IMG.decor, IMG.garment, IMG.art, IMG.texture]
  return pool[i % pool.length][i % pool[i % pool.length].length]
}

export const productList = products.map((p, i) => {
  const [name, category, price, seller, country] = p
  return {
    id: `prd-${i + 1}`,
    name, category, price, seller, country,
    flag: countryFlag(country),
    shop: `${seller} Store`,
    rating: (4 + ((i % 10) / 10)).toFixed(1),
    reviews: 6 + ((i * 7) % 120),
    sold: 12 + ((i * 23) % 400),
    stock: 3 + ((i * 5) % 40),
    image: productImg(i),
    gallery: [productImg(i), productImg(i + 3), productImg(i + 5), productImg(i + 7)],
    options: category === 'Vêtements' ? ['S', 'M', 'L', 'XL'] : category === 'Chaussures' ? ['38', '39', '40', '41', '42'] : ['Unique'],
    colors: ['Terracotta', 'Indigo', 'Or', 'Écru'].slice(0, 2 + (i % 3)),
    description:
      'Pièce fabriquée à la main en série limitée. Matières naturelles certifiées, teintures écologiques, finitions réalisées dans notre atelier partenaire.',
    boost: i % 6 === 0,
    shipping: 2500 + (i % 4) * 1000,
  }
})

/* ------------------------------ Actualités ---------------------------- */
export const articles = [
  ['Le wax entre au musée : la nouvelle vague béninoise', 'Mode', 'Awa Sossou', 3, 'Analyse'],
  ['Portrait : Aïcha Kora, la couture comme manifeste', 'Interviews', 'Sylvain Hodonou', 6, 'Interview'],
  ['L’artisanat africain pèse désormais 12 milliards $', 'Artisanat', 'Rédaction Horizon', 9, 'Économie'],
  ['Design kényan : le mobilier low-tech séduit l’Europe', 'Design', 'Naomi Wanjiru', 12, 'Tendances'],
  ['Success story : de Cotonou à Paris pour TOURÉ.', 'Success Stories', 'Bénédicte Ahyi', 15, 'Business'],
  ['Dix jeunes artistes à suivre cette saison', 'Art', 'Kwesi Ampofo', 18, 'Sélection'],
  ['Le calendrier des Fashion Weeks africaines 2026-2027', 'Événements', 'Rédaction Horizon', 21, 'Agenda'],
  ['Indigo naturel : renaissance d’une teinture millénaire', 'Artisanat', 'Adaeze Nwankwo', 25, 'Reportage'],
  ['Photographie de mode africaine : nouveaux regards', 'Art', 'Ngozi Okafor', 28, 'Portfolio'],
  ['Upcycling : la seconde vie des tissus à Accra', 'Tendances', 'Kojo Mensah', 32, 'Environnement'],
  ['Comment financer sa première collection ?', 'Mode', 'Rédaction Horizon', 35, 'Guide'],
  ['Success story : la coopérative raphia de Madagascar', 'Success Stories', 'Rasoa Naina', 40, 'Business'],
].map((a, i) => {
  const [title, category, author, daysAgo, tag] = a
  return {
    id: `art-${i + 1}`,
    title, category, author, tag,
    date: new Date(2026, 8, 22 - daysAgo).toISOString(),
    readTime: 4 + (i % 6),
    views: 1200 + i * 830,
    image: [IMG.garment, IMG.atelier, IMG.runway, IMG.decor, IMG.art, IMG.texture][i % 6][i % 5],
    excerpt:
      'La création africaine change d’échelle. Entre héritage artisanal et exigences du marché international, les professionnels du continent structurent de nouvelles filières.',
    body: [
      'Longtemps cantonnée aux marchés locaux, la création africaine s’organise. Les maisons investissent dans la formation, la traçabilité des matières et la distribution internationale.',
      'Sur Horizon Afrique, ce mouvement est visible : les profils vérifiés progressent de 40 % par an et les boutiques affichent des taux de conversion comparables aux plateformes occidentales.',
      'Reste la question du financement. Les institutions publiques, les sponsors privés et les plateformes comme Horizon Boost jouent ici un rôle décisif pour faire émerger les prochaines grandes maisons du continent.',
      'Les prochains mois seront décisifs : lancement de collections capsules, structuration de réseaux de showrooms et multiplication des collaborations panafricaines.',
    ],
    similar: [1, 2, 3].map((k) => (i + k) % 12),
  }
})

/* ------------------------------ Partenaires & sponsors ---------------- */
export const partners = [
  ['Ministère de la Culture du Bénin', 'Institution', 'Bénin', 'Soutien aux industries créatives et à la formation des talents.'],
  ['École des Arts de Dakar', 'Éducation', 'Sénégal', 'Formation des stylistes, modélistes et designers textiles.'],
  ['Orange Fab', 'Incubateur', 'Côte d’Ivoire', 'Accompagnement des startups créatives africaines.'],
  ['Chambre de Commerce de Lomé', 'Institution', 'Togo', 'Financement et mise en relation des artisans exportateurs.'],
  ['Kigali Innovation Hub', 'Incubateur', 'Rwanda', 'Programmes d’accélération pour les studios de design.'],
  ['Africa Style Media', 'Média', 'Kenya', 'Diffusion et promotion des créateurs à l’international.'],
  ['Fonds Créatif Maroc', 'Financement', 'Maroc', 'Subventions pour la maroquinerie et l’artisanat d’art.'],
  ['Lagos Creative Agency', 'Agence', 'Nigeria', 'Production d’événements et de campagnes publicitaires.'],
].map((p, i) => {
  const [name, domain, country, desc] = p
  return { id: `par-${i + 1}`, name, domain, country, flag: countryFlag(country), desc, logo: name.split(' ').map((w) => w[0]).slice(0, 2).join(''), since: 2016 + (i % 6) }
})

export const sponsors = [
  ['Bank of Africa', 'Sponsor principal', 45000000, 'Financement des Fashion Weeks et des prix de création.'],
  ['MTN Group', 'Sponsor d’événements', 32000000, 'Connectivité, diffusion live et bourses de formation.'],
  ['Ecobank', 'Sponsor de projets', 28000000, 'Accompagnement des jeunes marques et programme d’incubation.'],
  ['Air Sénégal', 'Sponsor d’événements', 15000000, 'Mobilité des créateurs et transport des collections.'],
  ['Bénin Terminal', 'Sponsor de projets', 9500000, 'Logistique et export des produits artisanaux.'],
  ['Orange Money', 'Sponsor principal', 38000000, 'Paiement mobile et Horizon Boost.'],
  ['Institut Français', 'Sponsor culturel', 7200000, 'Résidences et expositions croisées.'],
  ['Sofitel Africa', 'Sponsor d’événements', 11000000, 'Accueil des délégations et défilés privés.'],
].map((s, i) => {
  const [name, type, amount, desc] = s
  return { id: `spo-${i + 1}`, name, type, amount, desc, logo: name.split(' ').map((w) => w[0]).slice(0, 2).join(''), campaigns: 2 + (i % 5), talents: 4 + i * 3, since: 2015 + (i % 8) }
})

/* ------------------------------ Tarifs -------------------------------- */
export const plans = [
  {
    name: 'Horizon Free', price: 0, tagline: 'Pour découvrir la plateforme',
    features: ['Profil public', '3 publications par mois', 'Accès galerie et vidéos', 'Messagerie limitée à 5 conversations', 'Participation aux événements'],
  },
  {
    name: 'Horizon Starter', price: 5000, tagline: 'Pour se faire connaître',
    badge: 'Populaire',
    features: ['Tout Horizon Free', 'Publications illimitées', 'Portfolio 30 visuels', 'Statistiques de base', 'Badge Starter', '1 Boost offert / mois'],
  },
  {
    name: 'Horizon Pro', price: 10000, tagline: 'Pour les professionnels',
    features: ['Tout Starter', 'Boutique en ligne', 'Commandes et paiements en ligne', 'Statistiques détaillées', 'Badge vérifié', '3 Boost offerts / mois', 'Mise en avant dans l’annuaire'],
  },
  {
    name: 'Horizon Premium', price: 20000, tagline: 'Pour les marques et institutions',
    features: ['Tout Pro', 'Multi-utilisateurs (5 comptes)', 'Campagnes et collections illimitées', 'Accès API et export des données', 'Page marque personnalisée', '10 Boost offerts / mois', 'Accompagnement dédié'],
  },
]

export const boostTargets = [
  { key: 'profil', label: 'Profil', icon: '👤', desc: 'Apparaître dans les profils recommandés.' },
  { key: 'publication', label: 'Publication', icon: '📝', desc: 'Toucher plus de monde sur le fil.' },
  { key: 'produit', label: 'Produit', icon: '🛍️', desc: 'Remonter dans la marketplace.' },
  { key: 'collection', label: 'Collection', icon: '🧵', desc: 'Mettre en avant une collection.' },
  { key: 'video', label: 'Vidéo', icon: '🎬', desc: 'Booster la visibilité de vos vidéos.' },
  { key: 'evenement', label: 'Événement', icon: '📅', desc: 'Remplir votre événement plus vite.' },
  { key: 'opportunite', label: 'Opportunité', icon: '💼', desc: 'Recevoir plus de candidatures.' },
]

/* ------------------------------ Réseau (fil, messages, notifs) -------- */
export const feedPosts = [
  ['TOURÉ.', 'marque', 'La collection « Sable & Or » arrive. 24 pièces, coton bio et broderies main réalisées à Cotonou. Rendez-vous le 3 octobre au Bénin Fashion Show.'],
  ['Aïcha Kora', 'talent', 'Trois semaines de travail, sept essayages, une robe. Fière de vous présenter « Azalaï » 🌍'],
  ['Fatou Diallo', 'talent', 'Retour sur un shooting incroyable à Dakar avec l’équipe de Wax & Co. Merci pour la confiance ✨'],
  ['Wax & Co', 'marque', 'Nouvelle capsule « Teranga » en boutique. Séries limitées, livraison partout en Afrique de l’Ouest.'],
  ['Amadou Keïta', 'talent', 'L’atelier familial a reçu une commande de 120 bagues filigranes pour un mariage à Bamako. Le savoir-faire se transmet 💛'],
  ['Sahara Loom', 'marque', 'Nos tapis Beni Ouarain tissés main arrivent dans la marketplace. Livraison internationale disponible.'],
].map((p, i) => {
  const [author, type, text] = p
  return {
    id: `post-${i + 1}`,
    author, type, text,
    time: `${1 + i} h`,
    avatar: IMG.people[i % IMG.people.length],
    image: i % 3 === 0 ? null : IMG.garment[(i + 2) % IMG.garment.length],
    likes: 120 + i * 87,
    comments: 8 + i * 5,
    shares: 2 + i * 3,
    boost: i === 0,
    tag: ['Collection', 'Création', 'Publication', 'Nouveauté', 'Réalisation', 'Annonce'][i],
  }
})

export const conversations = [
  ['TOURÉ.', 'Bonjour Aïcha, nous aimerions vous proposer une collaboration pour notre prochaine collection. Êtes-vous disponible pour un appel cette semaine ?', 2],
  ['Wax & Co', 'Merci pour votre candidature. Votre book a retenu notre attention. Nous vous proposons un essai le 14 octobre à Dakar.', 5],
  ['Ngozi Okafor', 'Je vous envoie les photos retouchées ce soir. Dites-moi si le traitement couleur vous convient.', 1],
  ['Bénin Créatif', 'Votre inscription au Bénin Fashion Show est confirmée. Merci de nous transmettre vos mesures avant le 30 septembre.', 9],
  ['Amadou Keïta', 'La bague est prête, je vous l’expédie demain matin par transporteur.', 26],
].map((c, i) => {
  const [name, last, hours] = c
  return {
    id: `cnv-${i + 1}`,
    name,
    avatar: IMG.people[(i + 3) % IMG.people.length],
    last,
    time: `${hours} h`,
    unread: i < 2 ? i + 1 : 0,
    online: i < 3,
    messages: [
      { me: false, text: last, time: `${hours} h` },
      { me: true, text: 'Bonjour, merci pour votre message. Je reviens vers vous très rapidement avec mes disponibilités.', time: `${hours - 1} h` },
      { me: false, text: 'Parfait, dans l’attente de votre retour. Bonne journée !', time: '30 min' },
    ],
    files: i === 0 ? ['Brief_collection_Sable_et_Or.pdf', 'Moodboard_Azalaï.jpg'] : [],
  }
})

export const notifications = [
  ['abonnes', 'Nouvel abonné', 'Koffi Mensah a commencé à vous suivre.', 'il y a 12 min'],
  ['likes', 'J’aime', 'Wax & Co et 128 autres personnes ont aimé votre publication.', 'il y a 40 min'],
  ['commentaires', 'Commentaire', 'Sira Camara a commenté : « Superbe travail sur les finitions ! »', 'il y a 2 h'],
  ['messages', 'Message', 'TOURÉ. vous a envoyé un message au sujet d’une collaboration.', 'il y a 3 h'],
  ['collaborations', 'Collaboration', 'Nubia Studio a accepté votre demande de collaboration.', 'il y a 5 h'],
  ['opportunites', 'Opportunité', 'Nouvelle offre correspondant à votre profil : Styliste senior.', 'hier'],
  ['evenements', 'Événement', 'Dakar Fashion Week commence dans 22 jours.', 'hier'],
  ['commandes', 'Commande', 'Commande #HA-2291 expédiée. Suivi disponible.', 'il y a 2 jours'],
].map((n, i) => {
  const [type, title, text, time] = n
  return { id: `ntf-${i + 1}`, type, title, text, time, read: i > 3 }
})

export const collaborations = {
  received: [
    { id: 'col-1', name: 'TOURÉ.', type: 'Collection capsule', desc: 'Co-création de 6 pièces pour la collection Sable & Or.', date: '2026-09-19', budget: '2 400 000 FCFA' },
    { id: 'col-2', name: 'Wax & Co', type: 'Shooting éditorial', desc: 'Direction stylisme pour un éditorial 12 pages.', date: '2026-09-16', budget: '850 000 FCFA' },
    { id: 'col-3', name: 'Galerie Akwaba', type: 'Exposition', desc: 'Résidence de 3 semaines et installation textile.', date: '2026-09-11', budget: '1 200 000 FCFA' },
  ],
  sent: [
    { id: 'col-4', name: 'Nubia Studio', type: 'Défilé', desc: 'Proposition de collaboration pour Lagos FW 2026.', date: '2026-09-14', budget: '3 000 000 FCFA' },
    { id: 'col-5', name: 'Sahara Loom', type: 'Collection maison', desc: 'Ligne de coussins et plaids wax.', date: '2026-09-08', budget: '1 500 000 FCFA' },
  ],
  ongoing: [
    { id: 'col-6', name: 'Maison Ndiaye', type: 'Collection', desc: '10 pièces bazin brodé — 60 % réalisé.', date: '2026-08-30', progress: 60 },
    { id: 'col-7', name: 'Adire House', type: 'Capsule indigo', desc: 'Séries de 40 foulards teints main.', date: '2026-08-21', progress: 35 },
  ],
  done: [
    { id: 'col-8', name: 'Bénin Créatif', type: 'Événement', desc: 'Défilé de clôture Bénin Fashion Show 2025.', date: '2025-12-02', note: '5,0' },
    { id: 'col-9', name: 'Aso Kente', type: 'Textile', desc: 'Tissage de 60 mètres de kente sur mesure.', date: '2025-10-18', note: '4,8' },
  ],
}

/* ------------------------------ Statistiques -------------------------- */
export const stats = {
  overview: [
    { label: 'Vues du profil', value: '18 420', delta: '+12,4 %', up: true },
    { label: 'Visiteurs uniques', value: '6 108', delta: '+8,1 %', up: true },
    { label: 'Abonnés', value: '84 500', delta: '+1 240', up: true },
    { label: 'Interactions', value: '23 901', delta: '+15,7 %', up: true },
  ],
  series: [42, 55, 48, 70, 66, 88, 95, 82, 110, 128, 121, 145],
  months: ['Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept'],
  topPosts: [
    ['Robe « Azalaï »', 12400, 812, 342],
    ['Ensemble Bogolan Urbain', 9800, 640, 281],
    ['Coulisses atelier Cotonou', 7400, 512, 190],
    ['Collection Sable & Or — teaser', 6100, 430, 174],
  ],
  shop: {
    sales: [
      { label: 'Ventes du mois', value: '3 480 000 FCFA', delta: '+18,2 %', up: true },
      { label: 'Commandes', value: '128', delta: '+22', up: true },
      { label: 'Panier moyen', value: '27 200 FCFA', delta: '+4,1 %', up: true },
      { label: 'Taux de retour', value: '2,1 %', delta: '-0,6 pt', up: true },
    ],
    topProducts: [
      ['Robe « Azalaï »', 42, 3276000],
      ['Chemise brodée Bazin', 28, 1456000],
      ['Sac Wax Bohème', 21, 819000],
      ['Coussin Adire', 18, 324000],
    ],
  },
}

/* ------------------------------ Espaces pro --------------------------- */
export const orders = [
  { id: 'HA-2291', client: 'Fatou Diallo', items: 2, total: 120000, date: '2026-09-21', status: 'Nouvelle', country: 'Sénégal' },
  { id: 'HA-2290', client: 'Koffi Mensah', items: 1, total: 78000, date: '2026-09-20', status: 'Nouvelle', country: 'Ghana' },
  { id: 'HA-2288', client: 'Ngozi Okafor', items: 3, total: 156000, date: '2026-09-18', status: 'En cours', country: 'Nigeria' },
  { id: 'HA-2285', client: 'Zola Dlamini', items: 1, total: 145000, date: '2026-09-16', status: 'En cours', country: 'Afrique du Sud' },
  { id: 'HA-2280', client: 'Amadou Keïta', items: 4, total: 210000, date: '2026-09-12', status: 'Livrée', country: 'Mali' },
  { id: 'HA-2276', client: 'Leila Ben Salah', items: 2, total: 96000, date: '2026-09-09', status: 'Livrée', country: 'Tunisie' },
  { id: 'HA-2271', client: 'Divine Nkurunziza', items: 1, total: 42000, date: '2026-09-04', status: 'Annulée', country: 'Rwanda' },
]

export const adminStats = [
  { label: 'Utilisateurs', value: '48 216', delta: '+1 842', up: true, icon: '👥' },
  { label: 'Talents', value: '12 407', delta: '+320', up: true, icon: '🎨' },
  { label: 'Marques', value: '1 284', delta: '+46', up: true, icon: '🏷️' },
  { label: 'Boutiques', value: '2 913', delta: '+128', up: true, icon: '🛍️' },
  { label: 'Produits', value: '9 842', delta: '+512', up: true, icon: '📦' },
  { label: 'Publications', value: '184 320', delta: '+9 120', up: true, icon: '📝' },
  { label: 'Vidéos', value: '7 918', delta: '+310', up: true, icon: '🎬' },
  { label: 'Revenus (mois)', value: '38,4 M FCFA', delta: '+12,7 %', up: true, icon: '💰' },
  { label: 'Abonnements actifs', value: '6 402', delta: '+418', up: true, icon: '⭐' },
  { label: 'Boosts actifs', value: '1 218', delta: '+96', up: true, icon: '🚀' },
  { label: 'Signalements ouverts', value: '42', delta: '-8', up: true, icon: '🚩' },
  { label: 'Vérifications en attente', value: '17', delta: '+5', up: false, icon: '✔️' },
]

export const reports = [
  { id: 'RPT-118', type: 'Contenu inapproprié', target: 'Publication — Studio Zuri', author: 'Membre #4021', date: '2026-09-21', gravity: 'Élevée', status: 'À traiter' },
  { id: 'RPT-117', type: 'Faux profil', target: 'Marque — Aso Kente Off', author: 'Membre #1188', date: '2026-09-20', gravity: 'Élevée', status: 'À traiter' },
  { id: 'RPT-116', type: 'Spam', target: 'Commentaire — #12902', author: 'Membre #7734', date: '2026-09-19', gravity: 'Faible', status: 'En cours' },
  { id: 'RPT-115', type: 'Contrefaçon', target: 'Produit — Sac cuir', author: 'Membre #2210', date: '2026-09-18', gravity: 'Moyenne', status: 'En cours' },
  { id: 'RPT-114', type: 'Contenu inapproprié', target: 'Vidéo — #881', author: 'Membre #9087', date: '2026-09-16', gravity: 'Faible', status: 'Résolu' },
  { id: 'RPT-113', type: 'Harcèlement', target: 'Message — Membre #556', author: 'Membre #3345', date: '2026-09-14', gravity: 'Élevée', status: 'Résolu' },
]

export const verifications = [
  { id: 'VER-240', name: 'Kente Lab', type: 'Marque', country: 'Ghana', date: '2026-09-21', docs: 3, status: 'En attente' },
  { id: 'VER-239', name: 'Aïcha Kora', type: 'Talent', country: 'Bénin', date: '2026-09-20', docs: 2, status: 'En attente' },
  { id: 'VER-238', name: 'Zanzibar Silk', type: 'Boutique', country: 'Tanzanie', date: '2026-09-19', docs: 4, status: 'En attente' },
  { id: 'VER-237', name: 'Galerie Akwaba', type: 'Partenaire', country: 'Côte d’Ivoire', date: '2026-09-17', docs: 5, status: 'Validé' },
  { id: 'VER-236', name: 'Bénin Terminal', type: 'Sponsor', country: 'Bénin', date: '2026-09-15', docs: 3, status: 'Validé' },
]

export const payments = [
  { id: 'PAY-9012', user: 'TOURÉ.', type: 'Abonnement Premium', amount: 20000, method: 'Mobile Money', date: '2026-09-21', status: 'Payé' },
  { id: 'PAY-9011', user: 'Aïcha Kora', type: 'Horizon Boost 24h', amount: 1000, method: 'Mobile Money', date: '2026-09-21', status: 'Payé' },
  { id: 'PAY-9010', user: 'Wax & Co', type: 'Commande #HA-2288', amount: 156000, method: 'Carte bancaire', date: '2026-09-20', status: 'Payé' },
  { id: 'PAY-9009', user: 'Koffi Mensah', type: 'Abonnement Pro', amount: 10000, method: 'Mobile Money', date: '2026-09-19', status: 'En attente' },
  { id: 'PAY-9008', user: 'Sahara Loom', type: 'Horizon Boost 72h', amount: 3000, method: 'Carte bancaire', date: '2026-09-18', status: 'Payé' },
  { id: 'PAY-9007', user: 'Divine Nkurunziza', type: 'Abonnement Starter', amount: 5000, method: 'Mobile Money', date: '2026-09-16', status: 'Échoué' },
]

export const testimonials = [
  ['Aïcha Kora', 'Styliste — Bénin', 'En six mois, mon atelier est passé de 12 à 40 commandes par mois. Les clients me trouvent directement sur mon profil.', 5],
  ['Koffi Mensah', 'Designer — Ghana', 'La marketplace m’a ouvert des débouchés au-delà d’Accra. Les paiements mobile money simplifient tout.', 5],
  ['Fatou Diallo', 'Mannequin — Sénégal', 'Mon book est en ligne et les castings arrivent tout seuls. Horizon Afrique est devenu mon agent digital.', 4],
  ['TOURÉ.', 'Marque — Bénin', 'Nous publions nos collections, nos vidéos et nos produits depuis un seul espace. Notre visibilité a explosé.', 5],
].map((t, i) => {
  const [name, role, quote, note] = t
  return { id: `tst-${i + 1}`, name, role, quote, note, avatar: IMG.people[i * 2 % IMG.people.length] }
})

export const news_highlights = articles.slice(0, 6)

/* ------------------------------ Utilitaires --------------------------- */
export const fcfa = (n) => `${new Intl.NumberFormat('fr-FR').format(n)} FCFA`
export const shortNumber = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '')} k` : `${n}`)
export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
export const fmtShort = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

export const currentUser = {
  name: 'Aïcha Kora',
  firstName: 'Aïcha',
  lastName: 'Kora',
  pro: 'Maison Kora',
  role: 'talent',
  category: 'Stylistes',
  specialty: 'Wax chic',
  country: 'Bénin',
  city: 'Cotonou',
  email: 'aicha.kora@horizonafrique.com',
  phone: '+229 96 45 12 88',
  plan: 'Horizon Pro',
  boostCredits: 3,
  followers: 84500,
  avatar: IMG.people[0],
  cover: IMG.garment[0],
}
