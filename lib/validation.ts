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

   De pagina zelf staat als los bestand in demos/<slug>.html — elke demo is een
   eigen ontwerp, geen ingevuld sjabloon. Hier valideren we alleen het prospect:
   bedrijfsgegevens, verkoopadministratie en de instellingen van de verkoopbalk.
   ------------------------------------------------------------------------- */

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
  pitchActief: z.boolean().default(true),
  pitchPrijs: z.number().int().nonnegative().default(750),
  pitchPerMaand: z.number().int().nonnegative().default(20),
})
