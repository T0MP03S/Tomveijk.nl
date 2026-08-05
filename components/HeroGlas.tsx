'use client'

/**
 * Matglas over een gekleurde gloed.
 *
 * De vorige poging met three.js liep stuk op iets fundamenteels: glas ontleent
 * zijn uiterlijk aan wat erachter zit, en de hero heeft een egale donkere
 * achtergrond. Hier zit de kleur wél achter het glas, dus valt er iets te
 * vervagen en te breken — en dat is precies wat `backdrop-filter` doet.
 *
 * Kosten: nul JavaScript, geen afbeeldingen, geen externe verzoeken.
 */

export default function HeroGlas({ className = '' }: { className?: string }) {
  return (
    <div className={`hero-glas ${className}`} aria-hidden="true">
      {/* Achter het glas: de kleurvelden in je merkkleuren. */}
      <span className="hero-glas__kleur hero-glas__kleur--groen" />
      <span className="hero-glas__kleur hero-glas__kleur--blauw" />
      <span className="hero-glas__kleur hero-glas__kleur--paars" />

      {/* Het glas zelf. */}
      <span className="hero-glas__plaat">
        <span className="hero-glas__glans" />
      </span>

      {/* Kleinere schijf ervoor, voor diepte. */}
      <span className="hero-glas__schijf" />

      {/* Fijne korrel over het geheel, tegen het gladde bankenlogo-gevoel. */}
      <span className="hero-glas__korrel" />
    </div>
  )
}
