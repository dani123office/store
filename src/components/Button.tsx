import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  mode: string;
  text: string;
}

const Button = ({ mode, text, ...props }: ButtonProps) => {
  const baseClasses = "text-center text-sm tracking-[0.15em] uppercase font-medium leading-[72px] w-full h-12 flex items-center justify-center transition-all";

  if (mode === "white") {
    return (
      <button
        {...props}
        className={`${baseClasses} bg-white text-[#151515] border border-[#151515]/30 hover:bg-[#151515] hover:text-white`}
      >
        {text}
      </button>
    );
  }

  if (mode === "black") {
    return (
      <button
        {...props}
        className={`${baseClasses} bg-[#151515] text-white hover:bg-[#151515]/90`}
      >
        {text}
      </button>
    );
  }

  if (mode === "transparent") {
    return (
      <button
        {...props}
        className={`${baseClasses} text-white border border-white hover:bg-white/10`}
      >
        {text}
      </button>
    );
  }

  return <p>No valid mode selected</p>;
};

export default Button;
