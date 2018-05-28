import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
      value={this.props.squares[i]} 
      onClick= {() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      moveHistory: [null]
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const moveHistory = this.state.moveHistory;

    if (calculateWinner(squares) || squares[i]) return;

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        moveHistory: moveHistory.push(i)
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moveHistory = this.state.moveHistory;

    const moves = history.map((step, move) => {

      // Check whether we are "time traveling"
      let isSelected; 
      if (this.state.stepNumber >= moveHistory.length - 1) {
        // If stepNumber and move history are in sync, we can simply check whether the last and current moves match
        isSelected = (moveHistory[moveHistory.length - 1] === moveHistory[move] || moveHistory.length < 2) ? 'bold-text' : 'not-selected'; 
      } else {
        // If we're not on the last step of our moveHistory, then we've traveled back in time
        // In this case, we need to compare the current move to the move associated with our step number
        isSelected = (moveHistory[move] === moveHistory[this.state.stepNumber]) ? 'bold-text' : 'not-selected'; 
      }

      const desc = move ?
        `Go to move #` + move + ` in square ${moveHistory[move]}` :
        `Go to game start`;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={isSelected}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
