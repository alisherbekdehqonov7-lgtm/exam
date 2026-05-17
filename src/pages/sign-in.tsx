import "../styles/sign-up.css";
import BookImage from "../assets/sign-in-logo.png";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/ui/icon";
import Input from "../components/ui/input";
import { useForm } from "react-hook-form";
import Button from "../components/ui/button";
import { useEffect } from "react";
import { setItem } from "../utils/localstorage";
import { toast } from "react-toastify";
import { useLogin } from "../hooks/api/useLogin";
import { useUserStore } from "../store/user.store";
import type { IUserResponse } from "../types/user.type";

export interface IFormLogin {
  email: string;
  password: string;
}

const SignIn = () => {
  const form = useForm<IFormLogin>();
  const store = useUserStore()
  const { data, isPending, isSuccess, isError, mutateAsync } = useLogin();
  const navigate = useNavigate();
  const onSend = (formData: IFormLogin) => {
    mutateAsync(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      const token: string = data?.data.token;
      const user: IUserResponse = data?.data.user;
      setItem(token);
      store.setUser(user)
      toast.success("you have logged in!!!");
      navigate("/");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error("something went wrong!!!");
    }
  }, [isError]);

  return (
    <div className="flex h-screen">
      <div className="sign-up-left flex items-center justify-center h-full w-[50%]">
        <div className="flex flex-col items-center max-w-[320px]">
          <img width={100} height={100} src={BookImage} alt="book-image" />
          <h2 className="text-white text-4xl mt-9 mb-3.5">Welcome Back</h2>
          <p className="text-white opacity-75 text-center">
          Discover your next favorite book from our
           curated collection of timeless literature.
          </p>
        </div>
      </div>
      <div className="h-full w-[50%] sign-up-right p-[60px_72px]">
        <Link to="/" className="flex items-center gap-2">
          <Icon.leaf />
          <Icon.logo />
        </Link>
        <form
          onSubmit={form.handleSubmit(onSend)}
          action=""
          className="flex flex-col gap-y-5"
        >
          <p className="mt-3 mb-9">Sign in to your account</p>
          <Input
            required = {true}
            name="email"
            placeholder="john@gmail.com"
            type="email"
            form={form}
            label="Email"
          />
            <Input
              required = {true}
              name="password"
              placeholder="••••••••"
              type="password"
              form={form}
              label="Password"
            />{" "}
          <Button type="submit" className="!bg-[#2A3D33]" isLoading={isPending}>
            Sign In
          </Button>
          <div className="flex items-center justify-between">
            <span className="h-0.5 grow max-w-55.5 bg-[#E8E0D4]"></span>
            <span className="inline-block">or continue with</span>
            <span className="h-0.5 grow max-w-55.5 bg-[#E8E0D4]"></span>
          </div>
          <Button className="!bg-white !text-black">
            🔵 Continue with Google
          </Button>
          <p className="text-center">
            Don't have an account? 
            <Link className="text-blue-500" to={"/sign-up"}>
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
export default SignIn;
