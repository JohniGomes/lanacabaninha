import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lá Na Cabaninha",
    short_name: "Cabaninha",
    description: "Organização de festas, financeiro e atendimento em um só lugar",
    start_url: "/",
    display: "standalone",
    background_color: "#fdf6f2",
    theme_color: "#f4c6d7",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
