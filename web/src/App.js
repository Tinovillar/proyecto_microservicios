import Carousel from "./components/Carousel";
import { useState, useEffect } from "react";
function App() {
  const [clickCount, setClickCount] = useState(0);
  const [key, setKey] = useState(0);
  const [seenMovies, setSeenMovies] = useState([]);

  const handleMovieClick = (movie) => {
    console.log(seenMovies);
    if (seenMovies.some(item => item.id === movie.id)) {
      return;
    } else {
      setSeenMovies([...seenMovies, movie]);
      setClickCount((prevCount) => prevCount + 1); 
    }
  }

  useEffect(() => {
    if (clickCount === 6) {
      sendSeenMovies();
      setKey((prevKey) => prevKey + 1);
      setClickCount(0); // Resetear el contador después de ejecutar la función
    }
  }, [clickCount]);

  const sendSeenMovies = async () => {
    const response = await fetch('http://localhost:3010/viewed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(seenMovies),
    });
    const data = await response.json();
    console.log(data);
    setSeenMovies([]);
  }

  return (
    <div className="bg-gray-900 h-screen flex flex-col items-center justify-evenly">
      <div className="flex justify-center">
        <h2 className="text-white text-4xl">DCICFlix</h2>
      </div>
      <Carousel title={'Other movies'} fetch_url={'http://localhost:4141/random/40'} onMovieClick={handleMovieClick}/>
      <Carousel key={key} title={'Recommendations'} fetch_url={'http://localhost:8000/recommendations'} onMovieClick={handleMovieClick}/>
    </div>
  );
}

export default App;
