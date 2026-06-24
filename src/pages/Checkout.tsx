import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { removeProductFromTheCart, removeCoupon } from "../features/cart/cartSlice";
import customFetch from "../axios/custom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const paymentMethods = [
  { id: "credit-card", title: "Credit Card / Debit Card" },
  { id: "razorpay", title: "Razorpay Secure (UPI/Wallet)" },
  { id: "cod", title: "Cash on Delivery" },
];

const Checkout = () => {
  const { productsInCart, subtotal, appliedCoupon } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Multi-step state
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [emailAddress, setEmailAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      toast.error("Please login to proceed to checkout.");
      navigate("/login");
    } else {
      if (user.email) setEmailAddress(user.email);
      if (user.name) setFirstName(user.name);
      if (user.lastname) setLastName(user.lastname);
    }
  }, [navigate]);
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [region, setRegion] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Canada");
  const [paymentType, setPaymentType] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  const [couponInput, setCouponInput] = useState("");

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
        dispatch({
          type: "cart/applyCoupon",
          payload: { code: found.code, type: found.type, value: found.value }
        });
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

  // Step Navigations with Validation
  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!emailAddress || !firstName || !lastName || !address || !city || !postalCode || !phone) {
        toast.error("Please fill in all shipping fields");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (paymentType === "credit-card") {
        if (!cardNumber || !expirationDate || !cvc || !nameOnCard) {
          toast.error("Please fill in your card details");
          return;
        }
      }
      setStep(3);
    }
  };

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleOrderSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const data = {
      emailAddress,
      firstName,
      lastName,
      address,
      apartment,
      city,
      postalCode,
      region,
      phone,
      country,
      paymentType,
      cardNumber: paymentType === "credit-card" ? "xxxx-xxxx-xxxx-" + cardNumber.slice(-4) : "N/A",
    };

    const checkoutData = {
      data,
      products: productsInCart,
      subtotal: subtotal - (appliedCoupon?.discountAmount || 0),
    };

    try {
      // Simulate real Payment Gateway authorization delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let response;
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.email) {
        response = await customFetch.post("/orders", {
          ...checkoutData,
          user: {
            email: user.email,
            id: user.id,
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

      if (response.status === 201 || response.status === 200) {
        toast.success("Payment verified! Order placed successfully.");
        // Clear cart items
        productsInCart.forEach((p) => {
          dispatch(removeProductFromTheCart({ id: p.id }));
        });
        dispatch(removeCoupon());
        navigate("/order-confirmation");
      } else {
        toast.error("Payment failed. Please try another card.");
      }
    } catch {
      toast.error("Something went wrong, please try again later");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl">
      <div className="pb-24 pt-16 px-5">
        <h2 className="text-2xl md:text-3xl font-light tracking-[0.15em] uppercase mb-10 text-center font-serif">
          Checkout
        </h2>

        {/* Step Progress Indicator */}
        <div className="max-w-xl mx-auto mb-16 px-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-[#151515]/40 relative">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-200 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-[2px] bg-[#151515] -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
            />

            <div className="flex flex-col items-center gap-2 relative z-10">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                step >= 1 ? "bg-[#151515] border-[#151515] text-white" : "bg-white border-gray-300 text-gray-400"
              }`}>
                {step > 1 ? "✓" : "1"}
              </span>
              <span className={step >= 1 ? "text-[#151515] font-bold" : ""}>Shipping</span>
            </div>

            <div className="flex flex-col items-center gap-2 relative z-10">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                step >= 2 ? "bg-[#151515] border-[#151515] text-white" : "bg-white border-gray-300 text-gray-400"
              }`}>
                {step > 2 ? "✓" : "2"}
              </span>
              <span className={step >= 2 ? "text-[#151515] font-bold" : ""}>Payment</span>
            </div>

            <div className="flex flex-col items-center gap-2 relative z-10">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                step === 3 ? "bg-[#151515] border-[#151515] text-white" : "bg-white border-gray-300 text-gray-400"
              }`}>
                3
              </span>
              <span className={step === 3 ? "text-[#151515] font-bold" : ""}>Review</span>
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
          {/* Form Side */}
          <div className="lg:col-span-7">
            {step === 1 && (
              <div className="space-y-6 animate-fade">
                <h3 className="text-sm tracking-wider uppercase font-semibold text-[#151515] border-b border-[#e2e2e2] pb-3">
                  1. Shipping Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-[#151515]/70 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm"
                      placeholder="e.g. name@domain.com"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-[#151515]/70 mb-1">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-[#151515]/70 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-[#151515]/70 mb-1">Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm"
                      placeholder="Street name and number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-[#151515]/70 mb-1">Apartment, suite, etc.</label>
                    <input
                      type="text"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm"
                      placeholder="Suite, unit, floor (optional)"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-[#151515]/70 mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-[#151515]/70 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-[#151515]/70 mb-1">State / Province</label>
                      <input
                        type="text"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-[#151515]/70 mb-1">Country</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none bg-white focus:border-[#151515] text-sm"
                      >
                        <option>Pakistan</option>
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-[#151515]/70 mb-1">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full py-2.5 px-3 border border-[#E2E2E2] outline-none focus:border-[#151515] text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="pt-6">
                  <button
                    onClick={nextStep}
                    className="w-full bg-[#151515] text-white text-xs font-semibold tracking-widest uppercase py-4 hover:bg-[#333] transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade">
                <h3 className="text-sm tracking-wider uppercase font-semibold text-[#151515] border-b border-[#e2e2e2] pb-3">
                  2. Choose Payment Method
                </h3>
                <div className="space-y-4">
                  {paymentMethods.map((pm) => (
                    <label
                      key={pm.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        paymentType === pm.id ? "border-[#151515] bg-gray-50/50" : "border-[#e0e0e0]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentType"
                          checked={paymentType === pm.id}
                          onChange={() => setPaymentType(pm.id)}
                          className="w-4 h-4 text-[#151515] focus:ring-[#151515]"
                        />
                        <span className="text-sm font-medium text-[#151515]">{pm.title}</span>
                      </div>
                      {pm.id === "credit-card" && (
                        <div className="flex gap-1 text-[9px] font-bold text-gray-400">
                          <span className="border px-1.5 py-0.5 rounded">VISA</span>
                          <span className="border px-1.5 py-0.5 rounded">MC</span>
                        </div>
                      )}
                    </label>
                  ))}

                  {paymentType === "credit-card" && (
                    <div className="bg-gray-50 border border-[#e8e8e8] p-5 rounded-lg space-y-4 animate-fade">
                      <div className="text-xs font-bold uppercase tracking-widest text-[#151515]/40 mb-2">
                        SECURE CARD DETAILS (SANDBOX)
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#151515]/70 mb-1">Name on Card</label>
                        <input
                          type="text"
                          value={nameOnCard}
                          onChange={(e) => setNameOnCard(e.target.value)}
                          className="block w-full py-2 px-3 border border-[#E2E2E2] bg-white outline-none focus:border-[#151515] text-sm"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#151515]/70 mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="block w-full py-2 px-3 border border-[#E2E2E2] bg-white outline-none focus:border-[#151515] text-sm"
                          placeholder="4111 2222 3333 4444"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-[#151515]/70 mb-1">Expiration Date</label>
                          <input
                            type="text"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                            className="block w-full py-2 px-3 border border-[#E2E2E2] bg-white outline-none focus:border-[#151515] text-sm"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-[#151515]/70 mb-1">CVC / CVV</label>
                          <input
                            type="text"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                            className="block w-full py-2 px-3 border border-[#E2E2E2] bg-white outline-none focus:border-[#151515] text-sm"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentType === "razorpay" && (
                    <div className="bg-[#eff6ff] border border-[#bfdbfe] p-4 rounded-lg text-xs text-[#1e40af] tracking-wide leading-relaxed animate-fade">
                      <strong>Razorpay Sandbox Mode:</strong> Clicking final confirm will overlay a simulated UPI/QR payment request interface and verify transaction details instantly.
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={prevStep}
                    className="w-1/3 border border-[#151515] text-[#151515] text-xs font-semibold tracking-widest uppercase py-4 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="w-2/3 bg-[#151515] text-white text-xs font-semibold tracking-widest uppercase py-4 hover:bg-[#333] transition-colors"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade">
                <h3 className="text-sm tracking-wider uppercase font-semibold text-[#151515] border-b border-[#e2e2e2] pb-3">
                  3. Review &amp; Place Order
                </h3>
                
                <div className="bg-gray-50 border border-[#e2e2e2] p-5 rounded-lg text-sm space-y-4 text-[#151515]/90">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#151515]/50 mb-1">Shipping Target</h4>
                    <p>{firstName} {lastName}</p>
                    <p>{address}, {apartment}</p>
                    <p>{city}, {region} {postalCode}</p>
                    <p>{country} | Tel: {phone}</p>
                  </div>
                  
                  <div className="border-t border-[#e8e8e8] pt-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#151515]/50 mb-1">Payment Method</h4>
                    <p className="capitalize">{paymentType.replace("-", " ")}</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={prevStep}
                    disabled={isProcessing}
                    className="w-1/3 border border-[#151515] text-[#151515] text-xs font-semibold tracking-widest uppercase py-4 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleOrderSubmission}
                    disabled={isProcessing}
                    className="w-2/3 bg-green-600 text-white text-xs font-bold tracking-widest uppercase py-4 hover:bg-green-700 transition-colors disabled:opacity-75 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Processing Payment...
                      </>
                    ) : (
                      "Place Order & Pay"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary Side */}
          <div className="lg:col-span-5 mt-10 lg:mt-0">
            <h2 className="text-sm tracking-wider uppercase font-medium text-[#151515] mb-4">
              Order summary
            </h2>

            <div className="border border-[#E2E2E2] bg-white shadow-sm">
              <ul role="list" className="divide-y divide-[#E2E2E2] max-h-[350px] overflow-y-auto">
                {productsInCart.map((product) => (
                  <li key={product?.id} className="flex px-4 py-6 sm:px-6">
                    <div className="flex-shrink-0">
                      <img
                        src={`/assets/${product?.image}`}
                        alt={product?.title}
                        className="w-16 h-20 object-cover rounded border border-[#e0e0e0]"
                      />
                    </div>

                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-[#151515] font-serif tracking-wide">
                            {product?.title}
                          </h4>
                          <p className="mt-1 text-xs text-[#151515]/60 uppercase tracking-widest">
                            Color: {product?.color} | Size: {product?.size}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-1 items-end justify-between pt-2">
                        <p className="text-sm font-semibold text-[#151515] tracking-wider">
                          PKR {product?.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-[#151515]/70">
                          Qty: {product?.quantity}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="space-y-4 border-t border-[#E2E2E2] px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between text-sm">
                  <dt className="text-[#151515]/70">Subtotal</dt>
                  <dd className="font-medium text-[#151515]">
                    PKR {subtotal.toLocaleString()}
                  </dd>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <dt className="text-[#151515]/70">Shipping</dt>
                  <dd className="font-medium text-[#151515]">
                    PKR {subtotal ? "500" : "0"}
                  </dd>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <dt className="text-[#151515]/70">GST (20%)</dt>
                  <dd className="font-medium text-[#151515]">
                    PKR {subtotal ? Math.round(subtotal / 5).toLocaleString() : "0"}
                  </dd>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between border-t border-dashed border-[#E2E2E2] pt-4 text-green-600 font-semibold text-sm">
                    <dt className="flex items-center gap-1">
                      <span>Discount ({appliedCoupon.code})</span>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-red-500 hover:text-red-700 text-[10px] uppercase font-bold"
                      >
                        (x)
                      </button>
                    </dt>
                    <dd>
                      - PKR {appliedCoupon.discountAmount.toLocaleString()}
                    </dd>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-[#E2E2E2] pt-4 text-base font-bold text-[#151515]">
                  <dt>Total</dt>
                  <dd>
                    PKR {subtotal ? (subtotal - (appliedCoupon?.discountAmount || 0) + 500 + Math.round(subtotal / 5)).toLocaleString() : "0"}
                  </dd>
                </div>
              </dl>

              {/* Promo input field inside Checkout order summary card */}
              {productsInCart.length > 0 && (
                <div className="px-4 py-4 border-t border-[#E2E2E2] sm:px-6 bg-[#fafafa]">
                  <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#151515]/60 mb-2">
                    Enter Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-white border border-[#E2E2E2] px-3 py-2 text-xs outline-none focus:border-[#151515]"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-[#151515] text-white text-[10px] font-bold tracking-widest uppercase px-5 py-2 hover:bg-[#333] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
