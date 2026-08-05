'use client'

/**
 * Het logo als geanimeerde SVG.
 *
 * Vervangt de GIF van 6,6 MB. Die was niet alleen zwaar maar ook onherstelbaar
 * lelijk: GIF kent maar één bit transparantie, dus zachte randen zaten
 * vastgebakken op wit (vandaar de witte rand), en 256 kleuren gaven banding in
 * de gradiënt. Vectoren hebben geen van beide problemen.
 *
 * De animatie: een brede band met jouw merkkleuren schuift diagonaal door het
 * logo heen, bijgesneden op de logovorm. Omdat de gradiënt op `repeat` staat en
 * we precies één kleurperiode opschuiven, is de lus naadloos — je ziet nooit
 * een sprong.
 *
 * Kosten: ~2 KB, geen netwerkverzoek, en de animatie draait op de GPU.
 */

interface Props {
  className?: string
  /** Staat er voor de compatibiliteit met de oude aanroepen; vectoren laden altijd direct. */
  priority?: boolean
}

// Eén kleurperiode. De rechthoek schuift precies deze afstand op, waardoor het
// beeld na afloop identiek is aan het begin.
const PERIODE = 1188

export function LogoAnimation({ className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 594.06 370.18"
      xmlns="http://www.w3.org/2000/svg"
      className={`logo-animatie ${className}`}
      role="img"
      aria-label="tomveijk logo"
    >
      <defs>
        <clipPath id="logo-vorm">
          <path d="M562.99.13c-.7-.04-1.41-.06-2.12-.07-1.62-.04-3.24-.06-4.88-.06s-3.22.02-4.82.06c-11.19.3-22.13,1.57-32.75,3.75-33.39,6.89-63.47,22.76-87.6,45.02-12.43,11.47-31.49,11.68-43.94.22C354.6,19.32,311.79.93,264.97.06v-.06H32.25C14.44,0,0,14.44,0,32.25v11.13c0,17.81,14.44,32.25,32.25,32.25h9.12c17.81,0,32.25,14.44,32.25,32.25v230.05c0,17.81,14.44,32.25,32.25,32.25h155.58c1.18,0,2.34-.01,3.51-.04,58.41-1.09,110.55-29.44,143.84-72.92,23.82-31.05,37.99-69.81,37.99-111.88,0-16.09,3.61-31.49,10.06-45.4,14.56-31.4,61.56-21.13,61.56,13.48v184.49c0,17.81,14.44,32.25,32.25,32.25h11.13c17.81,0,32.25-14.44,32.25-32.25V32.36c0-17.23-13.54-31.56-30.75-32.22-.11,0-.21,0-.32-.01ZM261.46,294.54c-59.6,0-109.19-49.58-109.19-109.19s49.59-109.7,109.19-109.7,108.2,50.1,108.2,109.7-48.57,109.19-108.2,109.19Z" />
        </clipPath>

        <linearGradient
          id="logo-stroom"
          x1="0"
          y1="0"
          x2={PERIODE}
          y2={PERIODE * 0.62}
          gradientUnits="userSpaceOnUse"
          spreadMethod="repeat"
        >
          <stop offset="0" stopColor="#00e93c" />
          <stop offset="0.34" stopColor="#0252f4" />
          <stop offset="0.67" stopColor="#b54aff" />
          <stop offset="1" stopColor="#00e93c" />
        </linearGradient>
      </defs>

      <g clipPath="url(#logo-vorm)">
        <rect
          className="logo-stroom"
          x={-PERIODE}
          y={-PERIODE}
          width={PERIODE * 4}
          height={PERIODE * 4}
          fill="url(#logo-stroom)"
        />
      </g>

      <style>{`
        .logo-animatie {
          overflow: visible;
          filter: drop-shadow(0 0 42px rgb(2 82 244 / 0.28));
          animation: logo-zweven 7s ease-in-out infinite;
        }

        .logo-stroom {
          animation: logo-stromen 9s linear infinite;
        }

        @keyframes logo-stromen {
          from { transform: translate(0, 0); }
          to   { transform: translate(${PERIODE}px, ${PERIODE * 0.62}px); }
        }

        @keyframes logo-zweven {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-1.6%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .logo-animatie,
          .logo-stroom {
            animation: none;
          }
        }
      `}</style>
    </svg>
  )
}
