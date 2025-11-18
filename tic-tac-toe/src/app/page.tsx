"use client";

import { useMemo, useState } from "react";

type Player = "X" | "O";
type SquareValue = Player | null;

const winningCombos: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(board: SquareValue[]) {
  for (const [a, b, c] of winningCombos) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line: [a, b, c] } as const;
    }
  }
  return null;
}

export default function Home() {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [startingPlayer, setStartingPlayer] = useState<Player>("X");
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const winnerInfo = useMemo(() => calculateWinner(board), [board]);
  const boardIsFull = useMemo(
    () => board.every((square) => square !== null),
    [board],
  );
  const gameOver = winnerInfo !== null || boardIsFull;

  const handleSquareClick = (index: number) => {
    if (board[index] || winnerInfo) return;

    const nextBoard = [...board];
    nextBoard[index] = isXNext ? "X" : "O";
    const nextWinner = calculateWinner(nextBoard);
    const nextBoardIsFull = nextBoard.every((square) => square !== null);

    setBoard(nextBoard);

    if (nextWinner) {
      setScores((prev) => ({
        ...prev,
        [nextWinner.player]: prev[nextWinner.player] + 1,
      }));
    } else if (nextBoardIsFull) {
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
    }

    setIsXNext((prev) => !prev);
  };

  const handleNextRound = () => {
    setBoard(Array(9).fill(null));
    setStartingPlayer((prev) => {
      const nextStarter: Player = prev === "X" ? "O" : "X";
      setIsXNext(nextStarter === "X");
      return nextStarter;
    });
  };

  const handleResetBoard = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(startingPlayer === "X");
  };

  const handleResetMatch = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setStartingPlayer("X");
    setScores({ X: 0, O: 0, draws: 0 });
  };

  const statusMessage = winnerInfo
    ? `Winner: ${winnerInfo.player}`
    : boardIsFull
      ? "It's a draw!"
      : `Next player: ${isXNext ? "X" : "O"}`;

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_60%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.25),transparent_55%)] py-10 text-white">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur lg:p-10">
        <header className="flex flex-col justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Tic Tac Toe Arena
            </h1>
            <p className="mt-1 text-sm text-slate-300 sm:text-base">
              Challenge a friend, keep score across rounds, and dominate the
              grid.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResetBoard}
              className="rounded-full border border-indigo-400/40 bg-indigo-600/20 px-4 py-2 text-sm font-medium text-indigo-200 transition hover:bg-indigo-500/30 hover:text-white"
            >
              Reset Board
            </button>
            <button
              type="button"
              onClick={handleResetMatch}
              className="rounded-full border border-emerald-400/40 bg-emerald-600/20 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/30 hover:text-white"
            >
              Reset Match
            </button>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[3fr_2fr]">
          <div className="flex flex-col items-center gap-6">
            <div className="text-lg font-semibold tracking-tight text-indigo-200">
              {statusMessage}
            </div>
            <div className="grid w-full max-w-md grid-cols-3 gap-3">
              {board.map((value, index) => {
                const isWinningSquare = winnerInfo?.line.includes(index) ?? false;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSquareClick(index)}
                    className={`aspect-square rounded-2xl border border-white/10 bg-slate-800/80 text-4xl font-semibold text-white transition ${
                      value
                        ? "hover:cursor-default"
                        : "hover:-translate-y-1 hover:bg-slate-700"
                    } ${
                      isWinningSquare
                        ? "border-emerald-300 bg-emerald-500/20 text-emerald-200"
                        : ""
                    }`}
                    aria-label={`Square ${index + 1}`}
                    disabled={Boolean(value) || Boolean(winnerInfo)}
                  >
                    <span className="drop-shadow-lg">{value ?? ""}</span>
                  </button>
                );
              })}
            </div>
            {gameOver && (
              <button
                type="button"
                onClick={handleNextRound}
                className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-white/20"
              >
                Start Next Round
              </button>
            )}
          </div>

          <aside className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-800/60 p-6 shadow-inner shadow-black/40">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">Scoreboard</h2>
              <p className="text-sm text-slate-300">
                Rounds alternate starting player for a balanced match.
              </p>
            </div>
            <dl className="grid gap-4 text-center text-sm font-medium sm:grid-cols-3 sm:text-base">
              <div className="rounded-2xl bg-indigo-500/15 p-4">
                <dt className="text-indigo-200">Player X</dt>
                <dd className="mt-2 text-3xl font-semibold text-indigo-100">
                  {scores.X}
                </dd>
              </div>
              <div className="rounded-2xl bg-emerald-500/15 p-4">
                <dt className="text-emerald-200">Player O</dt>
                <dd className="mt-2 text-3xl font-semibold text-emerald-100">
                  {scores.O}
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-500/15 p-4">
                <dt className="text-slate-200">Draws</dt>
                <dd className="mt-2 text-3xl font-semibold text-slate-100">
                  {scores.draws}
                </dd>
              </div>
            </dl>

            <div className="rounded-2xl bg-slate-900/60 p-4 text-sm text-slate-300">
              <h3 className="text-base font-semibold text-slate-100">
                How to play
              </h3>
              <ul className="mt-3 list-inside list-disc space-y-1">
                <li>
                  Players take turns tapping an empty square to place their mark.
                </li>
                <li>
                  The first player to align three marks horizontally, vertically,
                  or diagonally wins.
                </li>
                <li>If the board fills without a winner, the round ends in a draw.</li>
              </ul>
            </div>
          </aside>
        </section>

        <footer className="text-center text-xs text-slate-400">
          Built with Next.js and Tailwind CSS. Share the board and keep the streak
          alive.
        </footer>
      </main>
    </div>
  );
}
