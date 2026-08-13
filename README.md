# Koukku Taituri — Apuri-mallipaketit

Tässä repossa jaellaan **Koukku Taiturin** Apuri-nimitunnistuksen mallitiedostot.
Sovelluksen lähdekoodi ei ole täällä.

## Mikä malli tämä on

| | |
|---|---|
| Lähde | [`urchade/gliner_multi-v2.1`](https://huggingface.co/urchade/gliner_multi-v2.1) |
| Lisenssi | Apache-2.0 |
| Muoto | ONNX (fp32), tokenizer ja configit yhdessä zipissä |

Malli tunnistaa nimiä ja osoitteita monikielisestä tekstistä. Koukku Taiturissa
sitä käytetään asiakirjojen salassapidettävien kohtien löytämiseen — **paikallisesti,
käyttäjän omalla koneella.** Malli ei lähetä mitään minnekään; tämä repo on sen
ainoa verkkoyhteys, ja se on kertalataus.

## Miksi jakelu on erillään

Paketti on noin 920 Mt, joten se ei mahdu asennuspakettiin eikä sovelluksen
lähdekoodirepoon. GitHubin julkaisuliitteiden kaista on ilmainen, ja koska malli
on Apache-2.0, avoin uudelleenjakelu on sekä sallittua että lisenssin hengen
mukaista.

## Organisaatiokäyttö

Suljetussa verkossa mallin voi peilata omaan sisäverkkoon ja osoittaa sovellus
sinne ryhmäkäytännöllä (`ApuriManifestUrl`). Ohjeet:
<https://pdf.koukku.ai/kayttoonotto/ilmavali.html>

## Eheys

Sovellus tarkistaa jokaisen latauksen SHA-256-tarkistesummalla manifestia vasten
ja hylkää paketin jos se ei täsmää. Kunkin julkaisun tarkistesumma on
julkaisumuistiinpanoissa ja mukana `.sha256`-tiedostona.

## Attribuutiot

Ks. [`NOTICE`](NOTICE) ja [`LICENSE`](LICENSE).
