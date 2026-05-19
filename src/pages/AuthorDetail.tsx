import { useParams, useNavigate } from "react-router-dom";
import Icon from "../components/ui/icon";
import { useGetAuthorDetail } from "../hooks/api/useGetAuthorDetail";

const AuthorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { author, isPending } = useGetAuthorDetail(id || "");

  if (!id) {
    return <div className="text-center py-20">Author not found</div>;
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20 min-h-screen">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Icon.logo />
          </div>
          <p className="text-[#6B7570]">Loading author details...</p>
        </div>
      </div>
    );
  }

  const bookCount = author.booksCount || 23;
  const followers = author.followersCount || 14200;
  const avgRating = author.avgRating || 4.6;
  const initials = author.fullName
    ? author.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="bg-white min-h-screen text-white    ">
      <div className="bg-[#2F5A3F] ">
        <div className="container">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-sm font-medium hover:opacity-75 transition-opacity"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="container py-12">
        <div className="flex gap-8 mb-12">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-[#B07A48] flex items-center justify-center text-white text-4xl font-bold">
              {initials}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-serif font-bold text-[#1F2F28] mb-2">
              {author.fullName}
            </h1>
            {author.birthPlace || author.birthDate ? (
              <p className="text-[#6B7570] text-sm mb-4">
                {author.birthPlace ? (
                  <>
                    📍 {author.birthPlace}
                    {author.birthDate && ` - Born ${author.birthDate}`}
                  </>
                ) : (
                  `Born ${author.birthDate}`
                )}
              </p>
            ) : null}

            {author.biography && (
              <p className="text-[#6B7570] text-sm leading-relaxed max-w-2xl mb-6">
                {author.biography}
              </p>
            )}

            <div className="flex gap-8 mb-6">
              <div>
                <p className="text-2xl font-bold text-[#1F2F28]">{bookCount}</p>
                <p className="text-[#6B7570] text-sm">Books</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1F2F28]">
                  {typeof followers === "number"
                    ? followers.toLocaleString()
                    : followers}
                </p>
                <p className="text-[#6B7570] text-sm">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1F2F28]">{avgRating}</p>
                <p className="text-[#6B7570] text-sm">Avg Rating</p>
              </div>
            </div>

            <button
              type="button"
              className="px-6 py-2 bg-[#2F5A3F] text-white font-medium rounded-lg hover:bg-[#1E3F2A] transition-colors"
            >
              + Follow
            </button>
          </div>
        </div>

        <div className="border-t border-[#E8DFD0] pt-12">
          <h2 className="text-2xl font-serif font-bold text-[#1F2F28] mb-8">
            Books by {author.fullName?.split(" ")[0]}
          </h2>

          {author.books && author.books.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {author.books.map((book) => (
                <div key={book.id} className="flex flex-col">
                  <div className="relative aspect-3/4 rounded-xl bg-linear-to-br from-[#2F5A3F] to-[#1E3F2A] mb-4 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-white p-4 text-center">
                      <p className="font-serif font-semibold text-sm">
                        {book.title}
                      </p>
                    </div>
                  </div>
                  <h3 className="font-semibold text-[#1F2F28] text-sm truncate">
                    {book.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-2">
                    <Icon.star />
                    <span className="text-xs text-[#6B7570]">
                      {book.rating}
                    </span>
                  </div>
                  <p className="font-bold text-[#1F2F28] text-sm mt-1">
                    ${book.price}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#6B7570] text-center py-12">
              No books available yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorDetail;
