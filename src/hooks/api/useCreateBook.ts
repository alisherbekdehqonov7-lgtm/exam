import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface ICreateBookRequest {
  title: string;
  authorId: string;
  price: number;
  description?: string;
  genres?: string[];
  isbn?: string;
  pages?: number;
  language?: string;
  publisher?: string;
  publicationDate?: string;
  status?: "published" | "draft";
}

export const useCreateBook = () => {
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: async (data: ICreateBookRequest) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }
      const response = await axios.post(
        "http://localhost:3001/api/books",
        {
          title: data.title,
          authorId: data.authorId,
          price: data.price,
          description: data.description,
          genres: data.genres,
          isbn: data.isbn,
          pages: data.pages,
          language: data.language,
          publisher: data.publisher,
          publicationDate: data.publicationDate,
          status: data.status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );
      return response.data;
    },
  });

  return {
    createBook: mutateAsync,
    isPending,
    isError,
    error,
  };
};
