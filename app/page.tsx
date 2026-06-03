import { Metadata } from "next"
import LandingClient from "./LandingClient"

export const metadata: Metadata = {
  title: "Nexora — Taylor Swift | Full Stack Developer",
  description: "Portfolio and management system built by Taylor Swift using Next.js, AdonisJS, and PostgreSQL. Features CRUD, authentication, and role-based access.",
  openGraph: {
    title: "Nexora — Taylor Swift",
    description: "Full Stack Developer & System Builder. Explore my projects, articles, and gallery.",
    type: "website",
    images: [
      {
        url: "/background.jpg",
        width: 1200,
        height: 630,
        alt: "Nexora by Taylor Swift",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexora — Taylor Swift",
    description: "Full Stack Developer & System Builder.",
    images: ["/background.jpg"],
  },
}

export default function HomePage() {
  return <LandingClient />
}