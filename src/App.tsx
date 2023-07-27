import React from 'react';
import './App.css';

let paddlepos1:number;
let paddlepos2:number = 0;
let halfpaddle = 53;
let ballposy:number;
let ballposx:number;
// let Ballspeed:number = 8;
// let leftscore:number = 0;
// let rightscore:number = 0;

const Score = ({ leftScore, rightScore }: { leftScore: number; rightScore: number }) => {
  const leftScoreStyle: React.CSSProperties = {
    position: 'absolute',
    left: '15%',
    top: '0',
    textAlign: 'center',
    color: '#E15253',
    fontSize: '30em',
    paddingTop: '5%',
    fontFamily: 'Arial, sans-serif',
    zIndex: 1,
    opacity: '0.1',
  };
  
  const rightScoreStyle: React.CSSProperties = {
    position: 'absolute',
    right: '15%',
    top: '0',
    textAlign: 'center',
    color: '#5699AF',
    fontSize: '30em',
    paddingTop: '5%',
    fontFamily: 'Arial, sans-serif',
    zIndex: 1,
    opacity: '0.1',
  };

  return (
    <>
      <div style={leftScoreStyle}>
        {leftScore}
      </div>
      <div style={rightScoreStyle}>
        {rightScore}
      </div>
    </>
  );
};



const Paddle = ({ color, pos }: { color: string; pos: string }) => {
  const paddleStyle: React.CSSProperties = {
    width: '22px',
    height: '106px',
    backgroundColor: color,
    position: 'relative',
    top: pos,
    boxShadow: `0 0 20px ${color}`,
    borderRadius: '20px',
    marginInline: '20px',
    zIndex: 6,
  };

  return <div style={paddleStyle}></div>;
};

const Ball = ({color, setLeftScore, setRightScore, Ballspeed, setBallspeed, setGameOver, gameOver}: {color: string, setLeftScore: any, setRightScore: any, Ballspeed: number, setBallspeed: any, setGameOver: any, gameOver: any}) => {
  const [ballPos, setBallPos] = React.useState({x: 0, y: 0});
  const moveAngle = React.useRef(Math.PI / 4);  // direction of the ball in radians
  const animationFrameId = React.useRef<number>();

  const ballStyle: React.CSSProperties = {
    width: '25px',
    height: '25px',
    backgroundColor: color,
    borderRadius: '50%',
    position: 'relative',
    left: `${ballPos.x}px`,
    top: `${ballPos.y}px`,
    boxShadow: '0 0 20px white'
  };

  const ballSpeedRef = React.useRef(Ballspeed);

  React.useEffect(() => {
    ballSpeedRef.current = Ballspeed;
  }, [Ballspeed]);

  React.useEffect(() => {
    const moveBall = () => {
      if (!gameOver) {
      setBallPos((prevPos) => {
        let newX = prevPos.x - (ballSpeedRef.current * Math.cos(moveAngle.current));
        let newY = prevPos.y - (ballSpeedRef.current * Math.sin(moveAngle.current));
        ballposy = newY;
        ballposx = newX;
        if (newX < -535 && (newY < paddlepos1 + halfpaddle && newY > paddlepos1 - halfpaddle) ){
          newX = -535;
          moveAngle.current = Math.PI - moveAngle.current;
          setBallspeed((prevspeed:number) => prevspeed + 0.5);
        }
        if (newX > 540 && (newY < paddlepos2 + halfpaddle && newY > paddlepos2 - halfpaddle) ){
          newX = 540;
          moveAngle.current = Math.PI - moveAngle.current;
          setBallspeed((prevspeed:number) => prevspeed + 0.5);
        }
        // han fin katmarka koraaaaaaaaa
        if ((newX < -575 || newX > 580)) {
          if (newX < -575){
            setRightScore((prevScore: number) => {
              const newScore = prevScore + 1;
              if (newScore / 2 == 5) {
                setGameOver(true);
              }
              return newScore;
            });
            setBallspeed(() => 5);
          }
          else if (newX > 580){
            setLeftScore((prevScore: number) => {
              const newScore = prevScore + 1;
              if (newScore / 2 == 5) {
                setGameOver(true);
              }
              return newScore;
            });
            setBallspeed(() => 5);
          }
          newX = 0;
          newY = 0;
        }

        if (newY < -320 || newY > 325) {
          newY = newY < -320 ? -320 : 325; 
          moveAngle.current = -moveAngle.current; 
        }

        return {x: newX, y: newY};
      });

      animationFrameId.current = requestAnimationFrame(moveBall);
    }
    };

    moveBall();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameOver]);

  return <div style={ballStyle}></div>;
};


function App() {
  const [firstPaddlePos, setFirstPaddlePos] = React.useState(0);
  const movePaddle = React.useRef(0);

  const [secondPaddlePos, setSecondPaddlePos] = React.useState(0);
  const moveBluePaddle = React.useRef(0);

  const [leftscore, setLeftScore] = React.useState(0);
  const [rightscore, setRightScore] = React.useState(0);

  const [Ballspeed, setBallspeed] = React.useState(5);

  const [gameOver, setGameOver] = React.useState(false);


  const movecpu = () => {
    if (secondPaddlePos < ballposy)
      moveBluePaddle.current = 0.5;
    else if (secondPaddlePos > ballposy)
      moveBluePaddle.current = -0.5;
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'w') {
        movePaddle.current = -2.5; // lfou9
    } else if (e.key === 'ArrowDown' || e.key === 's') {
      movePaddle.current = 2.5; // lte7t
    }
  };

  const handleKeyUp = () => {
    movePaddle.current = 0; // 7bess
  };

  React.useEffect(() => {
    const updatePaddlePosition = () => {
      if (!gameOver) {
        setFirstPaddlePos((prev) => {
          const newPosition = prev + movePaddle.current;
          const maxPos = 280; 
          const minPos = -275; 
          
          paddlepos1 = Math.min(Math.max(newPosition, minPos), maxPos);
          return paddlepos1;
        });
        
        requestAnimationFrame(updatePaddlePosition);
      }
      };
      
      if (!gameOver) {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        requestAnimationFrame(updatePaddlePosition);
      }
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, [gameOver]);

  React.useEffect(() => {
    const updateSecondPaddlePosition = () => {
      if (!gameOver) {
        setSecondPaddlePos((prev) => {
          let newPosition;
          let cpuspeed:number = 6;
          newPosition = secondPaddlePos;
          if (ballposx > 0)
          if (secondPaddlePos < ballposy){
            if (ballposy - secondPaddlePos <= cpuspeed)
            newPosition = secondPaddlePos + (ballposy - secondPaddlePos);
            else
            newPosition = secondPaddlePos + cpuspeed;
          }
          else if (secondPaddlePos > ballposy){
            if (secondPaddlePos - ballposy <= cpuspeed)
            newPosition = secondPaddlePos - (secondPaddlePos - ballposy);
            else
            newPosition = secondPaddlePos - cpuspeed;
          }
          const maxPos = 280;
          const minPos = -275;
          paddlepos2 = Math.min(Math.max(newPosition, minPos), maxPos);
          return paddlepos2;
          
        });
        requestAnimationFrame(updateSecondPaddlePosition);
      }
    };
    requestAnimationFrame(updateSecondPaddlePosition);
  }, [gameOver, ballposy]);


  return (
    <div className='table'>
      <Paddle color="#E15253" pos={`${firstPaddlePos}px`} />
      <Ball color='white' setLeftScore={setLeftScore} setRightScore={setRightScore} Ballspeed={Ballspeed} setBallspeed={setBallspeed} setGameOver={setGameOver} gameOver={gameOver}/>
      <Paddle color="#5699AF" pos={`${secondPaddlePos}px`} />
      <Score leftScore={leftscore / 2} rightScore={rightscore / 2} />
      <div className="lineC">
        <div className="line"></div>
      </div>
    </div>
  );
}

export default App;

