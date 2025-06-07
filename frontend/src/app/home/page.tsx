/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
    useState,
    useEffect,
    useRef,
    type ChangeEvent,
    type FormEvent,
    type JSX,
  } from "react";
  import {
    BookmarkPlus,
    BookmarkCheck,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
  Circle,
    Tv,
    Menu,
    Edit3,
    Trash2,
    X,
    Play,
    Star as StarIcon,
    PlayCircle,
  } from "lucide-react";
  import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { Label } from "@/components/ui/label";
  import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  } from "@/components/ui/select";
  import { Link } from "react-router-dom";
  import toast from 'react-hot-toast'
import WatchNowDialog from "@/components/watch-now-dialog";
import MobileView from "@/components/mobile-view";
  interface FullMovie {
    imdbID: string;
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    BoxOffice: string;
  }
  
  
  interface WatchlistMovie extends FullMovie {
    id: string;
    watched: boolean;
    note: string;
    rating: number;
  }
  
  export default function Home(): JSX.Element {

    const [allMovies, setAllMovies] = useState<FullMovie[]>([]);
    const [groupedMovies, setGroupedMovies] = useState<
      Record<string, FullMovie[]>
    >({});
    const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([]);
  
  
    const [view, setView] = useState<"movies" | "watchlist">("movies");
    const [activeGenre, setActiveGenre] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
   
    const [selectedMovie, setSelectedMovie] = useState<FullMovie | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  
  
    const loggedIn = !!localStorage.getItem("access_token");
    const token = localStorage.getItem("access_token") || "";
    const userEmail = localStorage.getItem("user_email") || "";
    const userId = localStorage.getItem("user_id") || "";
  
    
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");
  
    
    const API_KEY = "1a53b243";
    const INITIAL_TITLES = [
      "Guardians of the Galaxy Vol. 2",
      "The Shawshank Redemption",
      "The Godfather",
      "The Dark Knight",
      "Inception",
      "Interstellar",
      "Pulp Fiction",
      "Fight Club",
      "The Matrix",
      "Forrest Gump",
    ];
  
  
    const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
    
    useEffect(() => {
      (async () => {
        setIsLoading(true);
        try {
          const responses = await Promise.all(
            INITIAL_TITLES.map((title) =>
              fetch(
                `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(
                  title
                )}&plot=full`
              ).then((r) => r.json())
            )
          );
          const valid: FullMovie[] = responses
            .filter((d: any) => d.Response === "True")
            .map((d: any) => ({
              imdbID: d.imdbID,
              Title: d.Title,
              Year: d.Year,
              Rated: d.Rated,
              Released: d.Released,
              Runtime: d.Runtime,
              Genre: d.Genre,
              Director: d.Director,
              Writer: d.Writer,
              Actors: d.Actors,
              Plot: d.Plot,
              Language: d.Language,
              Country: d.Country,
              Awards: d.Awards,
              Poster: d.Poster !== "N/A" ? d.Poster : "/placeholder.jpg",
              Metascore: d.Metascore,
              imdbRating: d.imdbRating,
              imdbVotes: d.imdbVotes,
              BoxOffice: d.BoxOffice,
            }));
          setAllMovies(valid);
  
          const grouping: Record<string, FullMovie[]> = {};
          valid.forEach((m) =>
            m.Genre.split(", ").forEach((g) => {
              if (!grouping[g]) grouping[g] = [];
              grouping[g].push(m);
            })
          );
          setGroupedMovies(grouping);
        } catch {
          setErrorMessage("Failed to load movies.");
        } finally {
          setIsLoading(false);
        }
      })();
    }, []);
  

useEffect(() => {
    if (!loggedIn) {
      setWatchlist([]);
      return;
    }
    (async () => {
      try {
       
        const res = await fetch("http://localhost:5000/api/watchlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Could not load watchlist");
        const rows: {
          id: string;
          imdb_id: string;
          title: string;
          year: string;
          poster: string;
          watched: boolean;
          note: string;
          rating: number;
        }[] = await res.json();
  
        
        const movies = await Promise.all(
          rows.map(async (r) => {
            const omdbRes = await fetch(
              `https://www.omdbapi.com/?apikey=${API_KEY}&i=${r.imdb_id}&plot=full`
            );
            const omdb = await omdbRes.json();
            if (omdb.Response !== "True") {
              console.warn("OMDb failed for", r.imdb_id, omdb.Error);
              return null;
            }
          
            const full: WatchlistMovie = {
              id:        r.id,
              imdbID:    r.imdb_id,
              Title:     omdb.Title,
              Year:      omdb.Year,
              Rated:     omdb.Rated,
              Released:  omdb.Released,
              Runtime:   omdb.Runtime,
              Genre:     omdb.Genre,
              Director:  omdb.Director,
              Writer:    omdb.Writer,
              Actors:    omdb.Actors,
              Plot:      omdb.Plot,
              Language:  omdb.Language,
              Country:   omdb.Country,
              Awards:    omdb.Awards,
              Poster:    omdb.Poster !== "N/A" ? omdb.Poster : r.poster,
              Metascore: omdb.Metascore,
              imdbRating:omdb.imdbRating,
              imdbVotes: omdb.imdbVotes,
              BoxOffice: omdb.BoxOffice,
              watched:   r.watched,
              note:      r.note,
              rating:    r.rating,
            };
            return full;
          })
        );
  
     
        setWatchlist(movies.filter((m): m is WatchlistMovie => !!m));
      } catch (err) {
        console.error("Failed fetching watchlist + OMDb:", err);
      }
    })();
  }, [loggedIn, token]);
  
  
   
const addToWatchlist = async (movie: FullMovie) => {
    if (!loggedIn) {
      return alert("Please log in first");
    }
  
   
    const payload = {
      imdb_id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
    };
  
    const res = await fetch("http://localhost:5000/api/watchlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      
    });
    toast.success('Added to your watchlist')
    if (!res.ok) {
      console.error("Add failed");
      toast.error('Could not add to watchlist')
      return;
    }
    const row: {
      id: string;
      imdb_id: string;
      watched: boolean;
      note: string;
      rating: number;
    } = await res.json();
  
    
    const omdbRes = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&i=${row.imdb_id}&plot=full`
    );
    const omdb = await omdbRes.json();
    if (omdb.Response !== "True") {
      console.warn("OMDb enrichment failed for", row.imdb_id, omdb.Error);
      return;
    }
  
    
    const full: WatchlistMovie = {
      id:         row.id,
      imdbID:     row.imdb_id,
      Title:      omdb.Title,
      Year:       omdb.Year,
      Rated:      omdb.Rated,
      Released:   omdb.Released,
      Runtime:    omdb.Runtime,
      Genre:      omdb.Genre,
      Director:   omdb.Director,
      Writer:     omdb.Writer,
      Actors:     omdb.Actors,
      Plot:       omdb.Plot,
      Language:   omdb.Language,
      Country:    omdb.Country,
      Awards:     omdb.Awards,
      Poster:
        omdb.Poster && omdb.Poster !== "N/A"
          ? omdb.Poster
          : movie.Poster,
      Metascore:  omdb.Metascore,
      imdbRating: omdb.imdbRating,
      imdbVotes:  omdb.imdbVotes,
      BoxOffice:  omdb.BoxOffice,
      watched:    row.watched,
      note:       row.note,
      rating:     row.rating,
    };
  
    
    setWatchlist(wl => [full, ...wl]);
  };
  
  
    const toggleWatched = async (id: string) => {
        if (view !== "watchlist") {
            toast.error("Please switch to the Watchlist tab to mark as watched✓/unwatched○");
            return;
          }
        const entry = watchlist.find(m => m.id === id);
        if (!entry) return;
      
        try {
          const res = await fetch(`http://localhost:5000/api/watchlist/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ watched: !entry.watched }),
          });
          if (!res.ok) throw new Error("Toggle failed");
          const row = await res.json();  
      
          setWatchlist(wl =>
            wl.map(m => {
              if (m.id !== id) return m;
              return {
                ...m,                  
                watched: row?.watched,  
              };
            })
          );
            toast.success(`Marked as ${row.watched ? "watched" : "unwatched"}`);
        } catch {
          console.error("Toggle watched error");
            toast.error("Failed to toggle watched status");
        }
      };
  
const updateNoteRating = async (
    id: string,
    note: string,
    rating: number
  ) => {
    if (view !== "watchlist") {
        toast.error("Please switch to the Watchlist tab to mark as watched✓/unwatched○");
        return;
      }
    try {
      const res = await fetch(`http://localhost:5000/api/watchlist/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ note, rating }),
      });
      if (!res.ok) throw new Error("Update note/rating failed");
      const row = await res.json();  
  
      setWatchlist(wl =>
        wl.map(m => {
          if (m.id !== id) return m;
          return {
            ...m,                
            watched: row?.watched, 
            note:    row?.note,
            rating:  row?.rating,
          };
        })
      );
        toast.success("Note/Rating updated");
    } catch {
      console.error("Note/rating error");
        toast.error("Failed to update note/rating");
    }
  };
  
    
    const removeFromWatchlist = async (id: string) => {
        if (view !== "watchlist") {
            toast.error("Please switch to the Watchlist tab to mark as watched✓/unwatched○");
            return;
          }
      try {
        const res = await fetch(`http://localhost:5000/api/watchlist/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Delete failed");
        setWatchlist((wl) => wl.filter((m) => m.id !== id));
        toast.success("Removed from watchlist");
      } catch {
        console.error("Remove error");
        toast.error("Failed to remove from watchlist");
      }
    };
  
   
    const matchesSearch = (m: FullMovie | WatchlistMovie) =>
      m.Title.toLowerCase().includes(searchTerm.toLowerCase());
    const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) =>
      setSearchTerm(e.target.value);
    const scrollRow = (g: string, dir: "left" | "right") => {
      const c = rowRefs.current[g];
      if (!c) return;
      c.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    };
  
    const genreList = Object.keys(groupedMovies).sort();
    const genreColors = [
      "bg-indigo-700",
      "bg-green-700",
      "bg-red-700",
      "bg-yellow-700",
      "bg-purple-700",
      "bg-blue-700",
      "bg-pink-700",
      "bg-teal-700",
    ];
  
    
    const handleWatchNow = (movie: FullMovie) => {
      setSelectedMovie(movie);
      setDialogOpen(true);
    };
  
   
    const MovieCard = (props: {
      movie: FullMovie | WatchlistMovie;
      isWatchlist: boolean;
    }) => {
      const { movie, isWatchlist } = props;
      const isWL = isWatchlist;
      const wl = movie as WatchlistMovie;
      return (
        <div className="bg-gray-800 rounded-lg shadow-lg flex flex-col overflow-hidden">
      {/* Poster & badges */}
      <div className="relative h-60 w-full">
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-full h-full object-cover"
        />
        {isWL && (movie as WatchlistMovie).watched && (
          <div className="absolute top-2 left-2 bg-green-600 text-xs px-1 py-0.5 rounded">
            Watched
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 px-1 py-0.5 rounded flex items-center space-x-1">
          <StarIcon size={12} className="text-yellow-400" />
          <span className="text-xs text-gray-200">{movie.Year}</span>
        </div>
      </div>

      {/* Title & Info */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <h3 className="text-sm font-medium text-white line-clamp-2">
          {movie.Title}
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          {movie.imdbRating !== "N/A" ? `${movie.imdbRating}★` : "N/A"} •{" "}
          {(movie as any).Runtime}
        </p>

       
        <div className="mt-4 flex justify-between items-center">
         
          <div className="flex items-center space-x-2">
          {isWL ? (
              view === "watchlist" ? (
                <>
                  {/* Toggle watched */}
                  <button
                    onClick={() => toggleWatched(wl.id)}
                    title={wl.watched ? "Mark as unwatched" : "Mark as watched"}
                    className="p-2 bg-gray-700 rounded hover:bg-gray-600"
                  >
                    {wl.watched ? (
                      <CheckCircle size={18} className="text-green-400" />
                    ) : (
                      <Circle size={18} className="text-gray-400" />
                    )}
                  </button>

                  {/* Note/Rating */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        title="Add or edit note & rating"
                        className="p-2 bg-gray-700 rounded hover:bg-gray-600"
                      >
                        <Edit3 size={18} className="text-indigo-400" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg bg-gray-800 text-white">
                      <NoteRatingDialog
                        entry={wl}
                        onSave={(n, r) => updateNoteRating(wl.id, n, r)}
                      />
                    </DialogContent>
                  </Dialog>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromWatchlist(wl.id)}
                    title="Remove from watchlist"
                    className="p-2 bg-gray-700 rounded hover:bg-gray-600"
                  >
                    <Trash2 size={18} className="text-red-400" />
                  </button>
                </>
              ) : (
               
                <div className="px-2 py-1 bg-blue-600 text-xs text-white rounded">
                  ✓ Added
                </div>
              )
            ) : (
             
              <button
                onClick={() => addToWatchlist(movie as FullMovie)}
                title="Add to watchlist"
                className="p-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                <BookmarkPlus size={18} className="text-indigo-400" />
              </button>
            )}
          </div>

          {/* Right: Watch now */}
          <Button
            size="sm"
            title="Watch now"
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-1"
            onClick={() => handleWatchNow(movie as FullMovie)}
          >
            <Play size={16} />
            <span>Watch</span>
          </Button>
        </div>
      </div>
    </div>
      );
    };
  
  
    function NoteRatingDialog({
      entry,
      onSave,
    }: {
      entry: WatchlistMovie;
      onSave: (note: string, rating: number) => void;
    }) {
        const [note, setNote] = useState(entry.note ?? "");
      const [rating, setRating] = useState(() => {
           return entry.rating != null ? String(entry.rating) : "";
          });
      return (
        <DialogContent className="sm:max-w-lg bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-lg">{entry.Title}</DialogTitle>
            <DialogDescription>Add a short note and rating (1–10).</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor={`note-${entry.id}`} className="text-gray-200">
                Note
              </Label>
              <Textarea
                id={`note-${entry.id}`}
                placeholder="Write your thoughts..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-gray-700 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor={`rating-${entry.id}`} className="text-gray-200">
                Rating
              </Label>
              <Select
                value={rating}
                onValueChange={(val: string) => setRating(val)}
              >
                <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white">
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i + 1} value={`${i + 1}`} className="text-white">
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                onSave(note, parseInt(rating, 10));
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      );
    }
  
    return (
      <div className="bg-gray-900 text-white min-h-screen">
        {/* — Navbar — */}
        <nav className="flex items-center justify-between px-4 py-3 border-b border-gray-800 lg:px-6">
          <div className="flex items-center space-x-3">
            <Tv size={28} className="text-indigo-400 flex-shrink-0" />
            <div className="hidden md:flex items-center space-x-2">
              <button
                className={`px-3 py-1 rounded ${
                  activeGenre === null && view === "movies"
                    ? "bg-indigo-500"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
                onClick={() => {
                  setActiveGenre(null);
                  setView("movies");
                }}
              >
                All
              </button>
              {genreList.map((g) => (
                <button
                  key={g}
                  className={`px-3 py-1 rounded ${
                    activeGenre === g && view === "movies"
                      ? "bg-indigo-500"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    setActiveGenre(g);
                    setView("movies");
                  }}
                >
                  {g}
                </button>
              ))}
              <button
                className={`px-3 py-1 rounded ${
                  view === "watchlist"
                    ? "bg-indigo-500"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
                onClick={() => {
                  setView("watchlist");
                  setActiveGenre(null);
                }}
              >
                Watchlist
              </button>
            </div>
            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen((p) => !p)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden md:inline">
              <button className="text-gray-300 hover:text-white mr-4">
                Browse
              </button>
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={onChangeSearch}
              className="px-3 py-1 rounded bg-gray-800 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="hidden md:flex items-center space-x-4">
              {loggedIn ? (
                <>
                  <span className="text-gray-200">Hello, {userEmail}</span>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = "/";
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:underline">
                    Login
                  </Link>
                  <Link to="/register" className="hover:underline">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
  
        {/* — Mobile Menu — */}
        {mobileMenuOpen && (
          <MobileView 
          activeGenre={activeGenre}
          setActiveGenre={setActiveGenre}
          genreList={genreList}
          view={view}
            setView={setView}
            setMobileMenuOpen={setMobileMenuOpen}
            loggedIn={loggedIn}
            
            />
        )}
  
        {/* — Main Content — */}
        <main className="w-full mx-auto py-8 space-y-12 px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <p className="text-center text-gray-400">Loading movies…</p>
          ) : errorMessage ? (
            <p className="text-center text-red-500">{errorMessage}</p>
          ) : (
            <>
              {/* Latest Movies (only when “All” view) */}
              {view === "movies" && activeGenre === null && (
                <section className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-1 h-6 bg-indigo-500 mr-2" />
                    <h2 className="text-2xl font-semibold text-white">
                      Latest Movies
                    </h2>
                  </div>
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {allMovies.map((m) => (
                      <MovieCard
                        key={m.imdbID}
                        movie={m}
                        isWatchlist={!!watchlist.find((w) => w.imdbID === m.imdbID)}
                      />
                    ))}
                  </div>
                </section>
              )}
  
              {/* Genre Sections */}
              {view === "movies" &&
                (activeGenre
                  ? [activeGenre]
                  : genreList
                ).map((genre, idx) => {
                  const list = groupedMovies[genre].filter(matchesSearch);
                  if (!list.length) return null;
                  return (
                    <section key={genre} className="space-y-4">
                      <h2
                        className={`text-2xl font-semibold px-3 py-2 rounded ${
                          genreColors[idx % genreColors.length]
                        }`}
                      >
                        {genre}
                      </h2>
  
                      {/* small-screen carousel */}
                      <div className="relative md:hidden">
                        <button
                          onClick={() => scrollRow(genre, "left")}
                          className="absolute left-0 top-1/2 -translate-y-1/2 p-1 bg-gray-800 bg-opacity-60 rounded-full hover:bg-opacity-80 z-10"
                        >
                          <ChevronLeft size={24} className="text-white" />
                        </button>
                        <div
                          ref={(el) => (rowRefs.current[genre] = el)}
                          className="flex space-x-4 overflow-x-auto hide-scrollbar py-2 px-8"
                        >
                          {list.map((m) => (
                            <div key={m.imdbID} className="flex-shrink-0 w-48">
                              <MovieCard
                                movie={m}
                                isWatchlist={!!watchlist.find((w) => w.imdbID === m.imdbID)}
                              />
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => scrollRow(genre, "right")}
                          className="absolute right-0 top-1/2 -translate-y-1/2 p-1 bg-gray-800 bg-opacity-60 rounded-full hover:bg-opacity-80 z-10"
                        >
                          <ChevronRight size={24} className="text-white" />
                        </button>
                      </div>
  
                      {/* md+ grid */}
                      <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {list.map((m) => (
                          <MovieCard
                            key={m.imdbID}
                            movie={m}
                            isWatchlist={!!watchlist.find((w) => w.imdbID === m.imdbID)}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
  
              {/* Watchlist View */}
              {view === "watchlist" && (
                <section className="pt-4 space-y-6">
                  {!loggedIn ? (
                    <p className="text-center text-gray-400">
                      Please{" "}
                      <Link to="/login" className="underline hover:text-white">
                        log in
                      </Link>{" "}
                      to view your watchlist.
                    </p>
                  ) : watchlist.filter(matchesSearch).length === 0 ? (
                    <p className="text-center text-gray-400">
                      Your watchlist is empty.
                    </p>
                  ) : (
                    <>
                      {/* xs carousel */}
                      <div className="relative md:hidden">
                        <button
                          onClick={() => scrollRow("watchlist", "left")}
                          className="absolute left-0 top-1/2 -translate-y-1/2 p-1 bg-gray-800 bg-opacity-60 rounded-full hover:bg-opacity-80 z-10"
                        >
                          <ChevronLeft size={24} className="text-white" />
                        </button>
                        <div className="flex overflow-x-auto hide-scrollbar space-x-4 py-2 px-8">
                          {watchlist.filter(matchesSearch).map((m) => (
                            <div key={m.id} className="flex-shrink-0 w-48">
                              <MovieCard movie={m} isWatchlist />
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => scrollRow("watchlist", "right")}
                          className="absolute right-0 top-1/2 -translate-y-1/2 p-1 bg-gray-800 bg-opacity-60 rounded-full hover:bg-opacity-80 z-10"
                        >
                          <ChevronRight size={24} className="text-white" />
                        </button>
                      </div>
                      {/* md+ grid */}
                      <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {watchlist.filter(matchesSearch).map((m) => (
                          <MovieCard key={m.id} movie={m} isWatchlist />
                        ))}
                      </div>
                    </>
                  )}
                </section>
              )}
            </>
          )}
        </main>
  
        {/* — Watch Now Dialog */}
        <WatchNowDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} selectedMovie={selectedMovie} />
      </div>
    );
  }
  