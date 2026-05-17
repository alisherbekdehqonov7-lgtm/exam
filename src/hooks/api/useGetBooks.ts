import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface IBook {
  id: string;
  title: string;
  author: string;
  rating: number;
  price: number;
  favorite: boolean;
  description?: string;
  genre?: string;
  image?: string;
}

export interface IGetBooksParams {
  page?: number;
  limit?: number;
  genre?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?:
    | "newest"
    | "oldest"
    | "price_asc"
    | "price_desc"
    | "rating"
    | "popularity";
  search?: string;
}

export const useGetBooks = (params: IGetBooksParams = {}) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["books", params],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3001/api/books", {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...(params.genre && { genre: params.genre }),
          ...(params.minPrice !== undefined && { minPrice: params.minPrice }),
          ...(params.maxPrice !== undefined && { maxPrice: params.maxPrice }),
          ...(params.minRating !== undefined && {
            minRating: params.minRating,
          }),
          ...(params.sortBy && { sort: params.sortBy }),
          ...(params.search && { search: params.search }),
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
  });

  const booksArray = Array.isArray(data?.data)
    ? data.data.map((book: any) => ({
        ...book,
        author:
          typeof book.author === "object" ? book.author?.fullName : book.author,
        image:
          book.image ||
          "https://via.placeholder.com/200x300?text=" +
            encodeURIComponent(book.title),
      }))
    : Array.isArray(data)
      ? data.map((book: any) => ({
          ...book,
          author:
            typeof book.author === "object"
              ? book.author?.fullName
              : book.author,
          image:
            book.image ||
            "https://via.placeholder.com/200x300?text=" +
              encodeURIComponent(book.title),
        }))
      : [];

  return {
    books: booksArray,
    total: data?.total || 0,
    isPending,
    isError,
    error,
  };
};
