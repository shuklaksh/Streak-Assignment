import './App.css'
import Grid from './components/Grid'

function App() {
 

  return (
    <div className='flex flex-col items-center w-full h-screen'>
      <h1 className='text-lg p-5'>
        Path Finder 
      </h1>
      <div>
        <Grid />
      </div>
      
    </div>
  )
}

export default App
