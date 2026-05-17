import Header from "../header";
import Footer from "../footer";
import { Outlet } from "react-router-dom";
import { useGetProfile } from "../../hooks/api/useGetProfile";
import { useEffect } from "react";
import { useUserStore } from "../../store/user.store";
import { toast } from "react-toastify";
const RootLayout = () => {
  const {data,isSuccess,isError} = useGetProfile()
  const userStore = useUserStore()
  useEffect(() => {
    if(isSuccess){
      const user = data?.data
      userStore.setUser(user)
    }
  },[isSuccess])
  useEffect(() => {
    if(isError){
      toast.error("something went wrong!!!")
    }
  },[isError])
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default RootLayout;
