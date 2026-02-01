'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center" style={{ 
      background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 100%)',
      perspective: '1200px'
    }}>
      <style jsx>{`
        @property --swing-x {
          initial-value: 0;
          inherits: false;
          syntax: '<integer>';
        }
        
        @property --swing-y {
          initial-value: 0;
          inherits: false;
          syntax: '<integer>';
        }
        
        @keyframes swing {
          0% {
            --swing-x: -100;
            --swing-y: -100;
          }
          50% {
            --swing-y: 0;
          }
          100% {
            --swing-y: -100;
            --swing-x: 100;
          }
        }
        
        .title-404 {
          animation: swing 2s infinite alternate ease-in-out;
          font-size: clamp(5rem, 40vmin, 20rem);
          font-weight: 800;
          margin: 0;
          margin-bottom: 2rem;
          letter-spacing: 1rem;
          transform: translate3d(0, 0, 0vmin);
          --x: calc(50% + (var(--swing-x) * 0.5) * 1%);
          background: radial-gradient(#E0E0E0, #A34BFF 45%) var(--x) 100% / 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          display: inline-block;
          filter: drop-shadow(0 2vmin 4vmin rgba(0, 0, 0, 0.9))
                  drop-shadow(0 4vmin 8vmin rgba(0, 0, 0, 0.7))
                  drop-shadow(0 6vmin 12vmin rgba(0, 0, 0, 0.5));
        }
        
        .cloak-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          overflow: hidden;
          pointer-events: none;
        }
        
        .cloak-container {
          height: 250vmax;
          width: 250vmax;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        
        .cloak {
          animation: swing 2s infinite alternate-reverse ease-in-out;
          height: 100%;
          width: 100%;
          transform-origin: 50% 30%;
          transform: rotate(calc(var(--swing-x) * -0.25deg));
          background: radial-gradient(40% 40% at 50% 42%, transparent, rgba(0, 0, 0, 0.8) 35%);
        }
      `}</style>

      {/* Cloak effect */}
      <div className="cloak-wrapper">
        <div className="cloak-container">
          <div className="cloak" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl">
        <h1 className="title-404">404</h1>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Oeps! Deze pagina bestaat niet
            </h2>
            
            <p className="text-white/60 leading-relaxed mb-8 max-w-2xl mx-auto">
              De pagina die je zoekt is verplaatst, verwijderd, hernoemd of heeft mogelijk nooit bestaan. 
              Geen zorgen, we helpen je graag verder!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#A34BFF] to-[#30A8FF] text-white font-medium uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-[#A34BFF]/50 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Terug naar home
            </Link>
            
            <Link
              href="/#portfolio"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-white/20 text-white font-medium uppercase tracking-wider transition-all duration-300 hover:bg-white/5 hover:border-white/30"
            >
              Bekijk portfolio
            </Link>
          </div>

          <div className="pt-8">
            <p className="text-white/40 text-sm">
              Denk je dat dit een fout is? {' '}
              <a 
                href="/#contact" 
                className="text-[#30A8FF] hover:text-[#A34BFF] transition-colors underline"
              >
                Laat het ons weten
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
