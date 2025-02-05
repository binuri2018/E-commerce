import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page"> 
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Our Clothing Store</h1>
        <p className="text-gray-600 mb-6">Discover the latest trends and shop with ease.</p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default WelcomePage;
