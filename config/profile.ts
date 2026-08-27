/**
 * ptree configuration.
 *
 * Edit this file and push to GitHub — a GitHub Actions workflow builds the
 * site and deploys it to GitHub Pages automatically.
 *
 * See the README for the full reference of every supported option.
 */

export default {
  lang: "tr",

  profile: {
    name: "Padros",
    username: "padrosum",
    bio: "Aristotelesçi · Özgür Yazılımcı · Felsefeci",
    avatar: "/avatar.svg",
    location: "Şanlıurfa",
  },

  theme: {
    name: "void",
    mode: "auto",
    accent: "#e5484d",
    font: "system",
    linkStyle: "card",
  },

  background: "voxel",

  links: [
    {
      title: "Kişisel Site",
      url: "https://padrosum.uk",
      icon: "globe",
      description: "Yazılarım, notlarım ve uzun form denemelerim.",
      featured: true,
    },
    {
      title: "Mustakil Dergi",
      url: "https://www.mustakildergi.com",
      icon: "book",
      description: "Mustakil Dergi'deki yazılarım.",
      badge: "Dergi",
    },
    {
      title: "Pixora",
      url: "https://padrosum.uk/pixora",
      icon: "sparkles",
      description: "Pixora projesi.",
      badge: "Proje",
    },
    {
      title: "Pmusic - FOSS CLI Music Player",
      url: "https://pmusic.alihankarakus.com/",
      icon: "music",
      description: "Özgür ve açık kaynaklı komut satırı müzik oynatıcı.",
      badge: "FOSS",
    },
    {
      title: "PlovesPDF",
      url: "https://github.com/Padrosum/plovespdf",
      icon: "file",
      description: "ILOVEPDF'in FOSS hali.",
      badge: "FOSS",
    },
  ],

  socials: [
    { platform: "github", url: "https://github.com/Padrosum" },
    { platform: "x", url: "https://x.com/padrosum" },
    { platform: "email", url: "mailto:padrosozel@gmail.com" },
    { platform: "email", url: "mailto:padrosum@disroot.org" },
  ],

  seo: {
    title: "Padros — kişisel site",
    description:
      "Mustakil Dergi yazarı · Linux · Açık kaynak. Tüm bağlantılarım tek yerde.",
    image: "/avatar.svg",
    twitterHandle: "@padrosum",
  },

  footer: {
    showPoweredBy: true,
  },
};
