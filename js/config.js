// ============================================
// 4L Trophy - Configuration
// Modifie ce fichier pour personnaliser ton site
// ============================================

// Toggle dev mode from console: toggle_dev()
window.toggle_dev = function() {
  const key = "4ltrophy_dev_mode";
  const active = localStorage.getItem(key) === "1";
  if (active) {
    localStorage.removeItem(key);
    console.log("%cMode développeur désactivé", "color:red;font-weight:bold");
  } else {
    localStorage.setItem(key, "1");
    console.log("%cMode développeur activé", "color:green;font-weight:bold");
  }
  location.reload();
};

// Show dev banner if active
if (localStorage.getItem("4ltrophy_dev_mode") === "1") {
  document.addEventListener("DOMContentLoaded", () => {
    const banner = document.createElement("div");
    banner.textContent = "Mode développeur";
    Object.assign(banner.style, {
      position: "fixed", top: "0", left: "0", right: "0", zIndex: "9999",
      background: "#e85d3a", color: "white", textAlign: "center",
      padding: "4px 0", fontSize: "12px", fontFamily: "sans-serif",
      fontWeight: "600", letterSpacing: "1px", pointerEvents: "none",
    });
    document.body.appendChild(banner);
    document.body.style.paddingTop = "24px";
  });
}

export const siteConfig = {
  teamName: "Landesert",
  tagline: "Équipage #557 — 30ᵉ édition du 4L Trophy",
  subtitle: "Du 17 au 28 février 2027 · Biarritz → Maroc",
  devMode: localStorage.getItem("4ltrophy_dev_mode") === "1",

  // Section Équipe
  team: {
    intro:
      "Nous sommes Meyline et Cyprien Gauzi, frère et sœur unis par la passion de l'aventure et la solidarité.",
    members: [
      {
        name: "Meyline Gauzi",
        role: "Co-pilote",
        description:
          "Étudiante en 3ème année de BUT Génie Biologique à l'IUT Paul Sabatier de Toulouse. " +
          "Passionnée par les défis humains et solidaires.",
      },
      {
        name: "Cyprien Gauzi",
        role: "Pilote",
        description:
          "Étudiant en 2ème année de BTS Maintenance des Véhicules à Dax. " +
          "Passionné d'automobile et de mécanique, c'est lui qui prépare notre 4L.",
      },
    ],
  },

  // Section 4L Trophy
  event: {
    title: "Le 4L Trophy",
    description:
      "Le 4L Trophy est le plus grand raid étudiant humanitaire d'Europe. " +
      "Chaque année, plus de 1 000 équipages s'élancent au volant de leur Renault 4L " +
      "pour rallier le Maroc depuis Biarritz. Ce n'est pas une course de vitesse, " +
      "mais un défi d'orientation et de solidarité sur plus de 6 000 km de routes et de pistes.",
    stats: [
      { value: "30ᵉ", label: "édition" },
      { value: "6 000+", label: "km de parcours" },
      { value: "1 000+", label: "équipages" },
      { value: "10", label: "jours d'aventure" },
    ],
  },

  // Section Humanitaire
  humanitarian: {
    title: "Notre Mission Solidaire",
    association: "Enfants du Désert",
    description:
      "Le 4L Trophy est avant tout une aventure solidaire. Chaque équipage transporte " +
      "des fournitures scolaires et du matériel sportif destinés aux enfants du Maroc. " +
      "L'association Enfants du Désert œuvre depuis plus de 20 ans pour améliorer les conditions " +
      "de vie des populations isolées du sud marocain : construction d'écoles, accès à l'eau potable, " +
      "soutien scolaire et parrainage.",
    actions: [
      "Fournitures scolaires pour les écoles rurales",
      "Matériel sportif pour les enfants",
      "Soutien à l'association Enfants du Désert",
    ],
  },

  // Section Association Landesert
  association: {
    title: "L'Association Landesert",
    description:
      "Pour porter ce projet, nous avons créé l'association Landesert. " +
      "Elle nous permet de collecter des fonds, de gérer nos partenariats " +
      "et d'organiser nos actions solidaires. Notre objectif : réunir le budget nécessaire " +
      "pour participer au 4L Trophy tout en maximisant notre impact humanitaire.",
  },

  contact: {
    email: "landesert.4ltrophy@gmail.com",
  },
};

// Couleurs du modèle 3D (matériaux séparés dans le GLB)
// Mapping des pièces du modèle 3D :
// carrosserie = métal, phares, porte droite (model_1)
export const carColors = {
  peinture: "#a8c7c1",
  peinture1: "#a8c7c1",
  peinture2: "#a8c7c1",
  peinture3: "#a8c7c1",
  caouchou: "#222222",
  metal_noir: "#1a1a1a",
  metal_noir1: "#1a1a1a",
  chrome: "#cccccc",
  cuir: "#3b2a1a",
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
    url: "https://www.instagram.com/Landesert_4ltrophy/",
    label: "Instagram",
  },
  {
    platform: "tiktok",
    url: "https://www.tiktok.com/@landesert",
    label: "TikTok",
  },
  {
    platform: "facebook",
    url: "https://www.facebook.com/profile.php?id=61575071498498",
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
