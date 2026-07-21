import {
  HiCheck as CheckIcon,
  HiXMark as XMarkIcon,
  HiQuestionMarkCircle as QuestionMarkCircleIcon,
} from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  removeProductFromTheCart,
  updateProductQuantity,
  applyCoupon,
  removeCoupon,
} from "../features/cart/cartSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import customFetch from "../axios/custom";

const Cart = () => {
  const { productsInCart, subtotal, appliedCoupon } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const [couponInput, setCouponInput] = useState("");
  const [shippingFee, setShippingFee] = useState<number>(500);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(0);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const storeRes = await customFetch.get("/stores");
        if (storeRes.data && storeRes.data.length > 0) {
          const store = storeRes.data[0];
          setShippingFee(parseFloat(store.ShippingFee) || 500);
          setFreeShippingThreshold(parseFloat(store.FreeShippingThreshold) || 0);
        }
      } catch (e) {
        console.error("Failed to fetch store settings", e);
      }
    };
    fetchSettings();
  }, []);

  const handleApplyCoupon = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    try {
      const res = await customFetch.get("/db-coupons");
      const discounts = res.data || [];
      
      const found = discounts.find(
        (d: any) => d.code.toUpperCase() === couponInput.trim().toUpperCase()
      );

      if (found && found.status === "Active") {
        dispatch(applyCoupon({ code: found.code, type: found.type, value: found.value }));
        toast.success(`Coupon "${found.code}" applied!`);
        setCouponInput("");
      } else {
        toast.error("Invalid or expired coupon code");
      }
    } catch {
      toast.error("Failed to validate coupon code");
    }
  };

  const handleRemoveCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(removeCoupon());
    toast.success("Coupon removed");
  };

  return (
    <div className="bg-canvas mx-auto max-w-screen-2xl px-5">
      <div className="pb-24 pt-16">
        <h1 className="text-heading-section text-ink text-center">Shopping Cart</h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-hairline border-b border-t border-hairline"
            >
              {productsInCart.map((product) => (
                <li key={product.id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={`/assets/${product.image}`}
                      alt={product.title}
                      className="h-24 w-24 object-cover object-center sm:h-48 sm:w-48 rounded-md"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-body-md">
                            <Link
                              to={`/product/${product.id}`}
                              className="font-medium text-ink hover:text-shade-50"
                            >
                              {product.title}
                            </Link>
                          </h3>
                        </div>
                        <div className="mt-1 flex text-caption">
                          <p className="text-shade-50">{product.color}</p>
                          {product.size ? (
                            <p className="ml-4 border-l border-hairline pl-4 text-shade-50">
                              {product.size}
                            </p>
                          ) : null}
                        </div>
                        <p className="mt-1 text-price-current text-ink">
                          Rs.{product.price}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label htmlFor="quantity" className="text-caption uppercase tracking-tracked mr-2">Qty:</label>
                        <input
                          type="number"
                          id="quantity"
                          min="1"
                          className="w-16 h-7 indent-1 bg-canvas border border-hairline text-body-md rounded-sm"
                          value={product?.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (isNaN(val) || val < 1) return;
                            dispatch(
                              updateProductQuantity({
                                id: product?.id,
                                quantity: val,
                              })
                            );
                          }}
                        />

                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            className="-m-2 inline-flex p-2 text-shade-40 hover:text-ink"
                            onClick={() => {
                              dispatch(
                                removeProductFromTheCart({ id: product?.id })
                              );
                              toast.error("Product removed from the cart");
                            }}
                          >
                            <span className="sr-only">Remove</span>
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 flex space-x-2 text-caption text-shade-50">
                      {product?.stock ? (
                        <CheckIcon
                          className="h-5 w-5 flex-shrink-0 text-success-green"
                          aria-hidden="true"
                        />
                      ) : (
                        <XMarkIcon
                          className="h-5 w-5 flex-shrink-0 text-red-600"
                          aria-hidden="true"
                        />
                      )}
                      <span>
                        {product?.stock ? "In stock" : "Out of stock"}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="summary-heading"
            className="mt-16 bg-canvas-cream border border-hairline px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 rounded-md"
          >
            <h2
              id="summary-heading"
              className="text-caption uppercase tracking-tracked font-medium text-ink"
            >
              Order Summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-body-md text-shade-50">Subtotal</dt>
                <dd className="text-body-md font-medium text-ink">
                  Rs.{subtotal}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-hairline pt-4">
                <dt className="flex items-center text-body-md text-shade-50">
                  <span>Shipping estimate</span>
                  <a
                    href="#"
                    className="ml-2 flex-shrink-0 text-shade-40 hover:text-ink"
                  >
                    <span className="sr-only">
                      Learn more about how shipping is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </a>
                </dt>
                <dd className="text-body-md font-medium text-ink">
                  Rs.{subtotal === 0 ? 0 : (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold ? "0 (Free!)" : shippingFee.toLocaleString())}
                </dd>
              </div>

              {appliedCoupon && (
                <div className="flex items-center justify-between border-t border-dashed border-hairline pt-4 text-success-green font-medium text-body-md">
                  <dt className="flex items-center gap-1.5">
                    <span>Discount ({appliedCoupon.code})</span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-primary hover:text-primary-dark text-caption font-semibold focus:outline-none"
                    >
                      (Remove)
                    </button>
                  </dt>
                  <dd>
                    - Rs.{appliedCoupon.discountAmount.toLocaleString()}
                  </dd>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-hairline pt-4">
                <dt className="text-body-md font-medium text-ink">
                  Order total
                </dt>
                <dd className="text-body-md font-medium text-ink">
                  Rs.{subtotal === 0 ? 0 : (subtotal - (appliedCoupon?.discountAmount || 0) + (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold ? 0 : shippingFee)).toLocaleString()}
                </dd>
              </div>
            </dl>

            {productsInCart.length > 0 && (
              <div className="mt-8 border-t border-hairline pt-6">
                <label className="block text-caption uppercase tracking-tracked font-medium text-ink mb-2">
                  Promo / Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. WELCOME10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-canvas border border-hairline px-3 py-2 text-body-md outline-none focus:border-ink rounded-pill"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-ink text-on-primary text-button-label uppercase tracking-tracked px-6 py-2 rounded-pill hover:bg-shade-60 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            {productsInCart.length > 0 && (
              <div className="mt-6">
                <Link
                  to="/checkout"
                  className="text-on-primary bg-ink text-center text-button-label uppercase tracking-tracked font-semibold w-full h-12 flex items-center justify-center rounded-pill hover:bg-shade-60 transition-colors"
                >
                  Checkout
                </Link>
              </div>
            )}
          </section>
        </form>
      </div>
    </div>
  );
};

export default Cart;