import { useState } from "react";
import {
  Button,
  ProductGrid,
  ProductGridWrapper,
  ShowingSearchPagination,
} from "../components";
import { Form, useSearchParams } from "react-router-dom";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "1")
  );

  return (
    <div className="max-w-screen-2xl mx-auto px-5">
      <Form
        method="post"
        className="flex items-center mt-16"
      >
        <input
          type="text"
          placeholder="Search products..."
          className="border border-[#E2E2E2] focus:border-[#151515] h-12 text-sm px-4 w-full outline-none tracking-wider"
          name="searchInput"
        />
        <div className="w-40">
          <Button mode="black" text="Search" type="submit" />
        </div>
      </Form>

      <ProductGridWrapper searchQuery={searchParams.get("query")!} page={currentPage}>
        <ProductGrid />
      </ProductGridWrapper>

      <ShowingSearchPagination page={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};
export default Search;
