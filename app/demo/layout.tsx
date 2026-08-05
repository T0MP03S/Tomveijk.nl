import './demo.css'

/**
 * Aparte layout voor demopagina's.
 *
 * De stylesheet hoort in een layout en niet in de page: globale CSS die vanuit
 * een page wordt geïmporteerd, laat de build struikelen over het exporteren van
 * de foutpagina's.
 */
export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
