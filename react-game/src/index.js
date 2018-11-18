import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; 

class Square extends React.Component {
  render(){
    return (
      <button 
        className={this.props.target ? 'square target' : 'square'} 
        onClick={this.props.onClick}>
        {this.props.value }
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i, target) {
    return (
      <Square
        value={this.props.squares[i]}
        target={target}
        onClick={() => this.props.onClick(i)}
        key={i}
      />
    );
  }

  renderRow(row, sword){
    let coloums = [];
    for(let i = 0; i < this.props.size; i++){
      let num = row * this.props.size + i;
      let target = sword.includes(num);
      
      coloums.push(this.renderSquare(num, target));
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
      rows.push(this.renderRow(i, this.props.sword));
    }
    return (
      <div>{rows}</div>
    );
  }
}

class Moves extends React.Component {
  render(){
    const moves = this.props.history.map((step, move) => {
      const position = step.position;
      const desc = move ?
        `Go to move #${move}. row: ${position.row}, column: ${position.column}`:
        `Go to game start. row: , column: `;
      return (
        <li key={move}>
          <button 
            className={this.props.stepNumber === move ? 'active' : ''}
            onClick={() => {this.props.onClick(move)}}>{desc}
          </button>
        </li>
      );
    });
    if(!this.props.orderASC){
      moves.reverse();
    }
    return (
      <div>
        <button onClick={() => {this.props.onToggle()}}>
          {this.props.orderASC ? 'asc' : 'desc'}
        </button>
        <ol>{moves}</ol>
      </div>
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
      orderASC: true,
      sword: [] // 赢得比赛的凭据
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const position = {...current.position};
    if (squares[i]) {
      return;
    }
    if (calculateWinner(squares).winner) {
      this.setState({
        sword: calculateWinner(squares).sword
      });
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    position.row = Math.ceil((i + 1) / this.props.size);
    position.column = i % this.props.size + 1; 

    this.setState(
      {
        history: history.concat([
          {
            squares: squares,
            position: position
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      },
      () => {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
      
        if (calculateWinner(squares).winner) {
          this.setState({
            sword: calculateWinner(squares).sword
          });
        }
      } 
    );
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  toggleOrder(){
    this.setState({
      orderASC: !this.state.orderASC
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares).winner;

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
            sword={this.state.sword}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <Moves
            history={this.state.history}
            orderASC={this.state.orderASC}
            stepNumber={this.state.stepNumber}
            onToggle={()=>{this.toggleOrder();}}
            onClick={(i)=> {this.jumpTo(i);}}
          />
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
      return {
        winner: squares[a],
        sword: [a,b,c]
      };
    }
  }
  return {
    winner: null,
    sword: []
  };
}