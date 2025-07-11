import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaUser, FaPlay, FaRedo } from 'react-icons/fa';

const DOT_RADIUS = 6;
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;

function getRandomPositions(count) {
  const positions = [];
  const padding = 20;
  while (positions.length < count) {
    const x = Math.floor(Math.random() * (CANVAS_WIDTH - 2 * padding)) + padding;
    const y = Math.floor(Math.random() * (CANVAS_HEIGHT - 2 * padding)) + padding;
    if (!positions.some(p => Math.abs(p.x - x) < 15 && Math.abs(p.y - y) < 15)) {
      positions.push({ x, y });
    }
  }
  return positions;
}

function CleaningGame({ laborRate, courts }) {
  const [playerDots, setPlayerDots] = useState([]);
  const [robotDots, setRobotDots] = useState([]);
  const [robotPos, setRobotPos] = useState({ x: 0, y: 0 });
  const [playerTime, setPlayerTime] = useState(0);
  const [robotTime, setRobotTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [winner, setWinner] = useState(null);
  
  const playerCanvasRef = useRef(null);
  const robotCanvasRef = useRef(null);
  const robotIntervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const playerTimerRef = useRef(null);

  const initializeGame = () => {
    if (robotIntervalRef.current) {
      clearInterval(robotIntervalRef.current);
      robotIntervalRef.current = null;
    }
    if (playerTimerRef.current) {
      clearInterval(playerTimerRef.current);
      playerTimerRef.current = null;
    }

    const positions = getRandomPositions(Math.min(courts, 20));
    setPlayerDots(positions.map(p => ({ ...p, cleaned: false })));
    setRobotDots(positions.map(p => ({ ...p, cleaned: false })));
    setRobotPos({ x: 0, y: 0 });
    setPlayerTime(0);
    setRobotTime(0);
    setGameStarted(false);
    setGameFinished(false);
    setWinner(null);
  };

  const startGame = () => {
    setGameStarted(true);
    startTimeRef.current = Date.now();
    
    playerTimerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        setPlayerTime((Date.now() - startTimeRef.current) / 1000);
      }
    }, 100);
  };

  useEffect(() => {
    initializeGame();
    return () => {
      if (robotIntervalRef.current) {
        clearInterval(robotIntervalRef.current);
      }
      if (playerTimerRef.current) {
        clearInterval(playerTimerRef.current);
      }
    };
  }, [courts]);

  // Fixed robot cleaning logic - addresses both issues
  useEffect(() => {
    if (!gameStarted || gameFinished || robotDots.length === 0) return;

    const robotDotsCopy = [...robotDots];
    let currentIndex = 0;
    
    const baseSpeed = 800;
    const speedMultiplier = Math.max(0.3, 1 - (laborRate - 10) / 100);
    const cleaningSpeed = baseSpeed * speedMultiplier;

    robotIntervalRef.current = setInterval(() => {
      // Move robot icon to current position FIRST
      if (robotDotsCopy[currentIndex]) {
        setRobotPos({ 
          x: robotDotsCopy[currentIndex].x, 
          y: robotDotsCopy[currentIndex].y 
        });
      }

      // Then clean the dot
      setRobotDots(prev => {
        const newDots = [...prev];
        if (newDots[currentIndex]) {
          newDots[currentIndex].cleaned = true;
        }
        return newDots;
      });
      
      // Increment index AFTER cleaning
      currentIndex++;

      // Check if we've cleaned all dots (including the last one)
      if (currentIndex >= robotDotsCopy.length) {
        // Robot finished - clean up and set winner
        if (robotIntervalRef.current) {
          clearInterval(robotIntervalRef.current);
          robotIntervalRef.current = null;
        }
        
        if (startTimeRef.current) {
          setRobotTime((Date.now() - startTimeRef.current) / 1000);
        }
        
        setWinner('robot');
        setGameFinished(true);
        
        if (playerTimerRef.current) {
          clearInterval(playerTimerRef.current);
          playerTimerRef.current = null;
        }
        return;
      }
    }, cleaningSpeed);

    return () => {
      if (robotIntervalRef.current) {
        clearInterval(robotIntervalRef.current);
        robotIntervalRef.current = null;
      }
    };
  }, [gameStarted, robotDots.length, laborRate, gameFinished]);

  // Draw player canvas
  useEffect(() => {
    const canvas = playerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_WIDTH; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let j = 0; j <= CANVAS_HEIGHT; j += 50) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(CANVAS_WIDTH, j);
      ctx.stroke();
    }

    playerDots.forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = dot.cleaned ? '#e9ecef' : '#8B4513';
      ctx.fill();
      ctx.strokeStyle = dot.cleaned ? '#adb5bd' : '#654321';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [playerDots]);

  // Draw robot canvas
  useEffect(() => {
    const canvas = robotCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_WIDTH; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let j = 0; j <= CANVAS_HEIGHT; j += 50) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(CANVAS_WIDTH, j);
      ctx.stroke();
    }

    robotDots.forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = dot.cleaned ? '#e9ecef' : '#8B4513';
      ctx.fill();
      ctx.strokeStyle = dot.cleaned ? '#adb5bd' : '#654321';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    if (gameStarted && robotPos.x > 0 && robotPos.y > 0) {
      ctx.fillStyle = '#007bff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🤖', robotPos.x, robotPos.y);
    }
  }, [robotDots, robotPos, gameStarted]);

  const handlePlayerClick = (e) => {
    if (!gameStarted || gameFinished) return;
    
    const rect = playerCanvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPlayerDots(prev => {
      const newDots = prev.map(dot => {
        if (!dot.cleaned) {
          const dx = dot.x - x;
          const dy = dot.y - y;
          if (dx * dx + dy * dy <= (DOT_RADIUS + 5) * (DOT_RADIUS + 5)) {
            return { ...dot, cleaned: true };
          }
        }
        return dot;
      });

      if (newDots.every(d => d.cleaned) && !gameFinished) {
        if (startTimeRef.current) {
          setPlayerTime((Date.now() - startTimeRef.current) / 1000);
        }
        setWinner('player');
        setGameFinished(true);
        
        if (playerTimerRef.current) {
          clearInterval(playerTimerRef.current);
          playerTimerRef.current = null;
        }
        if (robotIntervalRef.current) {
          clearInterval(robotIntervalRef.current);
          robotIntervalRef.current = null;
        }
      }

      return newDots;
    });
  };

  const timeDiff = winner === 'robot' && robotTime > 0 && playerTime > robotTime ? playerTime - robotTime : 0;
  const costSavings = timeDiff > 0 ? (timeDiff / 3600) * laborRate : 0;
  const playerCleaned = playerDots.filter(d => d.cleaned).length;
  const robotCleaned = robotDots.filter(d => d.cleaned).length;

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        Court Cleaning Challenge: Human vs Robot
      </h2>
      
      <div className="flex justify-center mb-4">
        {!gameStarted ? (
          <button
            onClick={startGame}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaPlay /> Start Game
          </button>
        ) : (
          <button
            onClick={initializeGame}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <FaRedo /> Reset Game
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 justify-center items-start">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaUser className="text-blue-600" />
            <h3 className="text-lg font-semibold">Manual Cleaning</h3>
          </div>
          <canvas
            ref={playerCanvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-2 border-gray-300 rounded cursor-pointer hover:border-blue-400 transition-colors"
            onClick={handlePlayerClick}
          />
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Cleaned: {playerCleaned}/{playerDots.length}
            </p>
            <p className="text-lg font-mono">
              Time: {playerTime.toFixed(1)}s
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaRobot className="text-green-600" />
            <h3 className="text-lg font-semibold">Robot Cleaning</h3>
          </div>
          <canvas
            ref={robotCanvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-2 border-gray-300 rounded"
          />
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Cleaned: {robotCleaned}/{robotDots.length}
            </p>
            <p className="text-lg font-mono">
              Time: {robotTime.toFixed(1)}s
            </p>
          </div>
        </div>

        <div className="text-center lg:text-left">
          <h3 className="text-lg font-semibold mb-4">Results</h3>
          
          {winner && (
            <div className="mb-4">
              <p className="text-xl font-bold">
                Winner: {winner === 'robot' ? '🤖 Robot' : '👤 Human'}
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="bg-white p-3 rounded border">
              <p className="text-sm text-gray-600">Labor Rate</p>
              <p className="text-lg font-semibold">${laborRate}/hour</p>
            </div>
            
            {timeDiff > 0 && (
              <div className="bg-green-100 p-3 rounded border border-green-300">
                <p className="text-sm text-green-700">Time Saved</p>
                <p className="text-lg font-semibold text-green-800">
                  {timeDiff.toFixed(1)}s
                </p>
              </div>
            )}
            
            <div className="bg-green-100 p-3 rounded border border-green-300">
              <p className="text-sm text-green-700">Cost Savings</p>
              <p className="text-xl font-bold text-green-800">
                ${costSavings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Click the brown dots on the left canvas to clean them manually.</p>
        <p>Watch the robot systematically clean the right canvas automatically.</p>
      </div>
    </div>
  );
}

export default CleaningGame;
