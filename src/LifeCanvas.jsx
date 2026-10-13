import { useEffect, useRef, useState } from "react";
import { CELL_SIZE, COLS, DEAD_COLOR, ROWS } from "./life.js";

export default function LifeCanvas({ grid, ages, setCell }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const paintValue = useRef(1);
  const [cursor, setCursor] = useState({
    row: Math.floor(ROWS / 2),
    col: Math.floor(COLS / 2),
  });

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.fillStyle = DEAD_COLOR;
    context.fillRect(0, 0, COLS * CELL_SIZE, ROWS * CELL_SIZE);

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (grid[row][col] === 1) {
          const age = Math.max(1, ages?.[row]?.[col] ?? 1);
          const hue = 48 + (Math.min(age, 24) / 24) * 145;
          context.fillStyle = `hsl(${hue} 88% 62%)`;
        } else {
          context.fillStyle = DEAD_COLOR;
        }
        // -1 leaves a 1px gap
        context.fillRect(
          col * CELL_SIZE,
          row * CELL_SIZE,
          CELL_SIZE - 1,
          CELL_SIZE - 1,
        );
      }
    }

    const { row, col } = cursor;
    context.strokeStyle = "rgba(255, 255, 255, 0.9)";
    context.lineWidth = 1;
    context.strokeRect(
      col * CELL_SIZE + 1,
      row * CELL_SIZE + 1,
      CELL_SIZE - 2,
      CELL_SIZE - 2,
    );
  }, [grid, ages, cursor]);

  function getCellFromEvent(event) {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const bounds = canvas.getBoundingClientRect();
    const x = (event.clientX - bounds.left) * (canvas.width / bounds.width);
    const y = (event.clientY - bounds.top) * (canvas.height / bounds.height);
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);
    const onGrid = row >= 0 && row < ROWS && col >= 0 && col < COLS;
    return onGrid ? { row, col } : null;
  }

  function paint(event) {
    event.preventDefault();
    const cell = getCellFromEvent(event);
    if (cell) setCell(cell.row, cell.col, paintValue.current);
  }

  function handlePointerDown(event) {
    isDrawing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();

    const cell = getCellFromEvent(event);
    if (cell) paintValue.current = grid[cell.row][cell.col] === 1 ? 0 : 1;

    paint(event);
  }

  function handlePointerMove(event) {
    if (isDrawing.current) paint(event);
  }

  function stopDrawing() {
    isDrawing.current = false;
  }

  function handleKeyDown(event) {
    const { row, col } = cursor;
    const moves = {
      ArrowUp: { row: Math.max(0, row - 1), col },
      ArrowDown: { row: Math.min(ROWS - 1, row + 1), col },
      ArrowLeft: { row, col: Math.max(0, col - 1) },
      ArrowRight: { row, col: Math.min(COLS - 1, col + 1) },
    };

    if (moves[event.key]) {
      event.preventDefault();
      setCursor(moves[event.key]);
    } else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      setCell(row, col, grid[row][col] === 1 ? 0 : 1);
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={COLS * CELL_SIZE}
      height={ROWS * CELL_SIZE}
      tabIndex={0}
      role="application"
      aria-label="Conway's Game of Life grid. Use arrow keys to move the cursor and Enter or Space to toggle a cell."
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDrawing}
      onPointerLeave={stopDrawing}
      onPointerCancel={stopDrawing}
      onKeyDown={handleKeyDown}
    />
  );
}
