import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PubQuiz",
    short_name: "PubQuiz",
    description: "Web app to host and manage pub quizzes",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icons/pubquiz.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      {
        src: "/icons/pubquiz-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
