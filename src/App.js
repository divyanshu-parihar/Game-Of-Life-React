import "./styles.css";
import produce from "immer";
import { useCallback, useState, useEffect, useRef } from "react";
import Nav from "./Nav";

const operations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
  [-1, 0]
];

let GRID_SIZE = 50;
export default function App() {
  let [grid, setGrid] = useState(() =>
    Array(GRID_SIZE)
      .fill(0)
      .map((x) => Array(GRID_SIZE).fill(0))
  );
  let [running, setRunning] = useState(false);
  let runningRef = useRef(running);
  runningRef.current = running;
  const resetGame = useCallback(() => {
    setGrid((g) => {
      return produce(g, (newGrid) =>
        Array(GRID_SIZE)
          .fill(0)
          .map((x) => Array(GRID_SIZE).fill(0))
      );
    });
  }, []);
  const generateRandomGrid = () => {
    const rows = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      rows.push(
        Array.from(Array(GRID_SIZE), () => (Math.random() > 0.7 ? 1 : 0))
      );
    }

    setGrid(rows);
    return rows;
  };
  const handleChange = useCallback(
    (i, j) => {
      setGrid(
        produce((newGrid) => {
          let newVal = grid[i][j] ? 0 : 1;
          newGrid[i][j] = newVal;
          // console.log();

          return newGrid;
        })
      );
    },
    [grid]
  );
  const simulation = () => {
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < 50; i++) {
          for (let k = 0; k < 50; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < 50 && newK >= 0 && newK < 50) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });
    setTimeout(simulation, 1000);
  };
  useEffect(() => {}, []);
  return (
    <div className="App">
      <Nav />
      <input
        style={{ margin: "5px" }}
        className="btn"
        onClick={() => {
          setRunning((s) => !s);
          runningRef.current = true;
          simulation();
        }}
        type="button"
        value={running ? "Stop" : "Start"}
      />
      <input
        style={{ margin: "5px" }}
        className="btn"
        onClick={() => generateRandomGrid()}
        type="button"
        value="random"
      />
      <input
        style={{ margin: "5px" }}
        className="btn"
        onClick={() => {
          setRunning(false);
          runningRef.current = false;
          resetGame();
        }}
        type="button"
        value="reset"
      />
      <div className="grid" style={{ lineHeight: "0px" }}>
        <div>
          {grid.map((row, i1) => {
            return (
              <div key={i1}>
                {row.map((el, i2) => (
                  <div
                    className="node"
                    onClick={() => handleChange(i1, i2)}
                    style={{
                      margin: "1px",
                      backgroundColor: grid[i1][i2] === 1 ? "pink" : undefined
                    }}
                    key={i2}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
