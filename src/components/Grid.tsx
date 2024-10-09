import React, { useEffect, useRef, useState } from "react";

type gridState = "empty" | "start" | "end" | "path" | "obstacle";

const Grid: React.FC = () => {
  const gridSize = 3;
  const matrix = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill("empty")
  );
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [grid, setGrid] = useState<gridState[][]>(matrix);
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);
  const [isObstacleMode, setIsObstacleMode] = useState<boolean>(false);
  const [obstacles,setObstacle] = useState<[number,number][]> ([])

  const handleTileClick = (row: number, col: number) => {
    if (isObstacleMode && grid[row][col] === "empty") {
        setObstacle((prev) => [...prev, [row,col] ])
        setGrid((prev) => {
          const newGrid = [...prev];
          newGrid[row][col] = "obstacle"; // Set the clicked tile to "obstacle"
          return newGrid;
        });
        return; // Exit the function after adding an obstacle
      }
    if (start !== null && start[0] === row && start[1] == col) {
      setStart(null);
      setGrid((prev) => {
        const newGrid = [...prev];
        newGrid[row] = [...newGrid[row]];
        newGrid[row][col] = "empty";
        return newGrid;
      });
    } else if (end !== null && end[0] === row && end[1] == col) {
      setEnd(null);
      setGrid((prev) => {
        const newGrid = [...prev];
        newGrid[row] = [...newGrid[row]];
        newGrid[row][col] = "empty";
        return newGrid;
      });
    } else {
      if (!start) {
        setStart([row, col]); 
        setGrid((prev) => {
          const newGrid = [...prev];
          newGrid[row] = [...newGrid[row]];
          newGrid[row][col] = "start";
          return newGrid;
        });
      } else if (!end) {
        setEnd([row, col]);
        setGrid((prev) => {
          const newGrid = [...prev];
          newGrid[row] = [...newGrid[row]];
          newGrid[row][col] = "end";
          return newGrid;
        });
      }
    }
  };
  const getPath = async () => {
    try {
      const res = await fetch("http://localhost:3000/find-path", {
        // Make sure the URL is correct
        method: "POST", // Specify the HTTP method
        headers: {
          "Content-Type": "application/json", // Indicate the content type
        },
        body: JSON.stringify({
          start: start,
          end: end,
          gridSize: gridSize,
          obstacles: obstacles
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`); // Check if response is OK
      }

      const data = await res.json(); // Parse the JSON response
      colorPath(data.path);
    } catch (error) {
      console.error("Error fetching data:", error); // Handle any errors
    }
  };
  const colorPath = (data: [number, number][]) => {
    if(data.length === 0) alert("No Path Exist");
    data.shift();
    data.pop();
    const currentGrid = grid.map((row) => [...row]);
    data.forEach((tilePos: [number, number]) => {
      currentGrid[tilePos[0]][tilePos[1]] = "path";
    });
    setGrid(currentGrid);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gridRef.current && !gridRef.current.contains(event.target as Node)) {
        // Check if the click was outside the grid
        setIsObstacleMode(false); // Exit add obstacle mode if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [gridRef]);


  const resetGrid = () => {
    setGrid(matrix);
  };
  return (
    <div className={`w-full flex flex-col items-center gap-2`}>
      <div className="flex gap-4">
        <button
          className="border rounded p-2 bg-slate-600 text-white"
          onClick={getPath}
        >
          Find Path
        </button>
        <button
          className="border rounded p-2 bg-slate-600 text-white"
          onClick={resetGrid}
        >
          Reset Grid
        </button>
        <button 
            className="border rounded p-2 bg-slate-600 text-white"
            onClick={() => {setIsObstacleMode((prev) => !prev)}}
        >
          {isObstacleMode ? "Obstacle mode" : "Add Obstacle"}
        </button>
      </div>
      <div ref={gridRef}>
      {grid.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className="flex gap-2">
            {row.map((col, colIndex) => {
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-10 h-10 flex gap- 2 items-center justify-center border border-gray-300 rounded-lg ${
                    col === "start"
                      ? "bg-green-500"
                      : col === "end"
                      ? "bg-red-500"
                      : col === "path"
                      ? "bg-yellow-600" 
                      : col === 'obstacle'
                      ? "bg-black"
                      : "bg-white"
                  }`}
                  onClick={() => handleTileClick(rowIndex, colIndex)}
                ></div>
              );
            })}
          </div>
        );
      })}
      </div>
      
    </div>
  );
};

export default Grid;
