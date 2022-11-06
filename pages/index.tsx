import type { NextPage } from 'next';
import { useState, KeyboardEvent, useEffect, useMemo } from 'react';
import { useSpring, animated } from 'react-spring';

const Home: NextPage = () => {
  /* 座標 */
  const [coordinates1, setCoordinates1] = useState({ x: 0, y: 0 });
  const [coordinates2, setCoordinates2] = useState({ x: 5, y: 5 });
  const touch = useMemo(
    () =>
      coordinates1.x === coordinates2.x && coordinates1.y === coordinates2.y,
    [coordinates1, coordinates2],
  );

  const styles1 = useSpring({
    top: 0,
    left: 0,
    to: { top: coordinates1.y * 60, left: coordinates1.x * 60 },
  });
  const styles2 = useSpring({
    top: 0,
    left: 0,
    to: { top: coordinates2.y * 60, left: coordinates2.x * 60 },
  });
  const moveTop = (
    coordinates: { x: number; y: number },
    setCoordinates: (param: { x: number; y: number }) => void,
  ) => {
    if (coordinates.y < 1) return false;
    setCoordinates({
      x: coordinates.x,
      y: coordinates.y - 1,
    });
    return true;
  };
  const moveRight = (
    coordinates: { x: number; y: number },
    setCoordinates: (param: { x: number; y: number }) => void,
  ) => {
    if (coordinates.x > 8) return false;
    setCoordinates({
      x: coordinates.x + 1,
      y: coordinates.y,
    });
    return true;
  };
  const moveBottom = (
    coordinates: { x: number; y: number },
    setCoordinates: (param: { x: number; y: number }) => void,
  ) => {
    if (coordinates.y > 8) return false;
    setCoordinates({
      x: coordinates.x,
      y: coordinates.y + 1,
    });
    return true;
  };
  const moveLeft = (
    coordinates: { x: number; y: number },
    setCoordinates: (param: { x: number; y: number }) => void,
  ) => {
    if (coordinates.x < 1) return false;
    setCoordinates({
      x: coordinates.x - 1,
      y: coordinates.y,
    });
    return true;
  };

  const [isAwait, setIsAwait] = useState(false);
  const onKeyDown = async (e: KeyboardEvent<HTMLDivElement>) => {
    if (isAwait) return;
    setIsAwait(true);
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        moveTop(coordinates1, setCoordinates1);
        break;
      case 'ArrowRight':
      case 'd':
        moveRight(coordinates1, setCoordinates1);
        break;
      case 'ArrowDown':
      case 's':
        moveBottom(coordinates1, setCoordinates1);
        break;
      case 'ArrowLeft':
      case 'a':
        moveLeft(coordinates1, setCoordinates1);
        break;
      default:
        break;
    }
    await new Promise((s) => setTimeout(s, 1000));
    setIsAwait(false);
  };

  useEffect(() => {
    /* Random walk */
    const interval = setInterval(() => {
      touch && alert('touch');
      let isMoved = false;
      while (!isMoved) {
        const random = Math.floor(Math.random() * 4);
        switch (random) {
          case 0:
            isMoved = moveTop(coordinates2, setCoordinates2);
            break;
          case 1:
            isMoved = moveRight(coordinates2, setCoordinates2);
            break;
          case 2:
            isMoved = moveBottom(coordinates2, setCoordinates2);
            break;
          case 3:
            isMoved = moveLeft(coordinates2, setCoordinates2);
            break;
          default:
            break;
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [coordinates2, touch]);

  return (
    <div>
      <div
        className='ring-2 ring-slate-600 w-[600px] h-[600px] bg-slate-300 relative outline-none'
        tabIndex={0}
        onKeyDown={(e) => onKeyDown(e)}
      >
        <animated.div
          className='w-[60px] h-[60px] bg-red-500 absolute rounded-md'
          style={styles1}
        ></animated.div>
        <animated.div
          className='w-[60px] h-[60px] bg-blue-500 absolute rounded-md'
          style={styles2}
        ></animated.div>
      </div>

      <div>{!touch ? '逃げろー' : '捕まりました'}</div>

      <div className='space-x-1 space-y-1 mt-4'>
        <button className='bg-gray-400 text-gray-400 font-bold py-2 px-4 rounded ml-1'>
          ←
        </button>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={() => moveTop(coordinates1, setCoordinates1)}
        >
          ↑
        </button>
        <button className='bg-gray-400 text-gray-400 font-bold py-2 px-4 rounded'>
          →
        </button>

        <br />

        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={() => moveLeft(coordinates1, setCoordinates1)}
        >
          ←
        </button>
        <button className='bg-gray-400 text-gray-400 font-bold py-2 px-4 rounded'>
          ↑
        </button>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={() => moveRight(coordinates1, setCoordinates1)}
        >
          →
        </button>

        <br />

        <button className='bg-gray-400 text-gray-400 font-bold py-2 px-4 rounded'>
          ←
        </button>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={() => moveBottom(coordinates1, setCoordinates1)}
        >
          ↓
        </button>
        <button className='bg-gray-400 text-gray-400 font-bold py-2 px-4 rounded'>
          →
        </button>
      </div>
    </div>
  );
};

export default Home;
