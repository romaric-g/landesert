// ============================================
// 4L Trophy - Configuration
// Modifie ce fichier pour personnaliser ton site
// ============================================

// Dev mode is handled by common.js — no duplication here

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
        photo: "assets/images/Photo meyline transparent 400X400.png",
        description:
          "Étudiante en BTS scientifique à Blanquefort (33).<br/><br/>" +
          "Meyline, de son côté, souhaite s'investir dans un projet concret mêlant aventure et solidarité. Elle voit dans le 4L Trophy l'occasion de contribuer à une cause humanitaire tout en se confrontant à un défi inédit.",
      },
      {
        name: "Cyprien Gauzi",
        role: "Pilote",
        photo: "assets/images/Photo cyprien transparent 400X400.png",
        description:
          "Mécanicien agricole chez Agrivision à Liposthey (40).<br/><br/>" +
          "Cyprien, mécanicien de profession, est passionné par les vieilles mécaniques. Il est fasciné par le fait de pouvoir entretenir et restaurer des véhicules plus anciens que lui, en les ramenant à un état impeccable grâce à ses propres mains.",
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

// Sponsors are now loaded from assets/data/sponsors.json

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
  { small: "assets/images/gallery/small/img_0051.jpg", src: "assets/images/gallery/img_0051.jpg", alt: "Photo 1" },
  { small: "assets/images/gallery/small/img_2364.jpg", src: "assets/images/gallery/img_2364.jpg", alt: "Photo 2" },
  { small: "assets/images/gallery/small/img_2365.jpg", src: "assets/images/gallery/img_2365.jpg", alt: "Photo 3" },
  { small: "assets/images/gallery/small/img_2366.jpg", src: "assets/images/gallery/img_2366.jpg", alt: "Photo 4" },
  { small: "assets/images/gallery/small/img_2387.jpg", src: "assets/images/gallery/img_2387.jpg", alt: "Photo 5" },
  { small: "assets/images/gallery/small/img_2561.jpg", src: "assets/images/gallery/img_2561.jpg", alt: "Photo 6" },
  { small: "assets/images/gallery/small/img_2568.jpg", src: "assets/images/gallery/img_2568.jpg", alt: "Photo 7" },
  { small: "assets/images/gallery/small/img_2617.jpg", src: "assets/images/gallery/img_2617.jpg", alt: "Photo 8" },
  { small: "assets/images/gallery/small/img_2620.jpg", src: "assets/images/gallery/img_2620.jpg", alt: "Photo 9" },
  { small: "assets/images/gallery/small/img_9668.jpg", src: "assets/images/gallery/img_9668.jpg", alt: "Photo 10" },
  { small: "assets/images/gallery/small/img_9673.jpg", src: "assets/images/gallery/img_9673.jpg", alt: "Photo 11" },
  { small: "assets/images/gallery/small/img_9678.jpg", src: "assets/images/gallery/img_9678.jpg", alt: "Photo 12" },
  { small: "assets/images/gallery/small/img_9783.jpg", src: "assets/images/gallery/img_9783.jpg", alt: "Photo 13" },
];
