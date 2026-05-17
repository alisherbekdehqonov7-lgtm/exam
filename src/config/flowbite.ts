import { createTheme } from "flowbite-react";

export const customTheme = createTheme({
  button: {
    color: {
      primary:
        "bg-[#152540] cursor-pointer text-white rounded-[38px] hover:opacity-50",
      secondary:
        "bg-[#C9AC8C] text-white cursor-pointer rounded-[38px] hover:opacity-50",
    },
    size: {
      lg: "px-5 py-3.75 text-lg",
    },
  },
});
