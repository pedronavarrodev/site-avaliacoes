import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { FaWhatsapp } from "react-icons/fa"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Comprar Avaliações Google",
  description: "Compre avaliações positivas para seu negócio no Google",
}

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5519997177103"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50 flex items-center justify-center"
      aria-label="Contato via WhatsApp"
    >
      <FaWhatsapp className="w-6 h-6" />
    </a>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  )
} 