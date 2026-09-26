-- Portfolio opnieuw ordenen: sterkste vormgeving eerst, websites achteraan.
-- De homepage toont de eerste zes vormgevingsitems op deze volgorde.
UPDATE "PortfolioItem" SET "order" = 0  WHERE "slug" = 'stuk-instagram-posts';
UPDATE "PortfolioItem" SET "order" = 1  WHERE "slug" = 'radio-538';
UPDATE "PortfolioItem" SET "order" = 2  WHERE "slug" = 'freaky-food-festival';
UPDATE "PortfolioItem" SET "order" = 3  WHERE "slug" = 'snickers';
UPDATE "PortfolioItem" SET "order" = 4  WHERE "slug" = 'xander-houtman';
UPDATE "PortfolioItem" SET "order" = 5  WHERE "slug" = 'stilo-design';
UPDATE "PortfolioItem" SET "order" = 6  WHERE "slug" = 'kamer-van-koophandel';
UPDATE "PortfolioItem" SET "order" = 7  WHERE "slug" = 'talpa-social-2';
UPDATE "PortfolioItem" SET "order" = 8  WHERE "slug" = 'kalvijn';
UPDATE "PortfolioItem" SET "order" = 9  WHERE "slug" = 'idtv';
UPDATE "PortfolioItem" SET "order" = 10 WHERE "slug" = 'foto-manipulatie';
UPDATE "PortfolioItem" SET "order" = 11 WHERE "slug" = 'group-m';
UPDATE "PortfolioItem" SET "order" = 12 WHERE "slug" = 'dasha';
UPDATE "PortfolioItem" SET "order" = 13 WHERE "slug" = 'past-pursuits';
UPDATE "PortfolioItem" SET "order" = 14 WHERE "slug" = 'gg-shields';
UPDATE "PortfolioItem" SET "order" = 15 WHERE "slug" = 'odinkverbouw';
UPDATE "PortfolioItem" SET "order" = 16 WHERE "slug" = 'defensie';
UPDATE "PortfolioItem" SET "order" = 20 WHERE "slug" = 'frank-van-eijk';
UPDATE "PortfolioItem" SET "order" = 21 WHERE "slug" = 'klasflix';
UPDATE "PortfolioItem" SET "order" = 22 WHERE "slug" = 'robben-rosmalen';

-- Categorieën die niet klopten.
-- De 538-opener is bewegend beeld.
UPDATE "PortfolioItem" SET "type" = 'VIDEO'   WHERE "slug" = 'radio-538';
-- Een Photoshop-compositie, geen video.
UPDATE "PortfolioItem" SET "type" = 'DESIGN'  WHERE "slug" = 'foto-manipulatie';
-- Branding en campagne voor een kledingmerk.
UPDATE "PortfolioItem" SET "type" = 'PROJECT' WHERE "slug" = 'stilo-design';

-- Dasha hoort niet meer in het portfolio. Verborgen, niet verwijderd.
UPDATE "PortfolioItem" SET "published" = false WHERE "slug" = 'dasha';
