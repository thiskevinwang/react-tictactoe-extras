import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      className={"square " + (props.isWinning ? "square--winning" : null)}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

function Board(props) {
  function renderSquare(i) {
    return (
      <Square
        isWinning={props.winningSquares.includes(i)}
        key={"square " + i}
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />
    );
  }

  function renderSquares(n) {
    let squares = [];
    for (let i = n; i < n + 3; i++) {
      squares.push(renderSquare(i));
    }
    return squares;
  }

  function renderRows(i) {
    return <div className="board-row">{renderSquares(i)}</div>;
  }

  return (
    <div>
      {renderRows(0)}
      {renderRows(3)}
      {renderRows(6)}
    </div>
  );
}

function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [isDescending, setIsDescending] = useState(true);

  function handleClick(i) {
    const locations = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3]
    ];
    const historyCopy = history.slice(0, stepNumber + 1);
    const current = historyCopy[historyCopy.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    setHistory(
      historyCopy.concat([{ squares: squares, location: locations[i] }])
    );
    setStepNumber(historyCopy.length);
    setXIsNext(!xIsNext);
  }

  function jumpTo(step) {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  }

  function sortHistory() {
    setIsDescending(!isDescending);
  }

  const historyCopy = history;
  const current = historyCopy[stepNumber];
  const winner = calculateWinner(current.squares);

  const moves = historyCopy.map((step, move) => {
    const desc = move
      ? "Go to move #" + move + " @ " + historyCopy[move].location
      : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>
          {move == stepNumber ? <b>{desc}</b> : desc}
        </button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = "Winner: " + winner.player + " @ " + winner.line;
  } else if (!current.squares.includes(null)) {
    status = "draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          winningSquares={winner ? winner.line : []}
          squares={current.squares}
          onClick={i => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{isDescending ? moves : moves.reverse()}</ol>
        <button onClick={() => sortHistory()}>
          Sort by: {isDescending ? "Descending" : "Asending"}
        </button>
      </div>
    </div>
  );
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
