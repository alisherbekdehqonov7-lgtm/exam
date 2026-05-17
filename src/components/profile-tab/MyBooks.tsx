interface Book {
  title: string;
  author: string;
  status: "Read" | "Reading" | "Favorite";
  emoji: string;
}

const BOOKS: Book[] = [
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    status: "Read",
    emoji: "📗",
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    status: "Favorite",
    emoji: "📘",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    status: "Read",
    emoji: "📙",
  },
  { title: "Dune", author: "Frank Herbert", status: "Reading", emoji: "📕" },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    status: "Read",
    emoji: "📗",
  },
];

const STATUS_COLORS: Record<Book["status"], string> = {
  Read: "bg-green-100 text-green-700",
  Reading: "bg-blue-100  text-blue-700",
  Favorite: "bg-red-100   text-red-600",
};

function MyBooks() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">My Books</h1>
      <p className="text-sm text-gray-400 mb-6">Your personal reading list</p>
      <div className="flex flex-col gap-3">
        {BOOKS.map((book) => (
          <div
            key={book.title}
            className="flex items-center gap-4 border border-gray-100 rounded-xl px-4 py-3 bg-white hover:shadow-sm transition-shadow"
          >
            <span className="text-2xl">{book.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {book.title}
              </p>
              <p className="text-xs text-gray-400">{book.author}</p>
            </div>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[book.status]}`}
            >
              {book.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBooks;
