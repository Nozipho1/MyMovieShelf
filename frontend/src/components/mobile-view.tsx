
import React from 'react'
import { Link } from 'react-router-dom';

function MobileView({
    activeGenre,
    setActiveGenre,
    genreList,
    view,
    setView,
    setMobileMenuOpen,
    loggedIn,
    
}:{
    activeGenre: string | null;
    setActiveGenre: (genre: string | null) => void;
    genreList: string[];
    view: "movies" | "watchlist";
    setView: (view: "movies" | "watchlist") => void;
    setMobileMenuOpen: (open: boolean) => void;
    
    loggedIn: boolean;

}) {
  return (
    <div className="md:hidden bg-gray-800 border-b border-gray-700">
                <div className="flex flex-col space-y-1 px-4 py-3">
                  <button
                    className={`text-left px-3 py-1 rounded ${
                      activeGenre === null && view === "movies"
                        ? "bg-indigo-500"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    onClick={() => {
                      setActiveGenre(null);
                      setView("movies");
                      setMobileMenuOpen(false);
                    }}
                  >
                    All
                  </button>
                  {genreList.map((g) => (
                    <button
                      key={g}
                      className={`text-left px-3 py-1 rounded ${
                        activeGenre === g && view === "movies"
                          ? "bg-indigo-500"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      onClick={() => {
                        setActiveGenre(g);
                        setView("movies");
                        setMobileMenuOpen(false);
                      }}
                    >
                      {g}
                    </button>
                  ))}
                  <button
                    className={`text-left px-3 py-1 rounded ${
                      view === "watchlist"
                        ? "bg-indigo-500"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    onClick={() => {
                      setView("watchlist");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Watchlist
                  </button>
                  <div className="border-t border-gray-600 mt-2 pt-2 space-y-1">
                    <button className="w-full text-left px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">
                      Browse
                    </button>
                    {loggedIn ? (
                      <button
                        onClick={() => {
                          localStorage.clear();
                          window.location.href = "/";
                        }}
                        className="w-full text-left px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
                      >
                        Logout
                      </button>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          className="block px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
  )
}

export default MobileView
