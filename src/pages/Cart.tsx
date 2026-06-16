import {
  HiCheck as CheckIcon,
  HiXMark as XMarkIcon,
  HiQuestionMarkCircle as QuestionMarkCircleIcon,
} from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "../hooks";
import { Link } from "react-router-dom";
import {
  removeProductFromTheCart,
  updateProductQuantity,
} from "../features/cart/cartSlice";
import toast from "react-hot-toast";

const Cart = () => {
  const { productsInCart, subtotal } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  return (
    <div className="bg-white mx-auto max-w-screen-2xl px-5">
      <div className="pb-24 pt-16">
        <h1 className="text-2xl md:text-3xl font-light tracking-[0.15em] uppercase">
          Shopping Cart
        </h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-[#E2E2E2] border-b border-t border-[#E2E2E2]"
            >
              {productsInCart.map((product) => (
                <li key={product.id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={`/assets/${product.image}`}
                      alt={product.title}
                      className="h-24 w-24 object-cover object-center sm:h-48 sm:w-48"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <Link
                              to={`/product/${product.id}`}
                              className="font-medium text-[#151515] hover:text-[#151515]/70"
                            >
                              {product.title}
                            </Link>
                          </h3>
                        </div>
                        <div className="mt-1 flex text-sm">
                          <p className="text-[#151515]/60">{product.color}</p>
                          {product.size ? (
                            <p className="ml-4 border-l border-[#E2E2E2] pl-4 text-[#151515]/60">
                              {product.size}
                            </p>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm font-medium text-[#151515]">
                          Rs.{product.price}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label htmlFor="quantity" className="text-xs tracking-wider uppercase mr-2">Qty:</label>
                        <input
                          type="number"
                          id="quantity"
                          className="w-16 h-7 indent-1 bg-white border border-[#E2E2E2] text-sm"
                          value={product?.quantity}
                          onChange={(e) => {
                            dispatch(
                              updateProductQuantity({
                                id: product?.id,
                                quantity: parseInt(e.target.value),
                              })
                            );
                          }}
                        />

                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            className="-m-2 inline-flex p-2 text-[#151515]/40 hover:text-[#151515]"
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

                    <p className="mt-4 flex space-x-2 text-sm text-[#151515]/70">
                      {product?.stock ? (
                        <CheckIcon
                          className="h-5 w-5 flex-shrink-0 text-green-500"
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
            className="mt-16 bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2
              id="summary-heading"
              className="text-base font-medium text-[#151515] tracking-wider uppercase"
            >
              Order Summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-[#151515]/60">Subtotal</dt>
                <dd className="text-sm font-medium text-[#151515]">
                  Rs.{subtotal}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-[#E2E2E2] pt-4">
                <dt className="flex items-center text-sm text-[#151515]/60">
                  <span>Shipping estimate</span>
                  <a
                    href="#"
                    className="ml-2 flex-shrink-0 text-[#151515]/40 hover:text-[#151515]"
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
                <dd className="text-sm font-medium text-[#151515]">
                  Rs.{subtotal === 0 ? 0 : 500}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-[#E2E2E2] pt-4">
                <dt className="flex text-sm text-[#151515]/60">
                  <span>Tax estimate</span>
                  <a
                    href="#"
                    className="ml-2 flex-shrink-0 text-[#151515]/40 hover:text-[#151515]"
                  >
                    <span className="sr-only">
                      Learn more about how tax is calculated
                    </span>
                    <QuestionMarkCircleIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </a>
                </dt>
                <dd className="text-sm font-medium text-[#151515]">
                  Rs.{subtotal / 5}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-[#E2E2E2] pt-4">
                <dt className="text-base font-medium text-[#151515]">
                  Order total
                </dt>
                <dd className="text-base font-medium text-[#151515]">
                  Rs.{subtotal === 0 ? 0 : subtotal + subtotal / 5 + 500}
                </dd>
              </div>
            </dl>

            {productsInCart.length > 0 && (
              <div className="mt-6">
                <Link
                  to="/checkout"
                  className="text-white bg-[#151515] text-center text-sm tracking-[0.15em] uppercase font-medium leading-[72px] w-full h-12 flex items-center justify-center hover:bg-[#151515]/90 transition-colors"
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
