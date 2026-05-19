import { useNavigate } from "react-router-dom";
import Icon from "../ui/icon";
import { useGetBooks } from "../../hooks/api/useGetBooks";
import { useFavorites } from "../../hooks/useFavorites";
import { newArrivals } from "../../mock/books";

const Favorites = () => {
  const navigate = useNavigate();
  const { books, isPending } = useGetBooks();
  const { filterFavorites, toggleFavorite } = useFavorites();

  const allBooks =
    Array.isArray(books) && books.length > 0 ? books : newArrivals;
  const favoriteBooks = filterFavorites(allBooks);

  return (
    <div className="bg-white min-h-screen">
      <div className="container py-12">
        <h1 className="text-4xl font-serif font-semibold text-[#1F2F28] mb-2">
          My Favorites
        </h1>
        <p className="text-[#6B7570] mb-12">
          You have {favoriteBooks.length} book
          {favoriteBooks.length !== 1 ? "s" : ""} in your favorites collection
        </p>

        {isPending ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block">
                <div className="animate-spin">
                  <Icon.logo />
                </div>
              </div>
              <p className="text-[#6B7570] mt-4">Loading your favorites...</p>
            </div>
          </div>
        ) : favoriteBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {favoriteBooks.map((book: any) => (
              <div key={book.id} className="flex flex-col">
                <div
                  className={`relative aspect-3/4 rounded-2xl bg-linear-to-br ${
                    book.gradient || "from-[#2F5A3F] to-[#1E3F2A]"
                  } p-5 flex flex-col items-center justify-center text-center overflow-hidden`}
                  style={{
                    backgroundImage: book.image
                      ? `url(${book.image})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <button
                    type="button"
                    aria-label="Remove from favorites"
                    onClick={() => toggleFavorite(String(book.id))}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <Icon.heartFilled />
                  </button>

                  {!book.image && (
                    <>
                      <h3 className="text-white font-serif text-lg leading-tight font-semibold mb-2">
                        {book.title}
                      </h3>
                      <p className="text-white/70 text-[10px] tracking-[0.2em] uppercase">
                        {book.author}
                      </p>
                    </>
                  )}
                </div>

                <div className="mt-4 px-1">
                  <h4 className="text-[#1F2F28] text-sm font-semibold truncate">
                    {book.title}
                  </h4>
                  <p className="text-[#6B7570] text-xs mt-0.5">{book.author}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <Icon.star />
                      <span className="text-[#6B7570] text-xs">
                        {book.rating?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                    <span className="text-[#1F2F28] text-sm font-semibold">
                      ${book.price?.toFixed(2) || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M40 8C22.4 8 8 22.4 8 40C8 57.6 22.4 72 40 72C57.6 72 72 57.6 72 40C72 22.4 57.6 8 40 8Z"
                  fill="#E8DFD0"
                />
                <path
                  d="M40 22L46 32H57L49 38L52 48L40 42L28 48L31 38L23 32H34L40 22Z"
                  fill="#1F2F28"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-serif font-semibold text-[#1F2F28] mb-2">
              Your favorites shelf is empty
            </h2>
            <p className="text-[#6B7570] text-center max-w-md mb-8">
              Start exploring and add books you love to your favorites
              collection.
            </p>
            <button
              type="button"
              onClick={() => navigate("/books")}
              className="px-8 py-3 bg-[#2F5A3F] text-white font-medium rounded-lg hover:bg-[#1E3F2A] transition-colors"
            >
              Browse Books
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
