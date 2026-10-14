# Missing product data

Generated 2026-10-14 from the local development database (`ayyara_rebirth`), which has one perfume. Staging and production may have more, so before asking the client, rerun this against the staging API with `API_URL=<staging API>/api/v1 npm run report:missing-data`. That command rewrites this file.

Each perfume below is on the website but is missing fragrance-profile details. The website shows only what is filled in and never guesses, so the product page, its questions and its search data stay incomplete until these are supplied.

**Where to fill them in:** Admin → Stock → the perfume → Edit → *Fragrance profile*.

**What to ask the client for:** facts they or the perfumer can stand behind. Longevity is in hours on skin. For projection, use soft, moderate or strong. Seasons are summer, monsoon or winter. Allergens should be as printed on the box. For a similar scent profile, describe the style rather than naming other brands.

## Ayyara One

Page: `/products/ayyara-one` · Eau de Parfum · 60 ml

Its notes are currently typed into the description ("Top : sea water, lavender / Mid: sandlwood and jadmine / Base:lavender and agarwood"), with spelling mistakes. Move them into the notes fields once the client confirms the spelling, and give the description a sentence or two about the perfume instead.

- [ ] Top notes
- [ ] Heart notes
- [ ] Base notes
- [ ] Fragrance family
- [ ] Longevity (hours)
- [ ] Projection / sillage
- [ ] Best season
- [ ] Best occasion
- [ ] Similar scent profile
- [ ] Key ingredients
- [ ] Allergen information
- [ ] Perfumer
- [ ] Launch year
