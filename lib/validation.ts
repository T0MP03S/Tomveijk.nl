import { z } from 'zod'

const contentBlockSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  order: z.number().int().min(0),
  content: z.any(),
})

export const portfolioItemSchema = z.object({
  title: z.string().min(1, 'Titel is verplicht'),
  description: z.string().min(1, 'Beschrijving is verplicht'),
  thumbnail: z.string().min(1, 'Thumbnail is verplicht'),
  type: z.enum(['PROJECT', 'WEBSITE', 'DESIGN', 'VIDEO']).default('PROJECT'),
  embedUrl: z.string().url().optional().or(z.literal('')),
  embeds: z.array(z.string().url()).optional().default([]),
  slug: z.string().min(1, 'Slug is verplicht').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug moet lowercase zijn met alleen letters, cijfers en hyphens'),
  published: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  projectDate: z.string().optional().default(''),
  blocks: z.array(contentBlockSchema).optional().default([]),
})

export const portfolioMediaSchema = z.object({
  type: z.enum(['IMAGE', 'VIDEO']),
  url: z.string().min(1, 'URL is verplicht'),
  caption: z.string().optional(),
  order: z.number().int().min(0).default(0),
})

export const skillSchema = z.object({
  title: z.string().min(1, 'Titel is verplicht'),
  description: z.string().min(1, 'Beschrijving is verplicht'),
  icon: z.string().min(1, 'Icon is verplicht'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Kleur moet een geldige hex code zijn'),
  order: z.number().int().min(0).default(0),
})

/* -------------------------------------------------------------------------
   Demopagina's voor prospects
   ------------------------------------------------------------------------- */

/** Kleuren en typografie, overgenomen van de site van de prospect. */
const demoThemaSchema = z.object({
  primair: z.string().regex(/^#[0-9A-F]{6}$/i, 'Gebruik een hexkleur, bijvoorbeeld #3f6b4a'),
  accent: z.string().regex(/^#[0-9A-F]{6}$/i, 'Gebruik een hexkleur'),
  donker: z.string().regex(/^#[0-9A-F]{6}$/i, 'Gebruik een hexkleur').default('#111827'),
  zacht: z.string().regex(/^#[0-9A-F]{6}$/i, 'Gebruik een hexkleur').default('#f6f7f5'),
  koppen: z.enum(['sans', 'serif']).default('sans'),
})

/**
 * De volledige inhoud van een demopagina. Wordt als JSON in Prospect.inhoud
 * bewaard: de structuur is diep genest en verschilt per branche, dus losse
 * kolommen zouden hier vijf extra tabellen opleveren zonder dat je er iets
 * mee opzoekt.
 */
export const demoInhoudSchema = z.object({
  thema: demoThemaSchema,
  logo: z.string().optional(),

  hero: z.object({
    kop: z.string().min(1, 'Kop is verplicht'),
    tekst: z.string().min(1, 'Tekst is verplicht'),
    afbeelding: z.string().min(1, 'Een achtergrondfoto is verplicht'),
    primaireKnop: z.string().default('Vraag een offerte aan'),
  }),

  usps: z
    .array(z.object({ titel: z.string(), tekst: z.string() }))
    .max(3)
    .default([]),

  diensten: z.object({
    kop: z.string().default('Wat wij doen'),
    intro: z.string().optional(),
    items: z
      .array(
        z.object({
          titel: z.string(),
          tekst: z.string(),
          afbeelding: z.string().optional(),
        }),
      )
      .default([]),
  }),

  projecten: z
    .object({
      kop: z.string().default('Ons werk'),
      intro: z.string().optional(),
      items: z.array(z.object({ titel: z.string(), afbeelding: z.string() })).default([]),
    })
    .optional(),

  over: z
    .object({
      kop: z.string().default('Over ons'),
      tekst: z.array(z.string()).default([]),
      afbeelding: z.string().optional(),
    })
    .optional(),

  reviews: z
    .array(
      z.object({
        naam: z.string(),
        plaats: z.string().optional(),
        tekst: z.string(),
        sterren: z.number().int().min(1).max(5).default(5),
      }),
    )
    .default([]),

  openingstijden: z.array(z.object({ dag: z.string(), tijd: z.string() })).default([]),

  adres: z
    .object({ straat: z.string(), postcode: z.string(), plaats: z.string() })
    .optional(),
  kvk: z.string().optional(),

  contact: z
    .object({ kop: z.string().default('Neem contact op'), tekst: z.string().optional() })
    .default({}),

  /** De verkoopbalk onderaan. Zet `actief` uit zodra iemand klant wordt. */
  pitch: z
    .object({
      actief: z.boolean().default(true),
      prijs: z.number().int().default(750),
      perMaand: z.number().int().default(20),
      jouwEmail: z.string().email().default('info@tomveijk.nl'),
      jouwTelefoon: z.string().default(''),
    })
    .default({}),
})

export type DemoInhoud = z.infer<typeof demoInhoudSchema>

export const PROSPECT_STATUSSEN = [
  'NIEUW',
  'DEMO_KLAAR',
  'GEMAILD',
  'BEKEKEN',
  'GEREAGEERD',
  'GESPREK',
  'KLANT',
  'AFGEWEZEN',
] as const

/** Het prospect zelf: bedrijfsgegevens plus je verkoopadministratie. */
export const prospectSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is verplicht')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Alleen kleine letters, cijfers en streepjes'),
  bedrijf: z.string().min(1, 'Bedrijfsnaam is verplicht'),
  branche: z.string().min(1, 'Branche is verplicht'),
  plaats: z.string().min(1, 'Plaats is verplicht'),
  regio: z.string().min(1, 'Regio is verplicht'),
  huidigeSite: z.string().url('Geen geldige URL').optional().or(z.literal('')),

  contact: z.string().optional().or(z.literal('')),
  email: z.string().email('Geen geldig e-mailadres').optional().or(z.literal('')),
  telefoon: z.string().optional().or(z.literal('')),

  status: z.enum(PROSPECT_STATUSSEN).default('NIEUW'),
  pakket: z.enum(['BASIS', 'COMPLEET', 'MAATWERK']).optional().or(z.literal('')),
  bedrag: z.number().int().nonnegative().optional().nullable(),
  perMaand: z.number().int().nonnegative().optional().nullable(),
  gemaildOp: z.string().optional().or(z.literal('')),
  opgevolgdOp: z.string().optional().or(z.literal('')),
  gereageerdOp: z.string().optional().or(z.literal('')),
  notitie: z.string().optional().or(z.literal('')),

  gepubliceerd: z.boolean().default(false),
  inhoud: demoInhoudSchema.optional().nullable(),
})
