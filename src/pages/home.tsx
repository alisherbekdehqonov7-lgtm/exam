import Icon from "../components/ui/icon";
import { genres, newArrivals, popularAuthors } from "../mock/books";

const Home = () => {
  return (
    <>
      <section className="pt-6 mt-4 bg-gradient-to-br from-[#2B4A3A] via-[#1F3A2C] to-[#0F2419]">
        <div className="container">
          <div className="relative overflow-hidden pr-8 py-16 rounded-3xl min-h-85">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col items-start">
                <span className="inline-flex items-center gap-1.5 bg-[#1F2F28]/60 text-[#FBF7F0] text-xs font-medium tracking-wider uppercase rounded-full px-3 py-1.5 mb-6">
                  <Icon.star />
                  Book of the Week
                </span>
                <h1 className="text-white text-4xl md:text-5xl leading-tight font-serif font-semibold mb-3">
                  One Hundred Years <br /> of Solitude
                </h1>
                <p className="text-[#B8C5BD] text-sm mb-4">
                  by Gabriel García Márquez
                </p>
                <p className="text-[#9AA89F] text-sm leading-relaxed max-w-md mb-7">
                  The brilliant, bestselling, landmark novel that tells the
                  story of the Buendía family, and chronicles the irreconcilable
                  conflict between the desire for solitude and the need for
                  love.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="bg-[#E89B3C] hover:bg-[#d68a2c] transition-colors text-[#1F2F28] font-medium text-sm px-5 py-3 rounded-xl cursor-pointer"
                  >
                    Buy Now — $18.99
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-[#FBF7F0] font-medium text-sm px-5 py-3 rounded-xl cursor-pointer"
                  >
                    <Icon.heart />
                    Add to Favorites
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="relative w-[220px] h-[300px] rounded-xl bg-gradient-to-br from-[#C89968] to-[#9C7548] shadow-2xl flex items-center justify-center">
                  <div className="absolute inset-0 rounded-xl border border-[#B88858]/40"></div>
                  <div className="text-center px-4">
                    <h3 className="text-[#FBF7F0] font-serif text-xl leading-tight font-semibold mb-3">
                      One Hundred <br /> Years of <br /> Solitude
                    </h3>
                    <p className="text-[#FBF7F0]/80 text-[10px] tracking-[0.2em] uppercase">
                      García Márquez
                    </p>
                  </div>
                  <span className="absolute -bottom-3 -right-3 bg-[#E89B3C] text-[#1F2F28] text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                    $18.99
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-[#1F2F28] text-3xl md:text-4xl font-serif font-semibold">
              New Arrivals
            </h2>
            <a
              href="#"
              className="flex items-center gap-1.5 text-[#1F2F28] text-sm font-medium hover:opacity-70 transition-opacity"
            >
              View all
              <Icon.arrowRight />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {newArrivals.map((book) => (
              <div key={book.id} className="flex flex-col">
                <div
                  className={`relative aspect-3/4 rounded-2xl bg-linear-to-br ${book.gradient} p-5 flex flex-col items-center justify-center text-center overflow-hidden`}
                >
                  <button
                    type="button"
                    aria-label="Add to favorites"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white transition-colors flex items-center justify-center cursor-pointer"
                  >
                    {book.favorite ? (
                      <Icon.heartFilled />
                    ) : (
                      <Icon.heartOutlineDark />
                    )}
                  </button>
                  <h3 className="text-white font-serif text-lg leading-tight font-semibold mb-2">
                    {book.title}
                  </h3>
                  <p className="text-white/70 text-[10px] tracking-[0.2em] uppercase">
                    {book.author}
                  </p>
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
                        {book.rating}
                      </span>
                    </div>
                    <span className="text-[#1F2F28] text-sm font-semibold">
                      ${book.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-[#1F2F28] text-3xl md:text-4xl font-serif font-semibold">
              Popular Authors
            </h2>
            <a
              href="#"
              className="flex items-center gap-1.5 text-[#1F2F28] text-sm font-medium hover:opacity-70 transition-opacity"
            >
              View all
              <Icon.arrowRight />
            </a>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            {popularAuthors.map((author) => (
              <div key={author.id} className="flex flex-col">
                <div
                  className={`w-24 h-24 rounded-full ${author.color} flex items-center justify-center mb-4 cursor-pointer hover:scale-105 transition-transform`}
                >
                  <span className="text-white font-serif text-2xl font-semibold">
                    {author.initials}
                  </span>
                </div>
                <h4 className="text-[#1F2F28] text-sm font-semibold">
                  {author.name}
                </h4>
                <p className="text-[#9AA89F] text-xs mt-1">
                  {author.books} books
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container">
          <h2 className="text-[#1F2F28] text-3xl md:text-4xl font-serif font-semibold mb-8">
            Browse by Genre
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {genres.map((genre) => (
              <button
                key={genre.id}
                type="button"
                className={`${genre.bg} rounded-2xl px-6 py-8 flex flex-col items-center justify-center text-center cursor-pointer hover:scale-[1.02] transition-transform`}
              >
                <span className="text-4xl mb-3">{genre.icon}</span>
                <h4 className="text-[#1F2F28] text-base font-semibold mb-1">
                  {genre.name}
                </h4>
                <p className="text-[#9AA89F] text-xs">{genre.books}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
