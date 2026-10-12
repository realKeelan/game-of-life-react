# Conway's Game of Life (React)

The same Game of Life as the plain JavaScript version, rebuilt with **React** and **Vite**. The grid starts with the word **YELLOW** spelled out in live cells.

## Run it

```bash
npm install
npm run dev
```

1. `npm install`
2. `npm run dev`

## Controls

| Control                       | What it does                                   |
| ----------------------------- | ---------------------------------------------- |
| **Start / Pause**             | Runs or stops the simulation                   |
| **Reset**                     | Brings back the YELLOW pattern                 |
| **Clear**                     | Wipes the grid so you can draw your own shapes |
| **Click or drag on the grid** | Brings dead cells to life, or kills live ones  |

If you start dragging on an empty cell you draw, and if you start on a live cell you erase.

---

## Rules

1. A live cell with fewer than 2 live neighbors dies.
2. A live cell with 2 or 3 live neighbors survives.
3. A live cell with more than 3 live neighbors dies.
4. A dead cell with exactly 3 live neighbors becomes alive.

The edges wrap around, so the left side connects to the right and the top connects to the bottom.
