# Klotski Solver

Detta är en webbaserad lösare för Klotski-pusslet (Huáròu mù), ett klassiskt blockpussel där målet är att flytta det stora röda blocket (A) till utgången längst ner i mitten av brädet.

## Funktioner

- Lägg till, ta bort och placera block av olika typer (A, B, C, D).
- Standarduppsättning för klassiskt Klotski-pussel.
- Lös pusslet automatiskt med A\*-sökning.
- Spara lösningen som textfil.
- Tillgänglighetsanpassad och enkel att använda direkt i webbläsaren.

## Så här använder du

1. **Öppna `klotski-solver.html` i din webbläsare.**
2. Lägg till block manuellt eller klicka på **Standarduppsättning** för att ladda ett klassiskt Klotski-bräde.
3. Klicka på **Lös pussel** för att hitta en lösning.
4. Lösningen visas steg för steg. Du kan spara den som textfil.
5. Använd **Rensa brädet** för att börja om.

## Blocktyper

- **A**: Stort 2×2-block (rött, målblock)
- **B**: Vertikalt 2×1-block
- **C**: Horisontellt 1×2-block
- **D**: Litet 1×1-block

## Mål

Flytta det stora A-blocket så att det täcker utgången (rad 5, kolumn 2-3).

## Exempel

Standarduppsättning:

```
. A A .
B . . B
B C C B
D D D D
. . . .
```

## Licens

MIT

---

\*Byggd av fredrik013
