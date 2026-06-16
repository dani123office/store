import {
  Button,
  Dropdown,
  ProductItem,
  QuantityInput,
  StandardSelectInput,
} from "../components";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { addProductToTheCart } from "../features/cart/cartSlice";
import { useAppDispatch } from "../hooks";
import WithSelectInputWrapper from "../utils/withSelectInputWrapper";
import WithNumberInputWrapper from "../utils/withNumberInputWrapper";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";

const SingleProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [size, setSize] = useState<string>("xs");
  const [color, setColor] = useState<string>("black");
  const [quantity, setQuantity] = useState<number>(1);
  const params = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const SelectInputUpgrade = WithSelectInputWrapper(StandardSelectInput);
  const QuantityInputUpgrade = WithNumberInputWrapper(QuantityInput);

  useEffect(() => {
    const fetchSingleProduct = async () => {
      const response = await customFetch.get(`/products/${params.id}`);
      setSingleProduct(response.data);
    };

    const fetchProducts = async () => {
      const response = await customFetch.get("/products");
      setProducts(response.data);
    };
    fetchSingleProduct();
    fetchProducts();
  }, [params.id]);

  const handleAddToCart = () => {
    if (singleProduct) {
      dispatch(
        addProductToTheCart({
          id: singleProduct.id + size + color,
          image: singleProduct.image,
          title: singleProduct.title,
          category: singleProduct.category,
          price: singleProduct.price,
          quantity,
          size,
          color,
          popularity: singleProduct.popularity,
          stock: singleProduct.stock,
        })
      );
      toast.success("Product added to the cart");
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-5 mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-[#f8f8f8]">
          <img
            src={`/assets/${singleProduct?.image}`}
            alt={singleProduct?.title}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-wider uppercase">
              {singleProduct?.title}
            </h1>
            <p className="text-lg text-[#151515]/70 mt-2 tracking-wider">
              Rs.{singleProduct?.price.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <SelectInputUpgrade
              selectList={[
                { id: "xs", value: "XS" },
                { id: "sm", value: "SM" },
                { id: "m", value: "M" },
                { id: "lg", value: "LG" },
                { id: "xl", value: "XL" },
                { id: "2xl", value: "2XL" },
              ]}
              value={size}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSize(() => e.target.value)
              }
            />
            <SelectInputUpgrade
              selectList={[
                { id: "black", value: "BLACK" },
                { id: "red", value: "RED" },
                { id: "blue", value: "BLUE" },
                { id: "white", value: "WHITE" },
                { id: "rose", value: "ROSE" },
                { id: "green", value: "GREEN" },
              ]}
              value={color}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setColor(() => e.target.value)
              }
            />
            <QuantityInputUpgrade
              value={quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuantity(() => parseInt(e.target.value))
              }
            />
          </div>
          <Button mode="black" text="Add to Cart" onClick={handleAddToCart} />
          <p className="text-xs text-[#151515]/50 tracking-wider">
            Delivery estimated within 5-7 business days
          </p>
          <div className="border-t border-[#E2E2E2] pt-6 space-y-4">
            <Dropdown dropdownTitle="Description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
              quos deleniti, mollitia, vitae harum suscipit voluptatem quasi.
            </Dropdown>
            <Dropdown dropdownTitle="Product Details">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga ad
              at odio illo necessitatibus.
            </Dropdown>
            <Dropdown dropdownTitle="Delivery Details">
              Free shipping nationwide. Delivery within 5-7 business days.
            </Dropdown>
          </div>
        </div>
      </div>

      <section className="mt-24 mb-16">
        <h2 className="section-title mb-12">Similar Products</h2>
        <div className="collection-grid">
          {products.slice(0, 3).map((product: Product) => (
            <ProductItem
              key={product?.id}
              id={product?.id}
              image={product?.image}
              title={product?.title}
              category={product?.category}
              price={product?.price}
              popularity={product?.popularity}
              stock={product?.stock}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default SingleProduct;
