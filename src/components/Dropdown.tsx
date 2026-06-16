import { useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi2";

const Dropdown = ({
  dropdownTitle,
  children,
}: {
  dropdownTitle: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div
        className="flex justify-between items-center border-b border-[#E2E2E2] h-12 cursor-pointer hover:opacity-70 transition-opacity"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p className="text-sm tracking-wider uppercase text-[#151515]/70">{dropdownTitle}</p>
        {isOpen ? (
          <HiChevronUp className="text-sm text-[#151515]/50" />
        ) : (
          <HiChevronDown className="text-sm text-[#151515]/50" />
        )}
      </div>
      {isOpen && (
        <div className="mt-4">
          <p className="text-sm text-[#151515]/60 leading-relaxed">{children}</p>
        </div>
      )}
    </div>
  );
};
export default Dropdown;
