import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface IAuthorDetail {
  id: string;
  fullName: string;
  biography?: string;
  birthDate?: string;
  birthPlace?: string;
  booksCount?: number;
  followersCount?: number;
  avgRating?: number;
  books?: Array<{
    id: string;
    title: string;
    rating: number;
    price: number;
  }>;
}

export const useGetAuthorDetail = (authorId: string) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["author", authorId],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:3001/api/authors/${authorId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    },
    enabled: !!authorId,
  });

  const author: IAuthorDetail = Array.isArray(data)
    ? data[0]
    : data?.data || data || {};

  return {
    author,
    isPending,
    isError,
    error,
  };
};
