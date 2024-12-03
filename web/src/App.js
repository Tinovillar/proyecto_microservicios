import Carousel from "./components/Carousel";
function App() {

  return (
    <div className="bg-gray-900 h-screen flex flex-col items-center justify-evenly">
      <div className="flex justify-center">
        <h2 className="text-white text-4xl">DCICFlix</h2>
      </div>
      <Carousel title={'Other movies'} fetch_url={'http://random_movies:4141/random/40'} />
      <Carousel title={'Recommendations'} fetch_url={'http://random_movies:4141/random/40'} />
    </div>
  );
}

export default App;
