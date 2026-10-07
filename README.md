# PDF Taituri — Apuri-mallipaketit

Tässä repossa jaellaan [PDF Taiturin](https://pdftaituri.fi) Apuri-nimitunnistuksen
mallitiedostot. Työpöytäsovelluksen nimi on Koukku Taituri.
Sovelluksen lähdekoodi ei ole täällä.

*In English below.*

## Mikä malli tämä on

| | |
|---|---|
| Lähde | [`urchade/gliner_multi-v2.1`](https://huggingface.co/urchade/gliner_multi-v2.1) |
| Lisenssi | Apache-2.0 |
| Muoto | ONNX (fp32), tokenizer ja configit yhdessä zipissä |

Malli tunnistaa nimiä ja osoitteita monikielisestä tekstistä. PDF Taiturissa
sitä käytetään asiakirjojen salassapidettävien kohtien löytämiseen — **paikallisesti,
käyttäjän omalla koneella.** Malli ei lähetä mitään minnekään; tämä repo on sen
ainoa verkkoyhteys, ja se on kertalataus.

Lisätietoa Apurista: <https://pdftaituri.fi/kayttoonotto/apuri.html>

## Miksi jakelu on erillään

Paketti on noin 920 Mt, joten se ei mahdu asennuspakettiin eikä sovelluksen
lähdekoodirepoon. GitHubin julkaisuliitteiden kaista on ilmainen, ja koska malli
on Apache-2.0, avoin uudelleenjakelu on sekä sallittua että lisenssin hengen
mukaista.

## Organisaatiokäyttö

Suljetussa verkossa mallin voi peilata omaan sisäverkkoon ja osoittaa sovellus
sinne ryhmäkäytännöllä (`ApuriManifestUrl`). Ohjeet:
<https://pdftaituri.fi/kayttoonotto/ilmavali.html>

## Eheys

Sovellus tarkistaa jokaisen latauksen SHA-256-tarkistesummalla manifestia vasten
ja hylkää paketin jos se ei täsmää. Kunkin julkaisun tarkistesumma on
julkaisumuistiinpanoissa ja mukana `.sha256`-tiedostona.

## Tekijä

PDF Taiturin ja Apurin on rakentanut [John Tammi](https://www.johntammi.fi),
[Koukku.ai](https://koukku.ai):n perustajaosakas ja CTO. Julkaisija on Koukku.ai
(Koukku Kapital Oy, Turku).

## Attribuutiot

Ks. [`NOTICE`](NOTICE) ja [`LICENSE`](LICENSE).

---

## In English

This repository distributes the model files for Apuri, the named-entity
recognition model in [PDF Taituri](https://pdftaituri.fi) (desktop app name: Koukku Taituri),
a Finnish PDF toolkit by [Koukku.ai](https://koukku.ai). The app's source code is not here.

- **Model:** [`urchade/gliner_multi-v2.1`](https://huggingface.co/urchade/gliner_multi-v2.1),
  converted to ONNX (fp32) with tokenizer and configs in one zip. Apache-2.0.
- **What it does:** finds names and addresses in multilingual text so PDF Taituri
  can locate confidential passages in documents. It runs **entirely on the user's
  own machine**. The model sends nothing anywhere; this repository is its only
  network connection, and that is a one-time download.
- **Integrity:** the app verifies every download against a SHA-256 checksum in
  the manifest and rejects the package if it does not match.
- **Air-gapped networks:** organisations can mirror the model internally and point
  the app to it with a group policy (`ApuriManifestUrl`), see
  <https://pdftaituri.fi/kayttoonotto/ilmavali.html> (in Finnish).

**Maker:** PDF Taituri and Apuri are built by [John Tammi](https://www.johntammi.fi/en),
Co-founder, Partner & CTO at [Koukku.ai](https://koukku.ai/en). Published by
Koukku.ai (Koukku Kapital Oy, Turku, Finland).

Attributions: see [`NOTICE`](NOTICE) and [`LICENSE`](LICENSE).
