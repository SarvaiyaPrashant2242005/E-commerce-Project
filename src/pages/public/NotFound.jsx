import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <p className="text-8xl font-extrabold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-fade-up">
      404
    </p>
    <h1 className="text-2xl font-bold text-gray-800 mt-4">Page nahi mila 😅</h1>
    <p className="text-gray-500 mt-2">Jo page tum dhundh rahe ho wo exist nahi karta ya move ho gaya.</p>
    <Link to="/" className="btn-primary mt-8">🏠 Home par jao</Link>
  </div>
);

export default NotFound;
