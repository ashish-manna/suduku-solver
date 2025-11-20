import { Board } from "@/types/sudukuTypes";
import { delay, isValid } from "./sudukuHelper";

export const solveSudokuVisual = async (
  board: Board,
  setBoard: (b: Board) => void,
  row = 0,
  col = 0
): Promise<boolean> => {
  if (row === 9) return true;

  const nextRow = col === 8 ? row + 1 : row;
  const nextCol = col === 8 ? 0 : col + 1;

  if (board[row][col] !== "") {
    return solveSudokuVisual(board, setBoard, nextRow, nextCol);
  }

  for (let num = 1; num <= 9; num++) {
    const numStr = num.toString();

    if (isValid(board, row, col, numStr)) {
      board[row][col] = numStr;
      setBoard(board.map((r) => [...r]));
      await delay(20);

      if (await solveSudokuVisual(board, setBoard, nextRow, nextCol)) {
        return true;
      }

      board[row][col] = "";
      setBoard(board.map((r) => [...r]));
      await delay(20);
    }
  }

  return false;
};
