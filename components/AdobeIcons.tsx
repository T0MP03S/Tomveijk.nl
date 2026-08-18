import Image from 'next/image'

export const PhotoshopIcon = () => (
  <Image
    src="/icons/photoshop.svg"
    alt="Photoshop"
    width={80}
    height={80}
    className="w-20 h-20 object-contain"
    style={{ width: '80px', height: '80px' }}
  />
)

export const AfterEffectsIcon = () => (
  <Image
    src="/icons/after-effects.svg"
    alt="After Effects"
    width={80}
    height={80}
    className="w-20 h-20 object-contain"
    style={{ width: '80px', height: '80px' }}
  />
)

export const IllustratorIcon = () => (
  <Image
    src="/icons/illustrator.svg"
    alt="Illustrator"
    width={80}
    height={80}
    className="w-20 h-20 object-contain"
    style={{ width: '80px', height: '80px' }}
  />
)

export const InDesignIcon = () => (
  <Image
    src="/icons/indesign.svg"
    alt="InDesign"
    width={80}
    height={80}
    className="w-20 h-20 object-contain"
    style={{ width: '80px', height: '80px' }}
  />
)

// Officieel Claude-icoon, rechtstreeks uit Anthropic's eigen perskit
// (anthropic.com/press-kit), niet nagetekend. Anthropic's merkrichtlijnen
// vereisen vooraf toestemming voor logogebruik; bewuste keuze van Tom om dit
// zonder die toestemming te gebruiken, met een teruggezet-plan als dat ooit
// een probleem geeft.
export const AIIcon = () => (
  <Image
    src="/icons/claude.svg"
    alt="Claude"
    width={80}
    height={80}
    className="w-20 h-20 object-contain"
    style={{ width: '80px', height: '80px' }}
  />
)
