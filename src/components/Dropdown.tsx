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
        className="flex justify-between items-center border-b border-hairline h-12 cursor-pointer hover:opacity-70 transition-opacity"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p className="text-body-md uppercase tracking-tracked text-shade-50">{dropdownTitle}</p>
        {isOpen ? (
          <HiChevronUp className="text-sm text-shade-50" />
        ) : (
          <HiChevronDown className="text-sm text-shade-50" />
        )}
      </div>
      {isOpen && (
        <div className="mt-4">
          <p className="text-body-md text-shade-50 leading-relaxed">{children}</p>
        </div>
      )}
    </div>
  );
};
export default Dropdown;