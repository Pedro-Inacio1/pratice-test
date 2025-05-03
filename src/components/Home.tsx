import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-100">
      <Link to="/registerEmployee">
        <button className="w-72 h-12 bg-black text-white rounded hover:bg-white hover:text-black border border-black transition">
          Cadastrar novo funcionário
        </button>
      </Link>
      <Link to="/app">
        <button className="w-72 h-12 bg-black text-white rounded hover:bg-white hover:text-black border border-black transition">
          Consultar dados de funcionário
        </button>
      </Link>
    </div>
  )
}

export default Home
