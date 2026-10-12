import { useEffect, useMemo, useState } from "react";
import LifeCanvas from "./LifeCanvas.jsx";
import {
  TICK_MS,
  countLiveCells,
  createGrid,
  nextGeneration,
  spellWord,
} from "./life.js";

export default function App() {
  const [grid, setGrid] = useState(() => spellWord("YELLOW"));
  const [generation, setGeneration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const liveCount = useMemo(() => countLiveCells(grid), [grid]);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      setGrid((current) => nextGeneration(current));
      setGeneration((current) => current + 1);
    }, TICK_MS);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  function setCell(row, col, value) {
    setGrid((current) => {
      if (current[row][col] === value) return current;
      const next = current.map((r) => r.slice());
      next[row][col] = value;
      return next;
    });
  }

  function resetTo(newGrid) {
    setIsRunning(false);
    setGeneration(0);
    setGrid(newGrid);
  }

  return (
    <main className="app">
      <h1>Conway's Game of Life</h1>

      <div className="controls">
        <button
          className={isRunning ? "start running" : "start"}
          onClick={() => setIsRunning((running) => !running)}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={() => resetTo(spellWord("YELLOW"))}>
          Reset to 'YELLOW'
        </button>
        <button onClick={() => resetTo(createGrid())}>Clear</button>
      </div>

      <LifeCanvas grid={grid} setCell={setCell} />

      <div className="stats">
        Generation: {generation} | Live Cells: {liveCount}
      </div>

      <section className="rules">
        <h3>How to use this page</h3>
        <ul>
          <li>
            Click <strong>Start</strong> to run the simulation, and{" "}
            <strong>Pause</strong> to stop it.
          </li>
          <li>
            Click <strong>Reset</strong> to bring back the "YELLOW" starting
            pattern.
          </li>
          <li>
            Click <strong>Clear</strong> to clear the grid completely.
          </li>
          <li>
            Click or drag on the grid to bring cells to life or kill them.
          </li>
        </ul>
        <p>
          Every generation, all cells update at the same time using these rules:
        </p>
        <ol>
          <li>
            <strong>Underpopulation:</strong> A live cell with fewer than 2 live
            neighbors dies.
          </li>
          <li>
            <strong>Survival:</strong> A live cell with 2 or 3 live neighbors
            lives on to the next generation.
          </li>
          <li>
            <strong>Overpopulation:</strong> A live cell with more than 3 live
            neighbors dies.
          </li>
          <li>
            <strong>Reproduction:</strong> A dead cell with exactly 3 live
            neighbors becomes alive.
          </li>
        </ol>
        <p>
          In this version the edges wrap around, so a cell on the right edge
          neighbors the cell on the left edge, and the top connects to the
          bottom.
        </p>
      </section>
    </main>
  );
}
