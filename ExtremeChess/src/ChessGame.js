import React, { useState } from "react";
import { Chessboard } from "react-chessboard";

const initialFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const parseFEN = (fen) => {
  return fen
    .split(" ")[0]
    .split("/")
    .map((row) =>
      row.replace(/[1-8]/g, (num) => " ".repeat(num)).split("")
    );
};

const generateFEN = (board, turn) => {
  return (
    board
      .map((row) =>
        row
          .join("")
          .replace(/ +/g, (match) => match.length.toString())
      )
      .join("/") + ` ${turn} KQkq - 0 1`
  );
};

const ChessGame = () => {
  const [fen, setFen] = useState(initialFEN);
  const [turn, setTurn] = useState("w"); // "w" for White, "b" for Black

  const onDrop = (source, target) => {
    const board = parseFEN(fen);

    const sourceRank = 8 - parseInt(source[1]);
    const sourceFile = source.charCodeAt(0) - "a".charCodeAt(0);
    const targetRank = 8 - parseInt(target[1]);
    const targetFile = target.charCodeAt(0) - "a".charCodeAt(0);

    const movingPiece = board[sourceRank][sourceFile];
    const capturedPiece = board[targetRank][targetFile];

    if (movingPiece === " ") return false; // No piece to move

    // Determine if the moving piece is White or Black
    const isWhite = movingPiece === movingPiece.toUpperCase();

    // Enforce turn-based rule
    if ((turn === "w" && !isWhite) || (turn === "b" && isWhite)) {
      alert("It's not your turn!");
      return false;
    }

    // Apply custom promotion rule: keep color but take captured piece's type
    board[sourceRank][sourceFile] = " ";
    if (capturedPiece !== " ") {
      const newPieceType = capturedPiece.toLowerCase(); // Get type of captured piece
      const promotedPiece = isWhite ? newPieceType.toUpperCase() : newPieceType.toLowerCase();
      board[targetRank][targetFile] = promotedPiece;
    } else {
      board[targetRank][targetFile] = movingPiece;
    }

    setFen(generateFEN(board, turn === "w" ? "b" : "w")); // Switch turn
    setTurn(turn === "w" ? "b" : "w");

    return true;
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Extreme Promote Chess</h1>
      <div style={{ height: "80vh", width: "80vh" }}> 
        <Chessboard position={fen} onPieceDrop={onDrop} />
      </div>
    </div>
  );
};

export default ChessGame;
