import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  mode: string;
  text: string;
}

const Button = ({ mode, text, ...props }: ButtonProps) => {
  if (mode === "white") {
    return (
      <button
        {...props}
        className="text-center text-button-label uppercase tracking-tracked w-full h-12 flex items-center justify-center transition-all rounded-pill bg-canvas text-ink border border-ink hover:bg-ink hover:text-on-primary px-8"
      >
        {text}
      </button>
    );
  }

  if (mode === "black") {
    return (
      <button
        {...props}
        className="text-center text-button-label uppercase tracking-tracked w-full h-12 flex items-center justify-center transition-all rounded-pill bg-ink text-on-primary hover:bg-shade-60 px-8"
      >
        {text}
      </button>
    );
  }

  if (mode === "transparent") {
    return (
      <button
        {...props}
        className="text-center text-button-label uppercase tracking-tracked w-full h-12 flex items-center justify-center transition-all rounded-pill text-on-primary border border-on-primary hover:bg-white/10 px-8"
      >
        {text}
      </button>
    );
  }

  return <p>No valid mode selected</p>;
};

export default Button;