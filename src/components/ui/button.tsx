import { Button as FlowBiteButton } from "flowbite-react";
import type { ReactNode } from "react";
import Spinner from "./spinner";

interface IProps {
  children: ReactNode;
  color?: string;
  type?: "button" | "submit" | "reset";
  className: string;
  isLoading?: boolean;
}

const Button = ({ children, type, className, color, isLoading }: IProps) => {
  return (
    <FlowBiteButton
      type={type ? type : "button"}
      className={`${className} cursor-pointer hover:opacity-65`}
      color={color}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <Spinner />
          {children}
        </span>
      ) : (
        children
      )}
    </FlowBiteButton>
  );
};
export default Button;
