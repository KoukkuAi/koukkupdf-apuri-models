#!/usr/bin/env node
/**
 * MALLIJULKAISUN SAVUTESTI.
 *
 * MIKSI TÄMÄ ON OLEMASSA. 12.8.2026 löytyi, että `public/apuri/models.json`
 * lupasi 920 Mt:n mallin osoitteesta jota ei ollut olemassa. Palvelin vastasi
 * 200 OK ja palautti sivuston HTML-varasivun, joten lataaja sai 8,7 kt HTML:ää
 * 920 Mt:n zipin sijaan. Seuraus: Apurin automaattilataus epäonnistui
 * JOKAISELLA työpöytäkäyttäjällä JOKAISELLA käynnistyksellä — ja koska
 * virhetilassa ei kirjoitettu lippua, virhekortti toistui ikuisesti.
 *
 * 🔴 MIKSI YKSIKÄÄN TESTI EI HUOMANNUT SITÄ. Kaikki testit ajavat
 * paikallisesti. Manifesti on syntaktisesti oikea, sen skeema validoituu, ja
 * `resolveModelUrl` tuottaa oikean osoitteen. Vika ei ollut koodissa vaan
 * siinä että tiedostoa ei ollut viety palvelimelle. Sellaista ei voi nähdä
 * ilman että joku oikeasti pyytää sen osoitteen.
 *
 * Tämä skripti tekee juuri sen: hakee manifestin, ja jokaiselle mallille
 * pyytää tiedoston HEADilla ja vertaa `content-length`ia `sizeBytes`iin.
 * Se ei lataa 920 Mt:ta — HEAD riittää, ja se on koko pointti: portti maksaa
 * millisekunteja mutta olisi estänyt kuukauden mittaisen katkon.
 *
 * KÄYTTÖ
 *   node scripts/tarkista-mallijulkaisu.mjs                 # tuotannon manifesti
 *   node scripts/tarkista-mallijulkaisu.mjs <manifest-url>  # muu ympäristö
 *
 * Paluukoodi 0 = kaikki mallit ovat oikeasti ladattavissa, 1 = jokin ei ole.
 */

const OLETUS = 'https://pdf.koukku.ai/apuri/models.json';
const manifestUrl = process.argv[2] || OLETUS;

// Sallittu poikkeama tavuissa. Ei nolla, koska välityspalvelin voi lisätä
// pakkauksen tai palvelin ilmoittaa koon eri tavalla — mutta tiukka, koska
// juuri se vika jota tämä etsii oli 8 700 tavua vastaan 920 000 000.
const SALLITTU_POIKKEAMA = 0.01; // 1 %

function kt(n) { return `${Math.round(n / 1024).toLocaleString('fi-FI')} kt`; }

let virheita = 0;
const kerro = (ok, teksti) => { console.log(`  ${ok ? 'OK  ' : 'VIKA'} ${teksti}`); if (!ok) virheita++; };

console.log(`\nManifesti: ${manifestUrl}\n`);

let manifest;
try {
  const r = await fetch(manifestUrl, { cache: 'no-store' });
  if (!r.ok) { console.error(`⛔ Manifestia ei saatu: HTTP ${r.status}`); process.exit(1); }
  const tyyppi = r.headers.get('content-type') || '';
  if (!tyyppi.includes('json')) {
    // Sama ansa kuin itse mallissa: varasivu vastaa 200:lla mutta on HTML.
    console.error(`⛔ Manifestin content-type on "${tyyppi}", ei JSONia.`);
    console.error('   Todennäköisesti palvelin tarjoili varasivun. Onko tiedosto viety?');
    process.exit(1);
  }
  manifest = await r.json();
} catch (e) {
  console.error(`⛔ Manifestin haku epäonnistui: ${e.message}`);
  process.exit(1);
}

const mallit = manifest.models || [];
if (!mallit.length) { console.error('⛔ Manifestissa ei ole yhtään mallia.'); process.exit(1); }

for (const m of mallit) {
  const osoite = new URL(m.url, manifestUrl).toString();
  console.log(`${m.id} ${m.version} — odotettu ${kt(m.sizeBytes)}`);
  console.log(`  ${osoite}`);

  let r;
  try {
    // redirect: 'follow' on oletus — GitHubin julkaisulinkki ohjaa
    // objects.githubusercontent.comiin, ja meidän on seurattava sinne.
    r = await fetch(osoite, { method: 'HEAD', redirect: 'follow' });
  } catch (e) {
    kerro(false, `pyyntö epäonnistui: ${e.message}`);
    continue;
  }

  kerro(r.ok, `HTTP ${r.status}`);
  if (!r.ok) continue;

  const tyyppi = (r.headers.get('content-type') || '').toLowerCase();
  // TÄMÄ on se tarkistus joka olisi napannut vian: varasivu on text/html.
  kerro(!tyyppi.includes('text/html'), `content-type: ${tyyppi || '(puuttuu)'}`);

  const pituus = Number(r.headers.get('content-length') || 0);
  if (!pituus) {
    kerro(false, 'content-length puuttuu — kokoa ei voi todentaa');
  } else {
    const ero = Math.abs(pituus - m.sizeBytes) / m.sizeBytes;
    kerro(
      ero <= SALLITTU_POIKKEAMA,
      `koko ${kt(pituus)} vs. manifestin ${kt(m.sizeBytes)} (ero ${(ero * 100).toFixed(2)} %)`
    );
  }
  console.log('');
}

if (virheita) {
  console.error(`⛔ ${virheita} tarkistusta epäonnistui.\n`);
  console.error('   Malli ei ole ladattavissa. Työpöytäsovellus näyttää');
  console.error('   käyttäjälle virheen jokaisella käynnistyksellä, kunnes');
  console.error('   tiedosto on viety julkaisuun.\n');
  process.exit(1);
}
console.log('Kaikki mallit ovat ladattavissa ja oikean kokoisia.\n');
