import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface ICreateAuthorRequest {
  fullName: string;
  biography?: string;
}

export const useCreateAuthor = () => {
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: async (data: ICreateAuthorRequest) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }
      const response = await axios.post(
        "http://localhost:3001/api/authors",
        data,
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
    createAuthor: mutateAsync,
    isPending,
    isError,
    error,
  };
};
