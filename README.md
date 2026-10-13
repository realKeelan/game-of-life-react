# Life Lab

A responsive, interactive Conway's Game of Life built with React and Vite. Explore classic patterns, control the simulation, and watch population and cell age change over time.

## Run it

```bash
npm install
npm run dev
```

## Explore

- Choose the **YELLOW** seed, a **Glider**, **Pulsar**, or **Glider gun** from the pattern gallery.
- Use **Play/Pause**, **Step**, **Random**, and **Clear** to control the universe.
- Adjust simulation speed from 1× to 10×.
- Click or drag across the grid to draw. Focus the grid and use the arrow keys to move its cursor; press **Enter** or **Space** to toggle a cell.
- Watch the population chart, live-cell count, and per-generation births and deaths.
- Cells shift from gold to teal as they survive. The grid wraps at its edges.

## Rules

1. A live cell with fewer than two live neighbors dies.
2. A live cell with two or three live neighbors survives.
3. A live cell with more than three live neighbors dies.
4. A dead cell with exactly three live neighbors becomes alive.

Each generation updates simultaneously, and the left/right and top/bottom grid edges connect.
