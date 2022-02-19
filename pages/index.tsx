import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import type { NextPage } from 'next';
import { useState, KeyboardEvent, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

import { db } from '../firebase';

const Home: NextPage = () => {
  /* 座標 */
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const styles = useSpring({
    top: 0,
    left: 0,
    to: { top: coordinates.y * 60, left: coordinates.x * 60 },
  });
  const moveTop = () => {
    if (coordinates.y < 1) return;
    setCoordinates({
      x: coordinates.x,
      y: coordinates.y - 1,
    });
    savePosition({
      x: coordinates.x,
      y: coordinates.y - 1,
    });
  };
  const moveRight = () => {
    if (coordinates.x > 8) return;
    setCoordinates({
      x: coordinates.x + 1,
      y: coordinates.y,
    });
    savePosition({
      x: coordinates.x + 1,
      y: coordinates.y,
    });
  };
  const moveBottom = () => {
    if (coordinates.y > 8) return;
    setCoordinates({
      x: coordinates.x,
      y: coordinates.y + 1,
    });
    savePosition({
      x: coordinates.x,
      y: coordinates.y + 1,
    });
  };
  const moveLeft = () => {
    if (coordinates.x < 1) return;
    setCoordinates({
      x: coordinates.x - 1,
      y: coordinates.y,
    });
    savePosition({
      x: coordinates.x - 1,
      y: coordinates.y,
    });
  };
  const [isAwait, setIsAwait] = useState(false);
  const onKeyDown = async (e: KeyboardEvent<HTMLDivElement>) => {
    if (isAwait) return;
    setIsAwait(true);
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        moveTop();
        break;
      case 'ArrowRight':
      case 'd':
        moveRight();
        break;
      case 'ArrowDown':
      case 's':
        moveBottom();
        break;
      case 'ArrowLeft':
      case 'a':
        moveLeft();
        break;
      default:
        break;
    }
    await new Promise((s) => setTimeout(s, 100));
    setIsAwait(false);
  };

  const savePosition = async (coordinates: { x: number; y: number }) => {
    /* firestoreによる処理 */
    const ref = doc(db, '2d-game', 'testDoc');
    await setDoc(ref, coordinates);
    /* Realtime DB による処理 */
  };

  useEffect(() => {
    /* firestoreによる処理 */
    onSnapshot(doc(db, '2d-game', 'testDoc'), (snapshot) => {
      const { x, y } = snapshot.data() as { x: number; y: number };
      setCoordinates({ x, y });
    });
    /* Realtime DB による処理 */
  }, []);

  return (
    <div>
      <div
        className='ring-2 ring-slate-600 w-[600px] h-[600px] bg-slate-300 relative outline-none'
        tabIndex={0}
        onKeyDown={(e) => onKeyDown(e)}
      >
        <animated.div
          className='w-[60px] h-[60px] bg-red-500 absolute rounded-md'
          style={styles}
        ></animated.div>
      </div>

      <div className='space-x-1 space-y-1 mt-4'>
        <button className='bg-gray-400 text-gray-400 font-bold py-2 px-4 rounded ml-1'>
          ←
        </button>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={moveTop}
        >
          ↑
        </button>
        <button className='bg-gray-400 text-gray-400 font-bold py-2 px-4 rounded'>
          →
        </button>

        <br />

        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={moveLeft}
        >
          ←
        </button>
        <button className='bg-gray-400 text-gray-400 font-bold py-2 px-4 rounded'>
          ↑
        </button>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={moveRight}
        >
          →
        </button>

        <br />

        <button className='bg-gray-400 text-gray-400 font-bold py-2 px-4 rounded'>
          ←
        </button>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={moveBottom}
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
