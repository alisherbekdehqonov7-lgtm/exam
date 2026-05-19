import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface IAuthor {
  id: string;
  fullName: string;
  biography?: string;
}

export const useGetAuthors = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3001/api/authors", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
  });

  const authorsArray = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  return {
    authors: authorsArray,
    isPending,
    isError,
    error,
  };
};
