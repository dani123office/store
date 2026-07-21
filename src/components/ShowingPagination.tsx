import { HiChevronUp } from "react-icons/hi2";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks";

const ShowingPagination = ({
  page,
  category,
  setCurrentPage,
}: {
  page: number;
  category: string;
  setCurrentPage: (page: number) => void;
}) => {
  const { totalProducts, showingProducts } = useAppSelector(state => state.shop);
  const navigate = useNavigate();
  return (
    <div className="px-5 mt-12 mb-24">
      <div className="flex flex-col gap-6 justify-center items-center w-full max-w-xs mx-auto">
        <p className="text-body-md text-shade-50 tracking-tracked-wide">
          Showing {showingProducts} of {totalProducts}
        </p>
        <Button
          text="View More"
          mode="white"
          onClick={() => {
            setCurrentPage(page + 1);
            navigate(`/shop${category ? `/${category}` : ""}?page=${page + 1}`);
          }}
        />
        <a href="#gridTop" className="flex justify-center items-center text-caption uppercase tracking-tracked gap-2 text-shade-50 hover:text-ink transition-colors">
          Back to Top <HiChevronUp />
        </a>
      </div>
    </div>
  );
};
export default ShowingPagination;