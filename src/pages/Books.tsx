import { useMemo, useState } from "react";
import Icon from "../components/ui/icon";
import { useGetBooks } from "../hooks/api/useGetBooks";
import { useFavorites } from "../hooks/useFavorites";

const mockBooks = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    rating: 4.8,
    price: 14.99,
    favorite: false,
    image: "https://via.placeholder.com/200x300?text=Midnight+Library",
  },
  {
    id: "2",
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    rating: 4.3,
    price: 16.5,
    favorite: false,
    image: "https://via.placeholder.com/200x300?text=Klara",
  },
  {
    id: "3",
    title: "Project Hail Mary",
    author: "Andy Weir",
    rating: 4.9,
    price: 19.99,
    favorite: true,
    image: "https://via.placeholder.com/200x300?text=Project+Hail",
  },
  {
    id: "4",
    title: "The Invisible Life of Addie LaRue",
    author: "V.E. Schwab",
    rating: 4.5,
    price: 13.99,
    favorite: false,
    image: "https://via.placeholder.com/200x300?text=Addie+LaRue",
  },
];

const BooksPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([5, 50]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "price_asc" | "price_desc" | "rating" | "popularity"
  >("newest");
  const { toggleFavorite, isFavorite } = useFavorites();

  const {
    books: apiBooks,
    total,
    isPending,
    isError,
  } = useGetBooks({
    page: currentPage,
    limit: 18,
    genre: selectedGenre || undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    minRating: minRating === 0 ? undefined : minRating,
    sortBy,
    search: searchTerm || undefined,
  });

  const books =
    Array.isArray(apiBooks) && apiBooks.length > 0 ? apiBooks : mockBooks;
  const totalPages = Math.ceil((total || mockBooks.length) / 18);

  const genres = [
    { id: "fiction", name: "Fiction", count: 2340 },
    { id: "non-fiction", name: "Non-fiction", count: 2100 },
    { id: "sci-fi", name: "Sci-Fi", count: 1456 },
    { id: "romance", name: "Romance", count: 1890 },
    { id: "mystery", name: "Mystery", count: 1234 },
    { id: "fantasy", name: "Fantasy", count: 1678 },
  ];

  const ratings = [5, 4, 3, 2, 1];

  const languages = [
    { id: "english", name: "English", count: 8234 },
    { id: "spanish", name: "Spanish", count: 1456 },
    { id: "french", name: "French", count: 880 },
    { id: "uzbek", name: "Uzbek", count: 234 },
  ];

  const handlePriceChange = (index: number, value: number) => {
    const newRange = [...priceRange];
    newRange[index] = value;
    if (index === 0 && value <= newRange[1]) {
      setPriceRange([value, newRange[1]]);
    } else if (index === 1 && value >= newRange[0]) {
      setPriceRange([newRange[0], value]);
    }
  };

  const clearFilters = () => {
    setSelectedGenre(null);
    setPriceRange([5, 50]);
    setMinRating(0);
    setSearchTerm("");
  };

  const displayedBooks = useMemo(() => {
    if (!Array.isArray(books)) return [];
    return books.map((book: any) => ({
      ...book,
      isFavorite: isFavorite(book.id),
    }));
  }, [books, isFavorite]);

  return (
    <div className="bg-white">
      <div className="container py-8">
        <div className="mb-8">
          <label className="bg-[#FBF7F0] p-[12px_20px] rounded-[40px] flex items-center gap-3 w-full shadow-md">
            <Icon.searchIcon />
            <input
              type="text"
              className="w-full text-base text-[#1F2F28] placeholder:text-[#7A7A7A] bg-transparent focus:outline-0"
              placeholder="Search books, authors, genres..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </label>
        </div>

        <div className="flex gap-8">
          <div className="w-48">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#1F2F28]">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-xs text-[#7A7A7A] hover:text-[#1F2F28] font-medium transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="mb-8">
              <h4 className="text-sm font-semibold text-[#1F2F28] mb-4 uppercase tracking-wide">
                Genre
              </h4>
              <div className="space-y-3">
                {genres.map((genre) => (
                  <label
                    key={genre.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGenre === genre.id}
                      onChange={(e) => {
                        setSelectedGenre(e.target.checked ? genre.id : null);
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 accent-[#2F5A3F] rounded"
                    />
                    <span className="text-sm text-[#1F2F28]">{genre.name}</span>
                    <span className="text-xs text-[#9AA89F] ml-auto">
                      {genre.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-sm font-semibold text-[#1F2F28] mb-4 uppercase tracking-wide">
                Price Range
              </h4>
              <div className="flex gap-2 items-center mb-4">
                <span className="text-sm font-medium text-[#1F2F28]">
                  ${priceRange[0]}
                </span>
                <span className="text-xs text-[#9AA89F]">-</span>
                <span className="text-sm font-medium text-[#1F2F28]">
                  ${priceRange[1]}
                </span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                  className="w-full accent-[#2F5A3F]"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                  className="w-full accent-[#2F5A3F]"
                />
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-sm font-semibold text-[#1F2F28] mb-4 uppercase tracking-wide">
                Rating
              </h4>
              <div className="space-y-3">
                {ratings.map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === rating}
                      onChange={() => {
                        setMinRating(rating);
                        setCurrentPage(1);
                      }}
                      className="w-4 h-4 accent-[#2F5A3F]"
                    />
                    <div className="flex items-center gap-1">
                      {[...Array(rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">
                          ★
                        </span>
                      ))}
                      {[...Array(5 - rating)].map((_, i) => (
                        <span key={i} className="text-gray-300">
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-[#9AA89F] ml-auto">
                      {rating === 5 ? "5 stars" : `${rating}+ stars`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-sm font-semibold text-[#1F2F28] mb-4 uppercase tracking-wide">
                Language
              </h4>
              <div className="space-y-3">
                {languages.map((lang) => (
                  <label
                    key={lang.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#2F5A3F] rounded"
                    />
                    <span className="text-sm text-[#1F2F28]">{lang.name}</span>
                    <span className="text-xs text-[#9AA89F] ml-auto">
                      {lang.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <p className="text-sm text-[#6B7570]">
                Showing 1-18 of {total || mockBooks.length} books
              </p>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 border border-[#D8C9B8] rounded-lg text-sm font-medium text-[#1F2F28] focus:outline-none focus:ring-2 focus:ring-[#2F5A3F]"
                >
                  <option value="newest">Sort by Newest</option>
                  <option value="oldest">Sort by Oldest</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="price_asc">Sort by Price (Low to High)</option>
                  <option value="price_desc">
                    Sort by Price (High to Low)
                  </option>
                  <option value="popularity">Sort by Popularity</option>
                </select>
                <div className="flex gap-2">
                  <button className="p-2 border border-[#D8C9B8] rounded-lg hover:bg-[#FBF7F0]">
                    <Icon.grid />
                  </button>
                  <button className="p-2 border border-[#D8C9B8] rounded-lg hover:bg-[#FBF7F0]">
                    <Icon.list />
                  </button>
                </div>
              </div>
            </div>

            {isPending && !books.length ? (
              <div className="grid grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-[#FBF7F0] rounded-2xl aspect-3/4"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="col-span-4 text-center py-12">
                <p className="text-red-500 text-lg">Error loading books</p>
              </div>
            ) : displayedBooks.length === 0 ? (
              <div className="col-span-4 text-center py-12">
                <p className="text-[#6B7570] text-lg">No books found</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-6 mb-8">
                {displayedBooks.map((book: any) => (
                  <div key={book.id} className="flex flex-col">
                    <div className="relative aspect-3/4 rounded-2xl bg-linear-to-br from-[#2F5A3F] to-[#1E3F2A] p-5 flex flex-col items-center justify-center text-center overflow-hidden group mb-4">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />

                      <button
                        onClick={() => toggleFavorite(book.id)}
                        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                      >
                        {book.isFavorite ? (
                          <span className="text-lg text-red-500">❤</span>
                        ) : (
                          <span className="text-lg">♡</span>
                        )}
                      </button>

                      <div className="relative z-10 text-white">
                        <h3 className="text-lg font-bold mb-1">{book.title}</h3>
                        <p className="text-xs opacity-90">{book.author}</p>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-[#1F2F28] line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-[#6B7570] text-xs mt-0.5">
                      {book.author}
                    </p>

                    <div className="flex items-center gap-1 mt-2 mb-3">
                      <span className="text-xs font-medium text-[#1F2F28]">
                        {book.rating}
                      </span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${
                              i < Math.round(book.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm font-bold text-[#1F2F28]">
                      ${book.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-[#D8C9B8] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FBF7F0]"
              >
                &lt;
              </button>

              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-[#2F5A3F] text-white"
                        : "border border-[#D8C9B8] text-[#1F2F28] hover:bg-[#FBF7F0]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && (
                <>
                  <span className="text-[#9AA89F]">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-8 h-8 rounded-lg border border-[#D8C9B8] flex items-center justify-center text-sm font-medium hover:bg-[#FBF7F0]"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-[#D8C9B8] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FBF7F0]"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
