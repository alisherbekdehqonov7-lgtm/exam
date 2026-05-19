import { useEffect, useState } from "react";

const FAVORITES_LOCAL_STORAGE_KEY = "favoriteBookIds";

export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") {
      return new Set();
    }

    try {
      const stored = localStorage.getItem(FAVORITES_LOCAL_STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem(
      FAVORITES_LOCAL_STORAGE_KEY,
      JSON.stringify(Array.from(favoriteIds)),
    );
  }, [favoriteIds]);

  const toggleFavorite = (bookId: string) => {
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (next.has(bookId)) {
        next.delete(bookId);
      } else {
        next.add(bookId);
      }
      return next;
    });
  };

  const isFavorite = (bookId: string | number) =>
    favoriteIds.has(String(bookId));

  const attachFavorites = (books: any[]) =>
    books.map((book) => ({
      ...book,
      favorite: favoriteIds.has(String(book.id)),
    }));

  const filterFavorites = (books: any[]) =>
    books.filter((book) => favoriteIds.has(String(book.id)));

  return {
    favoriteIds,
    toggleFavorite,
    isFavorite,
    attachFavorites,
    filterFavorites,
  };
};
