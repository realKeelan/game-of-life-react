import { useEffect, useRef } from "react";
import { ALIVE_COLOR, CELL_SIZE, COLS, DEAD_COLOR, ROWS } from "./life.jsx";

export default function LifeCanvas({ grid, setCell }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const paintValue = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        context.fillStyle = grid[row][col] === 1 ? ALIVE_COLOR : DEAD_COLOR;
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
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const bounds = canvas.getBoundingClientRect();
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return null;

    const col = Math.floor(
      ((event.clientX - bounds.left - canvas.clientLeft) * canvas.width) /
        width /
        CELL_SIZE,
    );
    const row = Math.floor(
      ((event.clientY - bounds.top - canvas.clientTop) * canvas.height) /
        height /
        CELL_SIZE,
    );

    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return null;
    return { row, col };
  }

  function paint(event) {
    const cell = getCellFromEvent(event);
    if (cell) setCell(cell.row, cell.col, paintValue.current);
  }

  function handlePointerDown(event) {
    const cell = getCellFromEvent(event);
    if (!cell) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    isDrawing.current = true;
    paintValue.current = grid[cell.row][cell.col] === 1 ? 0 : 1;
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
      className="life-canvas"
      width={COLS * CELL_SIZE}
      height={ROWS * CELL_SIZE}
      aria-label="Conway's Game of Life"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDrawing}
      onPointerCancel={stopDrawing}
      onLostPointerCapture={stopDrawing}
    />
  );
}
