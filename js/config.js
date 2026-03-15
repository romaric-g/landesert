// ============================================
// 4L Trophy - Configuration
// Modifie ce fichier pour personnaliser ton site
// ============================================

export const siteConfig = {
  teamName: "Team 4L Trophy",
  tagline: "Cap sur l'aventure — 4L Trophy 2027",
  aboutText:
    "Nous sommes une équipe passionnée prête à relever le défi du 4L Trophy. " +
    "Un raid solidaire et aventurier à travers le Maroc au volant de notre Renault 4L. " +
    "Suivez notre aventure et découvrez nos partenaires qui rendent ce projet possible !",
  devMode: true, // true = affiche axes + coordonnées au clic pour positionner les sponsors
};

// Couleurs du modèle 3D (matériaux séparés dans le GLB)
// Mapping des pièces du modèle 3D :
// carrosserie = métal, phares, porte droite (model_1)
// wheels = carrosserie principale (model_0)
// interior = contours fenêtres, plaque, châssis (model_2)
// vitres = petits détails (model_3)
export const carColors = {
  carrosserie: "#a8c7c1", // Métal/phares/porte droite — vert d'eau
  wheels: "#a8c7c1",       // Carrosserie principale — même couleur
  interior: "#333333",     // Contours fenêtres, plaque, châssis — gris foncé
  vitres: "#a8c7c1",       // Détails — même couleur carrosserie
};

export const modelPath = "assets/models/4l.glb";

// Sponsors — chaque sponsor peut avoir un décal (logo sur la carrosserie)
// Pour positionner : active devMode et double-clique sur la voiture pour voir les coordonnées + normales
// position: point sur la surface de la voiture
// orientation: rotation du décal en radians { x, y, z }
// size: taille du décal { width, height, depth } (depth = profondeur de projection)
export const sponsors = [
  {
    id: "sponsor-ecpb",
    name: "ECPB",
    logo: "assets/images/sponsors/ECPB-LOGO.png",
    url: "https://example.com",
    description: "ECPB, sponsor de notre aventure 4L Trophy.",
    decal: {
      position: { x: -0.018, y: 0.657, z: 0.808 },
      orientation: { x: -Math.PI / 2, y: 0, z: 0 },
      size: { width: 0.4, height: 0.3, depth: 0.3 },
    },
    color: "#E94D1A",
  },
  {
    id: "sponsor-kingtony",
    name: "King Tony",
    logo: "assets/images/sponsors/KING-TONY.png",
    url: "https://example.com",
    description: "King Tony, partenaire outillage de notre équipe.",
    decal: {
      position: { x: 0.470, y: 0.449, z: 0.216 },
      orientation: { x: 0, y: Math.PI / 2, z: 0 },
      size: { width: 0.3, height: 0.2, depth: 0.3 },
    },
    color: "#C2956B",
  },
  {
    id: "sponsor-familiedem",
    name: "Familie Dem",
    logo: "assets/images/sponsors/LOGO-FAMILIE-DEM.jpg",
    url: "https://example.com",
    description: "Familie Dem, partenaire solidaire du 4L Trophy.",
    decal: {
      position: { x: -0.500, y: 0.471, z: 0.127 },
      orientation: { x: 0, y: -Math.PI / 2, z: 0 },
      size: { width: 0.3, height: 0.2, depth: 0.3 },
    },
    color: "#4A90D9",
  },
];

export const socialLinks = [
  {
    platform: "instagram",
    url: "#",
    label: "Instagram",
  },
  {
    platform: "tiktok",
    url: "#",
    label: "TikTok",
  },
  {
    platform: "facebook",
    url: "#",
    label: "Facebook",
  },
];

export const galleryImages = [
  { src: "https://placehold.co/600x400/C2956B/1A1A2E?text=Photo+1", alt: "Photo d'équipe 1" },
  { src: "https://placehold.co/600x400/1A1A2E/F0E6D3?text=Photo+2", alt: "Préparation de la 4L" },
  { src: "https://placehold.co/600x400/E94D1A/F0E6D3?text=Photo+3", alt: "Sur la route" },
  { src: "https://placehold.co/600x400/8B6F5E/F0E6D3?text=Photo+4", alt: "Paysage désert" },
  { src: "https://placehold.co/600x400/C2956B/1A1A2E?text=Photo+5", alt: "Arrivée au Maroc" },
  { src: "https://placehold.co/600x400/1A1A2E/F0E6D3?text=Photo+6", alt: "L'équipe au complet" },
];
