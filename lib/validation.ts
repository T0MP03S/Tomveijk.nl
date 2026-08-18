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
