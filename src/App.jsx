import { useEffect, useMemo, useState } from "react";
import LifeCanvas from "./LifeCanvas.jsx";
import {
  COLS,
  PATTERNS,
  ROWS,
  advanceGeneration,
  countLiveCells,
  createAges,
  createGrid,
  createPattern,
  randomGrid,
  spellWord,
} from "./life.js";

const HISTORY_LIMIT = 60;

function PopulationChart({ history }) {
  const width = 320;
  const height = 76;
  const max = Math.max(...history, 1);
  const points = history
    .map((population, index) => {
      const x =
        history.length === 1 ? width : (index / (history.length - 1)) * width;
      const y = height - (population / max) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="chart-card">
      <div className="chart-heading">
        <div>
          <span className="eyebrow">POPULATION</span>
          <h2>Living cells over time</h2>
        </div>
        <span className="chart-window">Last {history.length} generations</span>
      </div>
      <svg
        className="population-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Population history, from ${history[0] ?? 0} to ${history.at(-1) ?? 0} live cells`}
        preserveAspectRatio="none"
      >
        <line x1="0" y1={height - 1} x2={width} y2={height - 1} />
        <polyline points={points} />
      </svg>
      <div className="chart-axis">
        <span>Older</span>
        <span>Now</span>
      </div>
    </div>
  );
}

export default function App() {
  const [world, setWorld] = useState(() => {
    const grid = spellWord("YELLOW");
    const population = countLiveCells(grid);
    return {
      grid,
      ages: createAges(grid),
      generation: 0,
      births: 0,
      deaths: 0,
      history: [population],
    };
  });
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(4);
  const [selectedPattern, setSelectedPattern] = useState("yellow");

  const liveCount = useMemo(() => countLiveCells(world.grid), [world.grid]);

  useEffect(() => {
    if (!isRunning) return undefined;

    const intervalId = window.setInterval(() => {
      setWorld((current) => {
        const result = advanceGeneration(current.grid, current.ages);
        const population = countLiveCells(result.grid);
        return {
          ...current,
          grid: result.grid,
          ages: result.ages,
          generation: current.generation + 1,
          births: result.births,
          deaths: result.deaths,
          history: [...current.history, population].slice(-HISTORY_LIMIT),
        };
      });
    }, 600 / speed);

    return () => window.clearInterval(intervalId);
  }, [isRunning, speed]);

  function step() {
    setWorld((current) => {
      const result = advanceGeneration(current.grid, current.ages);
      const population = countLiveCells(result.grid);
      return {
        ...current,
        grid: result.grid,
        ages: result.ages,
        generation: current.generation + 1,
        births: result.births,
        deaths: result.deaths,
        history: [...current.history, population].slice(-HISTORY_LIMIT),
      };
    });
  }

  function resetTo(grid, patternId = "custom") {
    setIsRunning(false);
    const population = countLiveCells(grid);
    setWorld({
      grid,
      ages: createAges(grid),
      generation: 0,
      births: 0,
      deaths: 0,
      history: [population],
    });
    setSelectedPattern(patternId);
  }

  function setCell(row, col, value) {
    setWorld((current) => {
      if (current.grid[row][col] === value) return current;
      const grid = current.grid.map((line) => line.slice());
      const ages = current.ages.map((line) => line.slice());
      grid[row][col] = value;
      ages[row][col] = value ? 1 : 0;
      return { ...current, grid, ages };
    });
    setSelectedPattern("custom");
  }

  const patternCount = liveCount.toLocaleString();

  return (
    <main className="app">
      <header className="hero">
        {/* <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            ✳
          </span>{" "}
          LIFE LAB
        </div> */}
        <h1>A universe in a little box.</h1>
        <p>
          Set a few simple rules in motion and see what emerges. Every cell
          follows the same rules. No two starting points tell quite the same
          story.
        </p>
      </header>

      <section className="lab" aria-label="Game of Life simulator">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / CHOOSE A STARTING POINT</span>
            <h2>Pick a pattern</h2>
          </div>
          <span className="pattern-count">{PATTERNS.length} experiments</span>
        </div>

        <div className="pattern-gallery" aria-label="Pattern gallery">
          {PATTERNS.map((pattern, index) => (
            <button
              className={`pattern-card${selectedPattern === pattern.id ? " selected" : ""}`}
              key={pattern.id}
              type="button"
              aria-pressed={selectedPattern === pattern.id}
              onClick={() => resetTo(createPattern(pattern.id), pattern.id)}
            >
              <span className="pattern-index">0{index + 1}</span>
              <span className="pattern-name">{pattern.name}</span>
              <span className="pattern-description">{pattern.description}</span>
            </button>
          ))}
        </div>

        <div className="simulation-bar">
          <div className="transport-controls" aria-label="Simulation controls">
            <button
              className={`button-primary${isRunning ? " is-running" : ""}`}
              type="button"
              onClick={() => setIsRunning((running) => !running)}
              aria-label={isRunning ? "Pause simulation" : "Start simulation"}
            >
              <span aria-hidden="true">{isRunning ? "Ⅱ" : "▶"}</span>
              {isRunning ? "Pause" : "Play"}
            </button>
            <button
              className="button-secondary step-button"
              type="button"
              onClick={step}
              disabled={isRunning}
              aria-label="Advance one generation"
            >
              Step <span aria-hidden="true">→</span>
            </button>
            <button
              className="button-secondary"
              type="button"
              onClick={() => resetTo(randomGrid(), "custom")}
            >
              <span aria-hidden="true">⤨</span> Random
            </button>
            <button
              className="button-secondary"
              type="button"
              onClick={() => resetTo(createGrid(), "custom")}
              aria-label="Clear the grid"
              title="Clear grid"
            >
              <span aria-hidden="true">Reset</span>
            </button>
          </div>
          <label className="speed-control">
            <span>
              Speed <strong>{speed}x</strong>
            </span>
            <input
              type="range"
              min="1"
              max="10"
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              aria-label={`Simulation speed: ${speed} times`}
            />
            <span className="speed-range-labels" aria-hidden="true">
              <span>Slow</span>
              <span>Fast</span>
            </span>
          </label>
        </div>

        <div className="simulation-layout">
          <div className="universe-panel">
            <div className="universe-topline">
              <span>
                <i className={isRunning ? "status-dot active" : "status-dot"} />
                {isRunning ? "SIMULATION LIVE" : "READY TO EXPLORE"}
              </span>
              <span>WRAPS AT EDGES</span>
            </div>
            <LifeCanvas grid={world.grid} ages={world.ages} setCell={setCell} />
            <div className="canvas-hint">
              <span>Click or drag to draw</span>
              <span>Keyboard: arrows to move · Enter to toggle</span>
            </div>
          </div>

          <aside className="insights">
            <div className="generation-card">
              <span className="eyebrow">GENERATION</span>
              <strong>{world.generation.toLocaleString()}</strong>
              <span className="generation-caption">One step at a time</span>
            </div>
            <div className="population-card">
              <span className="eyebrow">LIVING CELLS</span>
              <strong>{patternCount}</strong>
              <div className="population-change">
                <span className="birth-count">+{world.births} born</span>
                <span className="death-count">-{world.deaths} deaths</span>
              </div>
            </div>
            <div className="age-legend">
              <span className="eyebrow">CELL AGE</span>
              <div className="age-gradient" aria-hidden="true" />
              <div>
                <span>Newborn</span>
                <span>Long-lived</span>
              </div>
              <p>Color shifts from gold to teal as a cell survives.</p>
            </div>
          </aside>
        </div>

        <div className="data-row">
          <PopulationChart history={world.history} />
          <div className="rule-card">
            <span className="eyebrow">THE RULES</span>
            <h2>Four rules. Infinite outcomes.</h2>
            <p>
              Underpopulation and overcrowding remove a cell. Two or three
              neighbors keep it alive. Exactly three neighbors create a new
              cell.
            </p>
            <div className="rule-chips">
              <span>2–3 survive</span>
              <span>3 are born</span>
              <span>Edges wrap</span>
            </div>
          </div>
        </div>

        <footer className="lab-footer">
          <span>CONWAY&apos;S GAME OF LIFE</span>
          <span>
            {ROWS} × {COLS} UNIVERSE
          </span>
          <span>Draw, experiment, discover.</span>
        </footer>
      </section>
    </main>
  );
}
