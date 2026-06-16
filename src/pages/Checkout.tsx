import { HiTrash as TrashIcon } from "react-icons/hi2";
import { Button } from "../components";
import { useAppDispatch, useAppSelector } from "../hooks";
import { removeProductFromTheCart } from "../features/cart/cartSlice";
import customFetch from "../axios/custom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { checkCheckoutFormData } from "../utils/checkCheckoutFormData";

const paymentMethods = [
  { id: "credit-card", title: "Credit card" },
  { id: "paypal", title: "PayPal" },
  { id: "etransfer", title: "eTransfer" },
];

const Checkout = () => {
  const { productsInCart, subtotal } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleCheckoutSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    const checkoutData = {
      data,
      products: productsInCart,
      subtotal: subtotal,
    };

    if (!checkCheckoutFormData(checkoutData)) return;

    let response;
    if (JSON.parse(localStorage.getItem("user") || "{}").email) {
      response = await customFetch.post("/orders", {
        ...checkoutData,
        user: {
          email: JSON.parse(localStorage.getItem("user") || "{}").email,
          id: JSON.parse(localStorage.getItem("user") || "{}").id,
        },
        orderStatus: "Processing",
        orderDate: new Date().toISOString(),
      });
    } else {
      response = await customFetch.post("/orders", {
        ...checkoutData,
        orderStatus: "Processing",
        orderDate: new Date().toLocaleDateString(),
      });
    }

    if (response.status === 201) {
      toast.success("Order has been placed successfully");
      navigate("/order-confirmation");
    } else {
      toast.error("Something went wrong, please try again later");
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl">
      <div className="pb-24 pt-16 px-5">
        <h2 className="text-2xl md:text-3xl font-light tracking-[0.15em] uppercase mb-10">
          Checkout
        </h2>

        <form
          onSubmit={handleCheckoutSubmit}
          className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
        >
          <div>
            <div>
              <h2 className="text-sm tracking-wider uppercase font-medium text-[#151515]">
                Contact information
              </h2>

              <div className="mt-4">
                <label
                  htmlFor="email-address"
                  className="block text-xs tracking-wider uppercase text-[#151515]/70"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email-address"
                    name="emailAddress"
                    autoComplete="email"
                    className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm transition-colors"
                    required={true}
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-[#E2E2E2] pt-10">
              <h2 className="text-sm tracking-wider uppercase font-medium text-[#151515]">
                Shipping information
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-y-5 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-xs tracking-wider uppercase text-[#151515]/70"
                  >
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="first-name"
                      name="firstName"
                      autoComplete="given-name"
                      className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm transition-colors"
                      required={true}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-xs tracking-wider uppercase text-[#151515]/70"
                  >
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="last-name"
                      name="lastName"
                      autoComplete="family-name"
                      className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm transition-colors"
                      required={true}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="company"
                    className="block text-xs tracking-wider uppercase text-[#151515]/70"
                  >
                    Company
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="company"
                      id="company"
                      className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm transition-colors"
                      required={true}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-xs tracking-wider uppercase text-[#151515]/70"
                  >
                    Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      autoComplete="street-address"
                      className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm transition-colors"
                      required={true}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="apartment"
                    className="block text-xs tracking-wider uppercase text-[#151515]/70"
                  >
                    Apartment, suite, etc.
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="apartment"
                      id="apartment"
                      className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm transition-colors"
                      required={true}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-xs tracking-wider uppercase text-[#151515]/70"
                  >
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="city"
                      id="city"
                      autoComplete="address-level2"
                      className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm transition-colors"
                      required={true}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-xs tracking-wider uppercase text-[#151515]/70"
                  >
                    Country
                  </label>
                  <div className="mt-1">
                    <select
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm transition-colors"
                      required={true}
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Mexico</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="region"
                    className="block text-xs tracking-wider uppercase text-[#151515]/70"
                  >
                    State / Province
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="region"
                      id="region"
                      autoComplete="address-level1"
                      className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm transition-colors"
                      required={true}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="postal-code"
                    className="block text-xs tracking-wider uppercase text-[#151515]/70"
                  >
                    Postal code
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="postalCode"
                      id="postal-code"
                      autoComplete="postal-code"
                      className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm transition-colors"
                      required={true}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="phone"
                    className="block text-xs tracking-wider uppercase text-[#151515]/70"
                  >
                    Phone
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm transition-colors"
                      required={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-[#E2E2E2] pt-10">
              <h2 className="text-sm tracking-wider uppercase font-medium text-[#151515]">Payment</h2>

              <fieldset className="mt-4">
                <legend className="sr-only">Payment type</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  {paymentMethods.map((paymentMethod, paymentMethodIdx) => (
                    <div key={paymentMethod.id} className="flex items-center">
                      {paymentMethodIdx === 0 ? (
                        <input
                          id={paymentMethod.id}
                          name="paymentType"
                          type="radio"
                          defaultChecked
                          className="h-4 w-4 border-[#E2E2E2] text-[#151515] focus:ring-[#151515]"
                        />
                      ) : (
                        <input
                          id={paymentMethod.id}
                          name="paymentType"
                          type="radio"
                          className="h-4 w-4 border-[#E2E2E2] text-[#151515] focus:ring-[#151515]"
                        />
                      )}

                      <label
                        htmlFor={paymentMethod.id}
                        className="ml-3 block text-sm text-[#151515]/70"
                      >
                        {paymentMethod.title}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>

              <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
                <div className="col-span-4">
                  <label
                    htmlFor="card-number"
                    className="block text-xs tracking-wider uppercase text-[#151515]/70"
                  >
                    Card number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="card-number"
                      name="cardNumber"
                      autoComplete="cc-number"
                      className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm transition-colors"
                      required={true}
                    />
                  </div>
                </div>

                <div className="col-span-4">
                  <label
                    htmlFor="name-on-card"
                    className="block text-xs tracking-wider uppercase text-[#151515]/70"
                  >
                    Name on card
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name-on-card"
                      name="nameOnCard"
                      autoComplete="cc-name"
                      className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm transition-colors"
                      required={true}
                    />
                  </div>
                </div>

                <div className="col-span-3">
                  <label
                    htmlFor="expiration-date"
                    className="block text-xs tracking-wider uppercase text-[#151515]/70"
                  >
                    Expiration date (MM/YY)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="expirationDate"
                      id="expiration-date"
                      autoComplete="cc-exp"
                      className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm transition-colors"
                      required={true}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cvc"
                    className="block text-xs tracking-wider uppercase text-[#151515]/70"
                  >
                    CVC
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="cvc"
                      id="cvc"
                      autoComplete="csc"
                      className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm transition-colors"
                      required={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 lg:mt-0">
            <h2 className="text-sm tracking-wider uppercase font-medium text-[#151515]">
              Order summary
            </h2>

            <div className="mt-4 border border-[#E2E2E2] bg-white shadow-sm">
              <h3 className="sr-only">Items in your cart</h3>
              <ul role="list" className="divide-y divide-[#E2E2E2]">
                {productsInCart.map((product) => (
                  <li key={product?.id} className="flex px-4 py-6 sm:px-6">
                    <div className="flex-shrink-0">
                      <img
                        src={`/assets/${product?.image}`}
                        alt={product?.title}
                        className="w-20"
                      />
                    </div>

                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-[#151515]">
                            {product?.title}
                          </h4>
                          <p className="mt-1 text-sm text-[#151515]/60">
                            {product?.color}
                          </p>
                          <p className="text-sm text-[#151515]/60">
                            {product?.size}
                          </p>
                        </div>

                        <div className="ml-4 flow-root flex-shrink-0">
                          <button
                            type="button"
                            className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-[#151515]/40 hover:text-[#151515]"
                            onClick={() =>
                              dispatch(
                                removeProductFromTheCart({ id: product?.id })
                              )
                            }
                          >
                            <span className="sr-only">Remove</span>
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-1 items-end justify-between pt-2">
                        <p className="mt-1 text-sm font-medium text-[#151515]">
                          Rs.{product?.price.toLocaleString()}
                        </p>

                        <div className="ml-4">
                          <p className="text-sm text-[#151515]/70">
                            Qty: {product?.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="space-y-4 border-t border-[#E2E2E2] px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-[#151515]/70">Subtotal</dt>
                  <dd className="text-sm font-medium text-[#151515]">
                    Rs.{subtotal.toLocaleString()}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-[#151515]/70">Shipping</dt>
                  <dd className="text-sm font-medium text-[#151515]">
                    Rs.{subtotal ? "500" : "0"}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-[#151515]/70">Taxes</dt>
                  <dd className="text-sm font-medium text-[#151515]">
                    Rs.{subtotal ? (subtotal / 5).toLocaleString() : "0"}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-[#E2E2E2] pt-4">
                  <dt className="text-sm font-medium text-[#151515]">Total</dt>
                  <dd className="text-sm font-medium text-[#151515]">
                    Rs.{subtotal ? (subtotal + 500 + subtotal / 5).toLocaleString() : "0"}
                  </dd>
                </div>
              </dl>

              <div className="border-t border-[#E2E2E2] px-4 py-6 sm:px-6">
                <Button text="Confirm Order" mode="black" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Checkout;
