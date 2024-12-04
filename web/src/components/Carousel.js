import { useEffect, useState } from "react";
import Poster from "./Poster";

function Carousel(props) {
  let [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(props.fetch_url);
        const result = await response.json();
        console.log(result);
        setMovies(result);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [props.fetch_url]);

  return (
      <div className="container mx-auto">
        <div className="relative">
        <h2 className="text-xl text-white font-bold mb-3 ml-4">{props.title}</h2>
          <div className="overflow-x-auto flex space-x-4 py-4 bg-gray-800">
            {movies.map((e) =>
              <Poster key={e.id} movie_id={e.id} title={e.title} year={e.year} poster={e.poster} plot={e.plot} onMovieClick={props.onMovieClick}/>
            )}
          </div>
        </div>
      </div>
  );
}

export default Carousel;