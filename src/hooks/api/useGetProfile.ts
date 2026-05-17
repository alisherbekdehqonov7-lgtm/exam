import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const useGetProfile = () => {
    const onGetProfile = async () => await axios.get("http://localhost:3001/api/auth/profile",{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    const {data,isSuccess,isError} = useQuery({
        queryKey: ["profile"],
        queryFn: async () => onGetProfile()
    })
    return { data,isSuccess,isError}
}