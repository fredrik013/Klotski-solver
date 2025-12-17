# Klotski Solver

Detta är en webbaserad lösare för Klotski-pusslet (Huáròu mù), ett klassiskt blockpussel där målet är att flytta det stora röda blocket (A) till utgången längst ner i mitten av brädet.

## 🎮 Live Demo

**[Spela direkt i webbläsaren →](https://fredrik013.github.io/klotski-solver/)**

## Funktioner

- **Interaktiv blockhantering**: Lägg till, ta bort och placera block av olika typer (A, B, C, D)
- **Grafisk visualisering**: Färgkodade block med tydlig positionsinformation
- **Standarduppsättning**: Förkonfigurerat klassiskt Klotski-pussel för snabb start
- **Automatisk lösning**: Avancerad A\*-sökning hittar optimala lösningar
- **Stegvis genomgång**: Navigera fram och tillbaka genom lösningen
- **Fullständig tillgänglighet**: Optimerad för skärmläsare med tydliga aria-labels
- **Exportfunktion**: Spara lösningen som textfil
- **Responsiv design**: Fungerar på både desktop och mobila enheter

## Så här använder du

1. **Öppna live demon eller `klotski-solver.html` i din webbläsare**
2. **Ladda ett pussel**:
   - Klicka på **Standarduppsättning** för klassiskt Klotski-bräde
   - Eller lägg till block manuellt genom att välja typ och position
3. **Lös pusslet**: Klicka på **Lös pussel** för att hitta lösningen
4. **Utforska lösningen**:
   - Använd **Föregående/Nästa** för att gå igenom varje steg
   - Det grafiska brädet uppdateras för varje drag
5. **Spara**: Klicka på **Spara lösning** för att exportera som textfil
6. **Börja om**: Använd **Rensa brädet** för att starta från början

## Blocktyper

- **A (röd)**: Stort 2×2-block - målblocket som ska nå utgången
- **B (blå)**: Vertikalt 2×1-block
- **C (gul)**: Horisontellt 1×2-block
- **D (grön)**: Litet 1×1-block

## Spelregler

**Mål**: Flytta det stora A-blocket så att det täcker utgångspositionerna (markerade med "Utgång") på rad 5, kolumn 2-3.

**Brädet**: 5×4 rutor med block som kan glida men inte lyftas eller roteras.

## Tillgänglighet

Denna solver är helt optimerad för skärmläsare:

- Varje position på brädet annonseras tydligt ("Block A, typ A, färg röd" eller "Tom position" eller "Utgång")
- Fullständig tangentbordsnavigation
- Live regions för dynamiska uppdateringar
- Tydliga aria-labels på alla interaktiva element

## Teknisk information

- **Algoritm**: A\*-sökning med intelligent heuristik
- **Optimering**: Effektiv tillståndsnyckelgenerering och kollisionsdetektering
- **Prestanda**: Kan lösa komplexa pussel på sekunder
- **Kompatibilitet**: Fungerar i alla moderna webbläsare utan externa beroenden
- **Mobilvänlig**: Responsiv design för telefoner och surfplattor

## Standarduppsättning

Det klassiska Klotski-pusslet:

```
B1 A  A  B2
B1 A  A  B2
B3 C1 C1 B4
D3 D4 D4 D2
D1 Utgång Utgång D2
```

Där:

- `A` = Det röda 2×2 målblocket
- `B1-B4` = Fyra blå vertikala block (2×1)
- `C1` = Ett gult horisontellt block (1×2)
- `D1-D4` = Fyra gröna små block (1×1)
- `Utgång` = Målpositioner för A-blocket

## Licens

MIT

---

_Byggd av fredrik013_
