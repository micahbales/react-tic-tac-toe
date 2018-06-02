import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.className + 'square'} onClick={props.onClick}>
        {props.value}
      </button>
  );
}

function Button(props) {
  return (
    <div>
        <button className={props.className} onClick={props.onClick}>
          Reverse Step Order (Now {props.stepOrderAsc ? 'Asc' : 'Desc'})
        </button>
    </div>
  )
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
      key={i}
      value={this.props.squares[i]} 
      onClick={() => this.props.onClick(i)}
      className={this.props.winningSquares.includes(i) ? 'highlighted ' : ''}
      />
    );
  }

  render() {
    // Render game board with 9 squares, 3 rows with 3 columns
    let squareNum = 0;
    return (
      <div>
        {
          [1,2,3].map((rowNum) => {
            return (
              <div className="board-row" key={rowNum}>
                {
                  [1,2,3].map((colNum) => {
                    return this.renderSquare(squareNum++)
                  })
                }
              </div>
            )
          })
        }
      </div>
    )
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
      moveHistory: [null],
      stepOrderAsc: true,
      winningSquares: []
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const moveHistory = this.state.moveHistory;

    // No click action if already winner or space is already filled in
    if (calculateWinner(squares)[0] || squares[i]) return;

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        moveHistory: moveHistory.push(i)
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
    
    // Once squares have been updated, check to see if there is a winner
    const winningSquares = calculateWinner(squares)[1];
    // If so, highlight those squares
    if (winningSquares) this.setState({winningSquares});
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
    const moveHistory = this.state.moveHistory;
    const winner = calculateWinner(current.squares)[0];

    let moves = history.map((step, move) => {

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

    // Set step order to descending, if the user has clicked the button
    if (!this.state.stepOrderAsc) moves = moves.reverse();

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
          winningSquares={this.state.winningSquares}
          />

          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
        
        <div className="controls">
          <Button
          className="button"
          stepOrderAsc={this.state.stepOrderAsc}
          onClick={() => {
            this.setState({
              stepOrderAsc: this.state.stepOrderAsc ? false : true
            })
          }}
          />
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
      // Return both the winner name (X/O) and the list of winning squares
      return [squares[a], lines[i]];
    }
  }
  return [null, null];
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
