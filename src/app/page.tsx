"use client";
import { useState } from "react";
import { toast } from "react-toastify";

type Board = string[][];
type SolvedCells = boolean[][];

export default function SudokuSolver() {
  const [board, setBoard] = useState<Board>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(""))
  );
  const [solvedCells, setSolvedCells] = useState<SolvedCells>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(false))
  );

  const isValid = (
    board: Board,
    row: number,
    col: number,
    num: string
  ): boolean => {
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }

    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }

    return true;
  };
  const validateInitialBoard = (board: Board): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== "") {
          const num = board[row][col];
          board[row][col] = "";
          if (!isValid(board, row, col, num)) {
            board[row][col] = num;
            return false;
          }
          board[row][col] = num;
        }
      }
    }
    return true;
  };

  const solveSudoku = (board: Board): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === "") {
          for (let num = 1; num <= 9; num++) {
            const numStr = num.toString();
            if (isValid(board, row, col, numStr)) {
              board[row][col] = numStr;
              if (solveSudoku(board)) {
                return true;
              }
              board[row][col] = "";
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const handleSolve = (): void => {
    const newBoard = board.map((row) => [...row]);
    if (!validateInitialBoard(newBoard)) {
      toast.error("Invalid board! Please check your input.");
      return;
    }
    const newSolvedCells: SolvedCells = Array(9)
      .fill(null)
      .map(() => Array(9).fill(false));

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (newBoard[i][j] !== "") {
          newSolvedCells[i][j] = false;
        }
      }
    }

    if (solveSudoku(newBoard)) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[i][j] === "" && newBoard[i][j] !== "") {
            newSolvedCells[i][j] = true;
          }
        }
      }
      setBoard(newBoard);
      setSolvedCells(newSolvedCells);
      toast.success("Here is your solved board!!");
    } else {
      toast.error("No solution exists for this board!");
    }
  };

  const handleInputChange = (row: number, col: number, value: string): void => {
    if (value === "" || (value >= "1" && value <= "9")) {
      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = value;
      setBoard(newBoard);

      const newSolvedCells = solvedCells.map((r) => [...r]);
      newSolvedCells[row][col] = false;
      setSolvedCells(newSolvedCells);
    }
  };

  const handleClear = (): void => {
    setBoard(
      Array(9)
        .fill(null)
        .map(() => Array(9).fill(""))
    );
    setSolvedCells(
      Array(9)
        .fill(null)
        .map(() => Array(9).fill(false))
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-[#d4b02e] to-black flex items-center justify-center p-4">
      <div className="bg-black rounded-2xl shadow-2xl p-4 lg:p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-2 bg-linear-to-r from-[#d4b02e] to-[#f3c911] bg-clip-text text-transparent">
          Sudoku Solver
        </h1>
        <p className="text-center text-sm lg:text-lg text-[#EB8317] opacity-80 mb-6">
          Enter your puzzle and watch the magic happen!
        </p>

        <div className="bg-black flex justify-center lg:p-4 rounded-xl mb-6">
          <div className="inline-grid grid-cols-9 gap-0 bg-black p-1 border-4 rounded-lg">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isThickRight = (colIndex + 1) % 3 === 0 && colIndex !== 8;
                const isThickBottom =
                  (rowIndex + 1) % 3 === 0 && rowIndex !== 8;

                return (
                  <input
                    key={`${rowIndex}-${colIndex}`}
                    type="text"
                    maxLength={1}
                    value={cell}
                    onChange={(e) =>
                      handleInputChange(rowIndex, colIndex, e.target.value)
                    }
                    className={`lg:w-12 lg:h-12 cursor-pointer text-center text-xl font-semibold border border-black focus:outline-none focus:ring-2 focus:ring-black focus:z-10
                      ${isThickRight ? "border-r-4 border-r-black" : ""}
                      ${isThickBottom ? "border-b-4 border-b-black" : ""}
                      ${
                        solvedCells[rowIndex][colIndex]
                          ? "bg-white text-black"
                          : "bg-[#EB8317] text-black"
                      }
                      ${cell === "" ? "" : "font-bold"}
                    `}
                  />
                );
              })
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleSolve}
            className="cursor-pointer text-sm lg:text-lg bg-linear-to-r from-[#d4b02e] to-[#EB8317] hover:from-purple-700 hover:to-blue-700 text-black font-semibold px-4 py-2 lg:px-8 lg:py-3 rounded-lg shadow-lg transform transition hover:scale-105 active:scale-95"
          >
            Solve Sudoku
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 lg:px-8 lg:py-3 rounded-lg shadow-lg transform transition hover:scale-105 active:scale-95"
          >
            Clear Board
          </button>
        </div>
      </div>
    </div>
  );
}
