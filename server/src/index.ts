import express, { Request, Response } from 'express';
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

interface FindPathRequest {
    start: [number, number];
    end: [number, number];
    gridSize: number;
    obstacles: [number, number][]; // Define obstacles as an array of tuples
  }


app.get("/", (req: Request, res: Response) => {
    res.send("Server is up and running");
});

const dfs = (
    start: [number, number],
    end: [number, number],
    gridSize: number,
    visited: Set<string>,
    memo: Map<string, [number, number][]> ,
    obstacles: Set<string> // New parameter to track obstacles
  ): [number, number][] => {
    const posKey = start.toString();
    
    // Check if we have already computed the shortest path from this position
    if (memo.has(posKey)) {
      return memo.get(posKey)!;
    }
  
    // Base case: if we reached the end
    if (start[0] === end[0] && start[1] === end[1]) {
      return [start]; // Return the path containing only the end point
    }
  
    // Directions: diagonals and orthogonal moves
    const directions: [number, number][] = [
      [1, 1],   // down-right
      [-1, -1], // up-left
      [1, -1],  // down-left
      [-1, 1],  // up-right
      [0, 1],   // right
      [1, 0],   // down
      [0, -1],  // left
      [-1, 0]   // up
    ];
  
    visited.add(posKey); // Mark the current position as visited
    let shortestPath: [number, number][] = [];
  
    for (const dir of directions) {
      const nextPos: [number, number] = [start[0] + dir[0], start[1] + dir[1]];
      const nextKey = nextPos.toString();
  
      // Check for bounds, visited, and obstacles
      if (
        nextPos[0] >= 0 && nextPos[1] >= 0 &&
        nextPos[0] < gridSize && nextPos[1] < gridSize &&
        !visited.has(nextKey) &&
        !obstacles.has(nextKey) // Check if the next position is an obstacle
      ) {
        const path = dfs(nextPos, end, gridSize, visited, memo, obstacles);
  
        // If a valid path is found, check if it's shorter
        if (path.length > 0) {
          const fullPath = [start, ...path];
  
          if (shortestPath.length === 0 || fullPath.length < shortestPath.length) {
            shortestPath = fullPath; // Update the shortest path
          }
        }
      }
    }
  
    visited.delete(posKey); // Unmark the current position
    memo.set(posKey, shortestPath); // Store the result in memoization map
    return shortestPath;
  };

app.post("/find-path", (req: Request, res: Response) => {
    const { start, end, gridSize, obstacles } : FindPathRequest = req.body;
    if (!start || !end) {
        res.status(400).json({ error: 'Start and end coordinates are required' });
    }
const visited = new Set<string>();
  const memo = new Map<string, [number, number][]>();
  const obstacleSet = new Set(obstacles.map((pos:[number,number]) => pos.toString()));
    const path = dfs(start, end, gridSize,visited,memo,obstacleSet);
    res.json({ path });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
