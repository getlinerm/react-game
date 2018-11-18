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
        onClick={() => this.props.onClick(i)}
        key={i}
      />
    );
  }

  renderRow(row){
    let coloums = [];
    for(let i = 0; i < this.props.size; i++){
      coloums.push(this.renderSquare(row * this.props.size + i));
    }
    return (
      <div 
        className="board-row" 
        key={row}>
        {coloums}
      </div>
    );
  }

  render() {
    let rows = [];
    for(let i = 0; i < this.props.size; i++){
      rows.push(this.renderRow(i));
    }
    return (
      <div>{rows}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(Math.pow(this.props.size, 2)).fill(null),
          position: {row: null, column: null} //在历史记录中显示落子行列位置
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      // size: 3 // 棋盘大小
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const position = {...current.position};
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    position.row = Math.ceil((i + 1) / this.props.size);
    position.column = i % this.props.size + 1; 

    this.setState({
      history: history.concat([
        {
          squares: squares,
          position: position
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
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

    const moves = history.map((step, move) => {
      const position = step.position;
      const desc = move ?
        `Go to move #${move}. row: ${position.row}, column: ${position.column}`:
        `Go to game start. row: , column: `;
      return (
        <li key={move}>
          <button 
            className={this.state.stepNumber === move ? 'active' : ''}
            onClick={() => this.jumpTo(move)}>{desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            size={this.props.size}
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

// ========================================

ReactDOM.render(<Game size={3}/>, document.getElementById("root"));

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
      return squares[a];
    }
  }
  return null;
}

