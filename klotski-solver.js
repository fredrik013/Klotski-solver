const blocks = [];
let blockCounter = { A: 0, B: 0, C: 0, D: 0 };

function getBlockDimensions(type) {
  switch (type) {
    case "A":
      return [2, 2];
    case "B":
      return [2, 1];
    case "C":
      return [1, 2];
    case "D":
      return [1, 1];
    default:
      return [1, 1];
  }
}

function getNextBlockId(type) {
  blockCounter[type]++;
  return blockCounter[type] === 1 && type === "A"
    ? "A"
    : type + blockCounter[type];
}

// Klotski-solver med A*-sökning och robust tillståndsnyckel
class AdvancedKlotskiSolver {
  constructor(blocks) {
    this.blocks = blocks.map((b) => ({
      id: b.id,
      type: b.type,
      shape: [...b.shape],
      position: [...b.position],
    }));
  }

  getStateKey() {
    return this.blocks
      .map(
        (b) =>
          `${b.type}:${b.shape[0]}x${b.shape[1]}@${b.position[0]},${b.position[1]}`
      )
      .sort()
      .join("|");
  }

  isPositionFree(y, x, excludeBlockId = null) {
    if (y < 0 || y >= 5 || x < 0 || x >= 4) return false;
    for (const block of this.blocks) {
      if (block.id === excludeBlockId) continue;
      const [by, bx] = block.position;
      const [bh, bw] = block.shape;
      if (y >= by && y < by + bh && x >= bx && x < bx + bw) {
        return false;
      }
    }
    return true;
  }

  canMoveBlock(blockId, direction) {
    const block = this.blocks.find((b) => b.id === blockId);
    if (!block) return false;
    const [y, x] = block.position;
    const [h, w] = block.shape;
    let newY = y,
      newX = x;
    if (direction === 0) newY++;
    else if (direction === 1) newX++;
    else if (direction === 2) newY--;
    else if (direction === 3) newX--;
    if (newY < 0 || newX < 0 || newY + h > 5 || newX + w > 4) {
      return false;
    }
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        if (!this.isPositionFree(newY + dy, newX + dx, blockId)) {
          return false;
        }
      }
    }
    return true;
  }

  moveBlock(blockId, direction) {
    const block = this.blocks.find((b) => b.id === blockId);
    if (!block || !this.canMoveBlock(blockId, direction)) return false;
    if (direction === 0) block.position[0]++;
    else if (direction === 1) block.position[1]++;
    else if (direction === 2) block.position[0]--;
    else if (direction === 3) block.position[1]--;
    return true;
  }

  isGoalReached() {
    const aBlock = this.blocks.find((b) => b.id === "A");
    if (!aBlock) return false;
    const [y, x] = aBlock.position;
    return y === 3 && x === 1;
  }

  copy() {
    return new AdvancedKlotskiSolver(
      this.blocks.map((b) => ({
        id: b.id,
        type: b.type,
        shape: [...b.shape],
        position: [...b.position],
      }))
    );
  }

  heuristic() {
    const aBlock = this.blocks.find((b) => b.id === "A");
    if (!aBlock) return 9999;
    const [y, x] = aBlock.position;
    let h = Math.abs(3 - y) + Math.abs(1 - x);

    let blockers = 0;
    for (let row = y + 2; row < 5; row++) {
      for (let col = x; col < x + 2; col++) {
        const block = this.blocks.find((b) => {
          if (b.id === "A") return false;
          const [by, bx] = b.position;
          const [bh, bw] = b.shape;
          return row >= by && row < by + bh && col >= bx && col < bx + bw;
        });
        if (block) blockers++;
      }
    }
    h += blockers * 3;
    return h;
  }

  solve() {
    const visited = new Set();
    const queue = [];
    visited.add(this.getStateKey());
    queue.push({
      solver: this,
      moves: [],
      cost: 0,
      priority: this.heuristic(),
    });

    let iterations = 0;
    const maxIterations = 100000;

    while (queue.length > 0 && iterations < maxIterations) {
      iterations++;
      let bestIdx = 0;
      let bestScore = queue[0].cost + queue[0].priority;
      for (let i = 1; i < queue.length; i++) {
        const score = queue[i].cost + queue[i].priority;
        if (score < bestScore) {
          bestScore = score;
          bestIdx = i;
        }
      }
      const { solver, moves, cost } = queue.splice(bestIdx, 1)[0];

      if (solver.isGoalReached()) {
        return moves;
      }

      for (const block of solver.blocks) {
        for (let dir = 0; dir < 4; dir++) {
          if (solver.canMoveBlock(block.id, dir)) {
            const newSolver = solver.copy();
            newSolver.moveBlock(block.id, dir);
            const newKey = newSolver.getStateKey();
            if (!visited.has(newKey)) {
              visited.add(newKey);
              const dirName = ["ner", "höger", "upp", "vänster"][dir];
              queue.push({
                solver: newSolver,
                moves: [...moves, { block: block.id, direction: dir, dirName }],
                cost: cost + 1,
                priority: newSolver.heuristic(),
              });
            }
          }
        }
      }
    }
    return null;
  }
}

window.Klotski = {
  solve: function (game) {
    const solver = new AdvancedKlotskiSolver(game.blocks);
    return solver.solve();
  },
};

function renderBlocksList() {
  const div = document.getElementById("blocksList");
  if (blocks.length === 0) {
    div.innerHTML = "<p><em>Inga block tillagda.</em></p>";
  } else {
    let html = "<h3>Tillagda block:</h3><ul>";
    blocks.forEach((b, i) => {
      const typeInfo = b.type === "A" ? " (målblock)" : "";
      html += `<li>
            <strong>${b.id}</strong> (typ ${b.type}${typeInfo}): ${
        b.shape[0]
      }×${b.shape[1]} vid rad ${b.position[0] + 1}, kolumn ${b.position[1] + 1}
            <button onclick="removeBlock(${i})" aria-label="Ta bort block ${
        b.id
      }">Ta bort</button>
          </li>`;
    });
    html += "</ul>";
    div.innerHTML = html;
  }
  renderBoard(blocks);
}

function removeBlock(index) {
  const removedBlock = blocks[index];
  blocks.splice(index, 1);
  const type = removedBlock.type;
  const sameTypeBlocks = blocks.filter((b) => b.type === type);
  blockCounter[type] = sameTypeBlocks.length;
  renderBlocksList();
}

document.getElementById("addBlockBtn").addEventListener("click", () => {
  const type = document.getElementById("blkType").value;
  const y = parseInt(document.getElementById("blkY").value, 10) - 1;
  const x = parseInt(document.getElementById("blkX").value, 10) - 1;
  if (type === "A" && blocks.some((b) => b.type === "A")) {
    alert("Endast ett stort block (A) är tillåtet per pussel.");
    return;
  }
  const [height, width] = getBlockDimensions(type);
  if (y + height > 5 || x + width > 4 || y < 0 || x < 0) {
    alert(
      `Blocket passar inte på brädet. Blocktyp ${type} är ${height}×${width} och behöver plats från rad ${
        y + 1
      } till ${y + height}, kolumn ${x + 1} till ${x + width}.`
    );
    return;
  }
  for (const existingBlock of blocks) {
    const [eY, eX] = existingBlock.position;
    const [eHeight, eWidth] = existingBlock.shape;
    if (
      !(
        y >= eY + eHeight ||
        y + height <= eY ||
        x >= eX + eWidth ||
        x + width <= eX
      )
    ) {
      alert("Blocket överlappar med ett befintligt block.");
      return;
    }
  }
  const id = getNextBlockId(type);
  blocks.push({
    id: id,
    type: type,
    shape: [height, width],
    position: [y, x],
  });
  renderBlocksList();
  document.getElementById("blkY").value = "1";
  document.getElementById("blkX").value = "1";
});

function applyMove(game, move) {
  const blk = game.blocks.find((b) => b.id === move.block);
  if (!blk) return;
  const [py, px] = blk.position;
  const [h, w] = blk.shape;
  let newY = py,
    newX = px;
  if (move.direction === 0) newY++;
  else if (move.direction === 1) newX++;
  else if (move.direction === 2) newY--;
  else if (move.direction === 3) newX--;
  if (newY < 0 || newX < 0 || newY + h > 5 || newX + w > 4) return;
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      for (const other of game.blocks) {
        if (other.id === blk.id) continue;
        const [oy, ox] = other.position;
        const [oh, ow] = other.shape;
        if (
          newY + dy >= oy &&
          newY + dy < oy + oh &&
          newX + dx >= ox &&
          newX + dx < ox + ow
        ) {
          return;
        }
      }
    }
  }
  blk.position = [newY, newX];
}

// --- Grafisk rendering av brädet ---
function renderBoard(blocksToRender) {
  const colorNames = { A: "röd", B: "blå", C: "gul", D: "grön" };
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";

  // Skapa en matris för att hålla reda på vad som finns på varje position
  const boardMatrix = Array(5)
    .fill()
    .map(() => Array(4).fill(null));

  // Fyll matrisen med block-information
  blocksToRender.forEach((block) => {
    const [h, w] = block.shape;
    const [y, x] = block.position;
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        if (y + dy < 5 && x + dx < 4) {
          boardMatrix[y + dy][x + dx] = block;
        }
      }
    }
  });

  // Rita upp hela brädet position för position
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 4; x++) {
      const block = boardMatrix[y][x];
      const cell = document.createElement("div");
      cell.style.gridRow = `${y + 1}`;
      cell.style.gridColumn = `${x + 1}`;
      cell.setAttribute("tabindex", "0");
      cell.setAttribute("role", "gridcell");

      if (block) {
        // Position är upptagen av ett block
        cell.className = `block ${block.type}`;
        const [h, w] = block.shape;
        const [by, bx] = block.position;

        // Lägg bara till block-ID på övre vänstra hörnet av blocket
        if (y === by && x === bx) {
          cell.textContent = block.id;
          // Sätt span för större block
          if (h > 1 || w > 1) {
            cell.style.gridRow = `${by + 1} / span ${h}`;
            cell.style.gridColumn = `${bx + 1} / span ${w}`;
          }
        }

        cell.setAttribute(
          "aria-label",
          `Block ${block.id}, typ ${block.type}, färg ${
            colorNames[block.type]
          }, storlek ${h}x${w}, rad ${y + 1}, kolumn ${x + 1}`
        );
      } else {
        // Position är tom
        cell.className = "empty-cell";

        // Markera utgångspositioner (rad 5, kolumn 2-3)
        if (y === 4 && (x === 1 || x === 2)) {
          cell.classList.add("exit-cell");
          cell.setAttribute(
            "aria-label",
            `Utgångsposition, rad ${y + 1}, kolumn ${x + 1}`
          );
          cell.textContent = "Utgång";
        } else {
          cell.setAttribute(
            "aria-label",
            `Tom position, rad ${y + 1}, kolumn ${x + 1}`
          );
          cell.textContent = "Tom position";
        }
      }

      boardDiv.appendChild(cell);
    }
  }
}

// --- Stegvis lösningsvisning ---
let lastSolutionSteps = null;
let currentStepIndex = 0;

function showStep(stepIndex) {
  if (!lastSolutionSteps) return;

  // Visa stegnavigation när lösning finns
  document.getElementById("stepNavigation").className =
    "step-navigation visible";

  // Visa sparaknapp när lösning finns
  document.getElementById("saveBtn").className = "save-button visible";

  const outputEl = document.getElementById("output");
  const step = lastSolutionSteps[stepIndex];

  // Kolla om vi är på sista steget
  if (stepIndex === lastSolutionSteps.length - 1) {
    // Visa grattismeddelande
    outputEl.innerHTML = `<div class="success-message">
          <span class="emoji">🎉</span>
          <div>Grattis! Du har klarat pusslet!</div>
          <div style="margin-top: 10px; font-size: 0.9em;">Löst på ${
            lastSolutionSteps.length - 1
          } steg</div>
        </div>`;
    outputEl.setAttribute("aria-live", "assertive");
  } else {
    // Visa bara steg-information istället för ASCII-text
    outputEl.innerHTML = `<h3>Steg ${stepIndex} av ${
      lastSolutionSteps.length - 1
    }</h3>
          ${
            stepIndex === 0
              ? "<p>Startposition</p>"
              : `<p>${step.description}</p>`
          }`;
    outputEl.setAttribute("aria-live", "polite");
  }

  document.getElementById("prevStepBtn").disabled = stepIndex === 0;
  document.getElementById("nextStepBtn").disabled =
    stepIndex === lastSolutionSteps.length - 1;

  // Rita grafiskt bräde för detta steg
  if (step.blocks) {
    renderBoard(step.blocks);
  }
}

document.getElementById("prevStepBtn").addEventListener("click", () => {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    showStep(currentStepIndex);
  }
});

document.getElementById("nextStepBtn").addEventListener("click", () => {
  if (lastSolutionSteps && currentStepIndex < lastSolutionSteps.length - 1) {
    currentStepIndex++;
    showStep(currentStepIndex);
  }
});

document.getElementById("solveBtn").addEventListener("click", () => {
  const rows = 5;
  const cols = 4;
  const escY = 4;
  const escX = 1;
  const outputEl = document.getElementById("output");

  // Dölj stegnavigation när ny lösning startar
  document.getElementById("stepNavigation").className = "step-navigation";

  // Dölj sparaknapp när ny lösning startar
  document.getElementById("saveBtn").className = "save-button";

  if (blocks.length === 0) {
    outputEl.textContent =
      "Fel: Inga block har lagts till. Lägg till minst ett block innan du försöker lösa pusslet.";
    outputEl.setAttribute("aria-live", "assertive");
    document.getElementById("prevStepBtn").disabled = true;
    document.getElementById("nextStepBtn").disabled = true;
    lastSolutionSteps = null;
    return;
  }
  const targetBlock = blocks.find((b) => b.type === "A");
  if (!targetBlock) {
    outputEl.textContent =
      "Fel: Det måste finnas ett stort block (typ A) som är målblocket som ska nå utgången.";
    outputEl.setAttribute("aria-live", "assertive");
    document.getElementById("prevStepBtn").disabled = true;
    document.getElementById("nextStepBtn").disabled = true;
    lastSolutionSteps = null;
    return;
  }
  const game = {
    boardSize: [rows, cols],
    escapePoint: [escY, escX],
    blocks: blocks.map((b) => ({
      shape: b.shape,
      position: [...b.position],
      id: b.id,
      type: b.type,
    })),
  };
  outputEl.textContent = "Löser pussel... Detta kan ta en stund.";
  outputEl.setAttribute("aria-live", "polite");
  document.getElementById("prevStepBtn").disabled = true;
  document.getElementById("nextStepBtn").disabled = true;
  setTimeout(() => {
    try {
      const result = window.Klotski.solve(game);
      outputEl.textContent = "";
      if (!result) {
        outputEl.textContent =
          "Ingen lösning funnen efter omfattande sökning.\nTips: Kontrollera blockplacering och försök igen.";
        outputEl.setAttribute("aria-live", "assertive");
        document.getElementById("prevStepBtn").disabled = true;
        document.getElementById("nextStepBtn").disabled = true;
        lastSolutionSteps = null;
        return;
      }
      // Bygg steg-för-steg-lista med grafiska bräden
      let steps = [];
      let tempGame = {
        boardSize: [rows, cols],
        blocks: game.blocks.map((b) => ({
          id: b.id,
          type: b.type,
          shape: [...b.shape],
          position: [...b.position],
        })),
      };

      // Startposition
      steps.push({
        description: "Startposition",
        blocks: tempGame.blocks.map((b) => ({
          id: b.id,
          type: b.type,
          shape: [...b.shape],
          position: [...b.position],
        })),
      });

      // Varje drag
      result.forEach((move, i) => {
        applyMove(tempGame, move);
        const bid = move.block;
        const dirName =
          move.dirName || ["ner", "höger", "upp", "vänster"][move.direction];
        steps.push({
          description: `Flytta block ${bid} → ${dirName}`,
          blocks: tempGame.blocks.map((b) => ({
            id: b.id,
            type: b.type,
            shape: [...b.shape],
            position: [...b.position],
          })),
        });
      });

      lastSolutionSteps = steps;
      currentStepIndex = 0;
      showStep(currentStepIndex);
    } catch (error) {
      outputEl.textContent =
        "Ett fel uppstod vid lösning av pusslet: " + error.message;
      outputEl.setAttribute("aria-live", "assertive");
      document.getElementById("prevStepBtn").disabled = true;
      document.getElementById("nextStepBtn").disabled = true;
      lastSolutionSteps = null;
      console.error("Solver error:", error);
    }
  }, 100);
});

let lastSolution = null;
document.getElementById("saveBtn").addEventListener("click", () => {
  // Om stegvis lösning finns, spara hela lösningen som text
  if (lastSolutionSteps && lastSolutionSteps.length > 0) {
    let txt = "Klotski Lösning\n================\n\n";
    lastSolutionSteps.forEach((step, i) => {
      if (i === 0) {
        txt += `Steg ${i}: Startposition\n\n`;
      } else {
        txt += `Steg ${i}: ${step.description}\n\n`;
      }
    });
    txt += `\nLöst på ${lastSolutionSteps.length - 1} steg totalt.`;
    lastSolution = txt;
  }
  if (!lastSolution) {
    alert("Ingen lösning att spara — kör lösaren först.");
    return;
  }
  const blob = new Blob([lastSolution], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "klotski_solution.txt";
  a.click();
  URL.revokeObjectURL(url);
});

renderBlocksList();

document.getElementById("setupStandardBtn").addEventListener("click", () => {
  blocks.length = 0;
  blockCounter = { A: 0, B: 0, C: 0, D: 0 };
  blocks.push({ id: "A", type: "A", shape: [2, 2], position: [0, 1] });
  blockCounter.A = 1;
  blocks.push({ id: "B1", type: "B", shape: [2, 1], position: [0, 0] });
  blocks.push({ id: "B2", type: "B", shape: [2, 1], position: [0, 3] });
  blocks.push({ id: "B3", type: "B", shape: [2, 1], position: [2, 0] });
  blocks.push({ id: "B4", type: "B", shape: [2, 1], position: [2, 3] });
  blockCounter.B = 4;
  blocks.push({ id: "C1", type: "C", shape: [1, 2], position: [2, 1] });
  blockCounter.C = 1;
  blocks.push({ id: "D1", type: "D", shape: [1, 1], position: [4, 0] });
  blocks.push({ id: "D2", type: "D", shape: [1, 1], position: [4, 3] });
  blocks.push({ id: "D3", type: "D", shape: [1, 1], position: [3, 1] });
  blocks.push({ id: "D4", type: "D", shape: [1, 1], position: [3, 2] });
  blockCounter.D = 4;
  renderBlocksList();

  const outputEl = document.getElementById("output");
  outputEl.innerHTML = `<h3>Standarduppsättning laddad!</h3>
        <p><strong>Mål:</strong> Flytta det stora A-blocket (röd, 2×2) så att det täcker utgångspositionerna som är markerade med "Utgång".</p>
        <p><strong>Blocktyper:</strong></p>
        <ul>
          <li><strong>A (röd):</strong> Stort 2×2 block - målblock</li>
          <li><strong>B (blå):</strong> Vertikala 2×1 block</li>
          <li><strong>C (gul):</strong> Horisontellt 1×2 block</li>
          <li><strong>D (grön):</strong> Små 1×1 block</li>
        </ul>
        <p>Klicka på "Lös pussel" för att se lösningen steg för steg.</p>`;
  outputEl.setAttribute("aria-live", "polite");
  document.getElementById("prevStepBtn").disabled = true;
  document.getElementById("nextStepBtn").disabled = true;
  lastSolutionSteps = null;
  document.getElementById("stepNavigation").className = "step-navigation";
  document.getElementById("saveBtn").className = "save-button";
});

// Ny funktion: rensa brädet
document.getElementById("clearBtn").addEventListener("click", () => {
  blocks.length = 0;
  blockCounter = { A: 0, B: 0, C: 0, D: 0 };
  renderBlocksList();
  document.getElementById("output").textContent = "Brädet är nu rensat.";
  document.getElementById("prevStepBtn").disabled = true;
  document.getElementById("nextStepBtn").disabled = true;
  lastSolutionSteps = null;
  document.getElementById("stepNavigation").className = "step-navigation";
  document.getElementById("saveBtn").className = "save-button";
});
