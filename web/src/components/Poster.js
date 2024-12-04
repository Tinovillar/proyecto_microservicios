import { useState } from "react";

function Poster({onMovieClick, movie_id, title, year, poster, plot}) {
    const [showDescription, setShowDescription] = useState(false);

    return (
            <>
            <div className="flex flex-col items-center flex-none w-48 h-64 bg-gray-800 p-2 rounded-lg hover:scale-110 transition duration-200" onClick={() => {setShowDescription(true); onMovieClick({id: movie_id, title: title, year: year, plot: plot, poster: poster});}}>
                <img src={poster || "https://via.placeholder.com/100x200"} alt={title} className="w-full h-full object-contain rounded-t-lg"/>
                <div className="flex-col text-white text-center">
                    <p className="font-semibold text-sm">{title} ({year})</p>
                </div>
            </div>
            {showDescription && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="flex justify-center bg-gray-800 w-2/3 h-2/3 p-6 rounded-lg shadow-lg relative">
                  <button className="absolute top-2 right-4 text-2xl font-bold text-white" onClick={() => setShowDescription(false)}>
                  &times;
                  </button>
                  <div className="flex flex-col h-full mr-4">
                    <h2 className="text-2xl text-white font-bold mb-4">{title}</h2>
                    <p className="text-white overflow-y-auto">
                      {plot}
                    </p>
                  </div>
                  <img src={poster || "https://via.placeholder.com/200x300"} alt={title} className="w-auto h-full object-contain rounded-t-lg mr-4"/>
                </div>
              </div>
            )}
            </>
    );
};

export default Poster;