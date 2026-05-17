interface FavoriteBook {
  title: string;
  author: string;
  emoji: string;
}

const FAVORITES: FavoriteBook[] = [
  { title: "Project Hail Mary", author: "Andy Weir", emoji: "❤️" },
  { title: "The Alchemist", author: "Paulo Coelho", emoji: "❤️" },
  { title: "1984", author: "George Orwell", emoji: "❤️" },
];

function Favorites() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Favorites</h1>
      <p className="text-sm text-gray-400 mb-6">Books you love most</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FAVORITES.map((book) => (
          <div
            key={book.title}
            className="flex gap-4 items-center border border-pink-100 bg-pink-50 rounded-2xl px-4 py-4"
          >
            <span className="text-2xl">{book.emoji}</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {book.title}
              </p>
              <p className="text-xs text-gray-400">{book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;
