import { useEffect, useRef } from "react";
import { ALIVE_COLOR, CELL_SIZE, COLS, DEAD_COLOR, ROWS } from "./life.js";

export default function LifeCanvas({ grid, setCell }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const paintValue = useRef(1);

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        context.fillStyle = grid[row][col] === 1 ? ALIVE_COLOR : DEAD_COLOR;
        // -1 leaves a 1px gap
        context.fillRect(
          col * CELL_SIZE,
          row * CELL_SIZE,
          CELL_SIZE - 1,
          CELL_SIZE - 1,
        );
      }
    }
  }, [grid]);

  function getCellFromEvent(event) {
    const bounds = canvasRef.current.getBoundingClientRect();
    const col = Math.floor((event.clientX - bounds.left) / CELL_SIZE);
    const row = Math.floor((event.clientY - bounds.top) / CELL_SIZE);
    const onGrid = row >= 0 && row < ROWS && col >= 0 && col < COLS;
    return onGrid ? { row, col } : null;
  }

  function paint(event) {
    const cell = getCellFromEvent(event);
    if (cell) setCell(cell.row, cell.col, paintValue.current);
  }

  function handlePointerDown(event) {
    isDrawing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);

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

  return (
    <canvas
      ref={canvasRef}
      width={COLS * CELL_SIZE}
      height={ROWS * CELL_SIZE}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDrawing}
      onPointerCancel={stopDrawing}
    />
  );
}
