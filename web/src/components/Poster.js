import { useState } from "react";

function Poster(props) {
    const [showDescription, setShowDescription] = useState(false);

    return (
            <>
            <div class="flex flex-col items-center flex-none w-48 h-64 bg-gray-800 p-2 rounded-lg hover:scale-110 transition duration-200" onClick={() => setShowDescription(!showDescription)}>
                <img src={props.poster || "https://via.placeholder.com/100x200"} alt={props.title} class="w-full h-full object-contain rounded-t-lg"/>
                <div class="flex-col text-white text-center">
                    <p class="font-semibold text-sm">{props.title} ({props.year})</p>
                </div>
            </div>
            {showDescription && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-gray-800 text-white p-6 rounded-lg w-96">
                  <button
                    className="absolute top-2 right-2 text-white text-4xl font-bold"
                    onClick={() => setShowDescription(false)}
                  >
                    &times; {/* Close button */}
                  </button>
                  <p>{props.plot}</p>
                </div>
              </div>
            )}
            </>
    );
};

export default Poster;