import "../styles/sign-up.css";
import BookImage from "../assets/book-image.png";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/ui/icon";
import Input from "../components/ui/input";
import { useForm } from "react-hook-form";
import Button from "../components/ui/button";
import { useRegister } from "../hooks/api/useRegister";
import { useEffect } from "react";
import { setItem } from "../utils/localstorage";
import { toast } from "react-toastify";

export interface IFormRegister {
  fullname: string;
  email: string;
  password: string;
  confirm_password: string;
}

const SignUp = () => {
  const form = useForm<IFormRegister>();
  const { data, isPending, isSuccess, isError, mutateAsync } = useRegister();
  const navigate = useNavigate();
  const onSend = (formData: IFormRegister) => {
    mutateAsync(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      const token: string = data?.data.token;
      setItem(token);
      toast.success("you have registered!!!");
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
          <h2 className="text-white text-4xl mt-9 mb-3.5">Join BookHaven</h2>
          <p className="text-white opacity-75 text-center">
            Create your personal library, track your reading journey, and
            connect with fellow book lovers.
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
          <p className="mt-3 mb-9">Create your account</p>
          <Input
            required = {true}
            name="fullname"
            placeholder="John Doe"
            type="text"
            form={form}
            label="Full name"
          />
          <Input
            required = {true}
            name="email"
            placeholder="john@gmail.com"
            type="email"
            form={form}
            label="Email"
          />
          <div className="flex gap-x-3">
            <Input
              required = {true}
              name="password"
              placeholder="Min 8 chars"
              type="password"
              form={form}
              label="Password"
            />{" "}
            <Input
              required = {true}
              name="confirm_password"
              placeholder="Min 8 chars"
              type="password"
              form={form}
              label="Confirm Password"
            />
          </div>
          <Button type="submit" className="!bg-[#2A3D33]" isLoading={isPending}>
            Create Account
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
            Already have an account? 
            <Link className="text-blue-500" to={"/sign-in"}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
