import React, { useState } from 'react'

type gridState = 'empty' | 'start' | 'end' | 'path' | 'obstacle'

const Grid: React.FC = () => {
    const length = 5;
    const height = 5;
    const matrix = Array.from({ length: length }, () => Array(height).fill('empty'));
    const [grid,setGrid] = useState<gridState[][]>(matrix);
    const [start, setStart] = useState<[number, number] | null>(null);
    const [end, setEnd] = useState<[number, number] | null>(null);

  
    const handleTileClick = (row: number, col: number) => {
        if(start !== null && start[0] === row && start[1] == col) {
            console.log("hjhjhjh")
            setStart(null)
            setGrid(prev => {
                const newGrid = [...prev]
                newGrid[row] = [...newGrid[row]]
                newGrid[row][col] = 'empty'
                return newGrid
              })
        }
        else if(end !== null && end[0] === row && end[1] == col) {
            setEnd(null)
            setGrid(prev => {
                const newGrid = [...prev]
                newGrid[row] = [...newGrid[row]]
                newGrid[row][col] = 'empty'
                return newGrid
              })
        }
        else {
            if (!start) {
                setStart([row, col]);
                setGrid(prev => {
                    const newGrid = [...prev]
                    newGrid[row] = [...newGrid[row]]
                    newGrid[row][col] = 'start'
                    return newGrid
                  })
                
            } else if (!end) {
                setEnd([row, col]);
                setGrid(prev => {
                    const newGrid = [...prev]
                    newGrid[row] = [...newGrid[row]]
                    newGrid[row][col] = 'end'
                    return newGrid
                  })
            }
        } 
    };
  return (
    <div className='w-full flex flex-col items-center gap-2 '>
        <div className='flex gap-4'>
            <button className='border rounded p-2 bg-slate-600 text-white'>Find Path</button>
            <button className='border rounded p-2 bg-slate-600 text-white'> Reset Grid</button>
            <button className='border rounded p-2 bg-slate-600 text-white'> Add Obstacle </button>
        </div>
        {
            grid.map((row,rowIndex) => {
                return (
                    <div key={rowIndex} className='flex gap-2'>
                        {
                            row.map((col, colIndex) => {
                                return (
                                    <div 
                                    key={`${rowIndex}-${colIndex}`}
                                    className={`w-10 h-10 flex gap- 2 items-center justify-center border border-gray-300 rounded-lg ${
                                        col === 'start' ? 'bg-green-500' :
                                        col === 'end' ? 'bg-red-500' : 'bg-white'
                                    }`}
                                    onClick={() => handleTileClick(rowIndex,colIndex)}
                                    >
                                     
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            })
        }
    </div>
  )
}

export default Grid
