'use client'

import { useState } from 'react'

/**
 * Het offerteformulier op de demo.
 *
 * Er hangt bewust geen mailkoppeling achter — dit is de site van iemand die nog
 * geen klant is. Maar een knop die niets doet leest als een kapotte site, dus
 * leggen we uit wat er straks gebeurt. Dat verkoopt beter dan stilte.
 */
export default function DemoContactFormulier() {
  const [verstuurd, setVerstuurd] = useState(false)

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        setVerstuurd(true)
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Naam</span>
          <input type="text" name="naam" autoComplete="name" className="demo-veld" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold">Telefoon</span>
          <input type="tel" name="telefoon" autoComplete="tel" className="demo-veld" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">E-mailadres</span>
        <input type="email" name="email" autoComplete="email" className="demo-veld" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">Waar kunnen we mee helpen?</span>
        <textarea name="bericht" rows={4} className="demo-veld resize-y" />
      </label>

      <button type="submit" className="demo-knop demo-knop--primair w-full">
        Verstuur aanvraag
      </button>

      {verstuurd && (
        <p
          role="status"
          className="rounded-lg bg-white px-4 py-3 text-center text-[0.9375rem] font-semibold"
        >
          Dit is een voorbeeldpagina — op de echte site komt dit bericht meteen in je mailbox binnen.
        </p>
      )}
    </form>
  )
}
