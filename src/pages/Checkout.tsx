import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { removeProductFromTheCart, removeCoupon } from "../features/cart/cartSlice";
import customFetch from "../axios/custom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { trackFbEvent } from "../utils/fbPixel";

const EASYPAISA_NUMBER = "03015158089";
const EASYPAISA_NAME = "Zarka Usman";

const paymentMethods = [
  { id: "credit-card", title: "Credit Card / Debit Card" },
  { id: "razorpay", title: "Razorpay Secure (UPI/Wallet)" },
  { id: "easypaisa", title: "Easypaisa" },
  { id: "cod", title: "Cash on Delivery" },
];

const Checkout = () => {
  const { productsInCart, subtotal, appliedCoupon } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

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

      trackFbEvent("InitiateCheckout", {
        num_items: productsInCart.length,
        value: subtotal,
        currency: "PKR",
        contents: productsInCart.map(p => ({ id: p.id, quantity: p.quantity, price: p.price }))
      });
    }
  }, [navigate]);

  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [region, setRegion] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("Pakistan");
  const [paymentType, setPaymentType] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  const [transactionId, setTransactionId] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingFirstName, setBillingFirstName] = useState("");
  const [billingLastName, setBillingLastName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingApartment, setBillingApartment] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");
  const [billingRegion, setBillingRegion] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [billingCountry, setBillingCountry] = useState("Pakistan");

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
        console.error("Failed to load settings", e);
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

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!emailAddress || !firstName || !lastName || !address || !city || !postalCode || !phone) {
        toast.error("Please fill in all shipping fields");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailAddress)) {
        toast.error("Please enter a valid email address");
        return;
      }
      const cleanPhone = phone.replace(/[^0-9]/g, "");
      if (cleanPhone.length < 10) {
        toast.error("Please enter a valid phone number (at least 10 digits)");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (paymentType === "credit-card") {
        if (!cardNumber || !expirationDate || !cvc || !nameOnCard) {
          toast.error("Please fill in your card details");
          return;
        }
        const cleanCard = cardNumber.replace(/\s+/g, "");
        if (cleanCard.length < 16 || isNaN(Number(cleanCard))) {
          toast.error("Please enter a valid 16-digit card number");
          return;
        }
        if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
          toast.error("Please enter expiration date in MM/YY format");
          return;
        }
        if (cvc.length < 3 || cvc.length > 4 || isNaN(Number(cvc))) {
          toast.error("Please enter a valid 3 or 4-digit CVC/CVV");
          return;
        }
      }
      if (paymentType === "easypaisa") {
        if (!transactionId.trim()) {
          toast.error("Please enter your transaction ID");
          return;
        }
      }

      if (!billingSameAsShipping) {
        if (!billingFirstName || !billingLastName || !billingAddress || !billingCity || !billingPostalCode || !billingPhone) {
          toast.error("Please fill in all billing fields");
          return;
        }
        const cleanBillingPhone = billingPhone.replace(/[^0-9]/g, "");
        if (cleanBillingPhone.length < 10) {
          toast.error("Please enter a valid billing phone number (at least 10 digits)");
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

  const uploadScreenshot = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await customFetch.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.filename || res.data || "";
  };

  const handleOrderSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const isManualPayment = paymentType === "easypaisa";
    let screenshotFilename = "";

    if (isManualPayment && paymentScreenshot) {
      try {
        screenshotFilename = await uploadScreenshot(paymentScreenshot);
      } catch {
        toast.error("Failed to upload payment screenshot. Please try again.");
        setIsProcessing(false);
        return;
      }
    }

    const data: Record<string, any> = {
      emailAddress,
      firstName,
      lastName,
      address,
      apartment,
      city,
      postalCode,
      country,
      paymentType,
      cardNumber: paymentType === "credit-card" ? "xxxx-xxxx-xxxx-" + cardNumber.slice(-4) : "N/A",
      billingSameAsShipping,
      ...(billingSameAsShipping ? {} : {
        billingFirstName,
        billingLastName,
        billingAddress,
        billingApartment,
        billingCity,
        billingPostalCode,
        billingRegion,
        billingPhone,
        billingCountry,
      })
    };

    if (isManualPayment) {
      data.transactionId = transactionId.trim();
      data.paymentScreenshot = screenshotFilename;
      data.merchantNumber = EASYPAISA_NUMBER;
      data.merchantName = EASYPAISA_NAME;
    }

    const checkoutData = {
      data,
      products: productsInCart,
      subtotal: subtotal - (appliedCoupon?.discountAmount || 0),
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let response;
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const orderStatus = isManualPayment ? "Awaiting Verification" : "Processing";
      const orderPayload: Record<string, any> = {
        ...checkoutData,
        orderStatus,
        orderDate: new Date().toISOString(),
      };
      if (user.email) {
        orderPayload.user = { email: user.email, id: user.id };
      }

      response = await customFetch.post("/orders", orderPayload);

      if (response.status === 201 || response.status === 200) {
        const successMsg = isManualPayment
          ? "Order placed! Awaiting payment verification."
          : "Payment verified! Order placed successfully.";
        toast.success(successMsg);

        trackFbEvent("Purchase", {
          content_ids: productsInCart.map(p => p.id),
          value: subtotal,
          currency: "PKR",
          num_items: productsInCart.length,
          content_type: "product",
          contents: productsInCart.map(p => ({ id: p.id, quantity: p.quantity, price: p.price }))
        });

        productsInCart.forEach((p) => {
          dispatch(removeProductFromTheCart({ id: p.id }));
        });
        dispatch(removeCoupon());
        navigate("/order-confirmation");
      } else {
        toast.error("Payment failed. Please try another method.");
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
        <h2 className="text-heading-section text-ink mb-10 text-center">
          Checkout
        </h2>

        {/* Step Progress Indicator */}
        <div className="max-w-xl mx-auto mb-16 px-4">
          <div className="flex items-center justify-between text-caption uppercase tracking-tracked text-shade-40 relative">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-shade-20 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-[2px] bg-ink -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
            />

            <div className="flex flex-col items-center gap-2 relative z-10">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                step >= 1 ? "bg-ink border-ink text-on-primary" : "bg-canvas border-shade-30 text-shade-40"
              }`}>
                {step > 1 ? "\u2713" : "1"}
              </span>
              <span className={step >= 1 ? "text-ink font-bold" : ""}>Shipping</span>
            </div>

            <div className="flex flex-col items-center gap-2 relative z-10">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                step >= 2 ? "bg-ink border-ink text-on-primary" : "bg-canvas border-shade-30 text-shade-40"
              }`}>
                {step > 2 ? "\u2713" : "2"}
              </span>
              <span className={step >= 2 ? "text-ink font-bold" : ""}>Payment</span>
            </div>

            <div className="flex flex-col items-center gap-2 relative z-10">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                step === 3 ? "bg-ink border-ink text-on-primary" : "bg-canvas border-shade-30 text-shade-40"
              }`}>
                3
              </span>
              <span className={step === 3 ? "text-ink font-bold" : ""}>Review</span>
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
          <div className="lg:col-span-7">
            {step === 1 && (
              <div className="space-y-6 animate-fade">
                <h3 className="text-caption uppercase tracking-tracked font-semibold text-ink border-b border-hairline pb-3">
                  1. Shipping Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="block w-full py-2.5 px-3 border border-hairline outline-none focus:border-ink text-body-md"
                      placeholder="e.g. name@domain.com"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="block w-full py-2.5 px-3 border border-hairline outline-none focus:border-ink text-body-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="block w-full py-2.5 px-3 border border-hairline outline-none focus:border-ink text-body-md"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="block w-full py-2.5 px-3 border border-hairline outline-none focus:border-ink text-body-md"
                      placeholder="Street name and number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Apartment, suite, etc.</label>
                    <input
                      type="text"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="block w-full py-2.5 px-3 border border-hairline outline-none focus:border-ink text-body-md"
                      placeholder="Suite, unit, floor (optional)"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="block w-full py-2.5 px-3 border border-hairline outline-none focus:border-ink text-body-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="block w-full py-2.5 px-3 border border-hairline outline-none focus:border-ink text-body-md"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">State / Province</label>
                      <input
                        type="text"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="block w-full py-2.5 px-3 border border-hairline outline-none focus:border-ink text-body-md"
                      />
                    </div>
                    <div>
                      <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Country</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="block w-full py-2.5 px-3 border border-hairline outline-none bg-canvas focus:border-ink text-body-md"
                      >
                        <option>Pakistan</option>
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full py-2.5 px-3 border border-hairline outline-none focus:border-ink text-body-md"
                      required
                    />
                  </div>
                </div>
                <div className="pt-6">
                  <button
                    onClick={nextStep}
                    className="w-full bg-ink text-on-primary text-button-label uppercase tracking-tracked py-4 rounded-pill hover:bg-shade-60 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-fade">
                {/* Payment Section Header */}
                <div>
                  <h3 className="text-heading-md font-semibold text-ink mb-1">
                    Payment
                  </h3>
                  <p className="text-body-md text-shade-50">
                    All transactions are secure and encrypted.
                  </p>
                </div>

                {/* Shopify-like Payment accordion container */}
                <div className="border border-shade-30 rounded-lg overflow-hidden divide-y divide-hairline bg-white shadow-xs">
                  {paymentMethods.map((pm) => {
                    const isSelected = paymentType === pm.id;
                    return (
                      <div
                        key={pm.id}
                        className={`transition-all duration-200 ${
                          isSelected
                            ? "relative z-10 bg-[#f4f8ff] ring-1 ring-[#2563eb]"
                            : "bg-white"
                        }`}
                      >
                        <label className="flex items-center justify-between p-4 cursor-pointer select-none">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="paymentType"
                              checked={isSelected}
                              onChange={() => setPaymentType(pm.id)}
                              className="w-4 h-4 text-[#2563eb] focus:ring-[#2563eb] border-shade-40"
                            />
                            <span className="text-body-md font-semibold text-ink">
                              {pm.title}
                            </span>
                          </div>
                          
                          {/* Payment Icons */}
                          {pm.id === "credit-card" && (
                            <div className="flex items-center gap-1.5">
                              <span className="bg-[#1a1f71] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-xs italic tracking-tighter">VISA</span>
                              <div className="flex items-center bg-[#111] px-1 py-0.5 rounded-xs h-[18px]">
                                <span className="w-2 h-2 rounded-full bg-[#eb001b]" />
                                <span className="w-2 h-2 rounded-full bg-[#f79e1b] -ml-1 opacity-90" />
                              </div>
                              <span className="bg-[#016fd0] text-white text-[8px] font-bold px-1 py-0.5 rounded-xs tracking-tighter">AMEX</span>
                            </div>
                          )}
                          {pm.id === "razorpay" && (
                            <div className="flex items-center gap-1.5">
                              <span className="bg-[#1a1f71] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-xs italic tracking-tighter">VISA</span>
                              <div className="flex items-center bg-[#111] px-1 py-0.5 rounded-xs h-[18px]">
                                <span className="w-2 h-2 rounded-full bg-[#eb001b]" />
                                <span className="w-2 h-2 rounded-full bg-[#f79e1b] -ml-1 opacity-90" />
                              </div>
                              <span className="bg-[#528ff0] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-xs tracking-tighter uppercase">UPI</span>
                            </div>
                          )}
                          {pm.id === "easypaisa" && (
                            <span className="bg-green-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-pill">EasyPaisa</span>
                          )}
                        </label>

                        {/* Collapsible drawers for inputs */}
                        {isSelected && (
                          <div className="px-4 pb-5 border-t border-hairline bg-[#fafafa]/50 animate-fade">
                            {pm.id === "credit-card" && (
                              <div className="pt-4 space-y-4 max-w-xl">
                                <p className="text-caption uppercase tracking-tracked text-shade-40 font-bold">Secure Card Details (Sandbox)</p>
                                <div>
                                  <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Name on Card</label>
                                  <input
                                    type="text"
                                    value={nameOnCard}
                                    onChange={(e) => setNameOnCard(e.target.value)}
                                    className="block w-full py-2 px-3 border border-hairline bg-canvas outline-none focus:border-ink text-body-md"
                                    placeholder="John Doe"
                                  />
                                </div>
                                <div>
                                  <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Card Number</label>
                                  <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    className="block w-full py-2 px-3 border border-hairline bg-canvas outline-none focus:border-ink text-body-md"
                                    placeholder="4111 2222 3333 4444"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Expiration Date</label>
                                    <input
                                      type="text"
                                      value={expirationDate}
                                      onChange={(e) => setExpirationDate(e.target.value)}
                                      className="block w-full py-2 px-3 border border-hairline bg-canvas outline-none focus:border-ink text-body-md"
                                      placeholder="MM/YY"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">CVC / CVV</label>
                                    <input
                                      type="text"
                                      value={cvc}
                                      onChange={(e) => setCvc(e.target.value)}
                                      className="block w-full py-2 px-3 border border-hairline bg-canvas outline-none focus:border-ink text-body-md"
                                      placeholder="123"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {pm.id === "razorpay" && (
                              <div className="pt-4 text-caption text-blue-800 leading-relaxed max-w-xl">
                                <strong>Razorpay Sandbox Mode:</strong> Instantly processes UPI, wallets, and card payments in simulated sandbox environment on review.
                              </div>
                            )}

                            {pm.id === "easypaisa" && (
                              <div className="pt-4 space-y-4 max-w-xl">
                                <div className="flex items-center gap-3">
                                  <span className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">EP</span>
                                  <div>
                                    <p className="text-body-md text-ink font-semibold">Easypaisa</p>
                                    <p className="text-caption text-shade-50">Transfer to the merchant account below</p>
                                  </div>
                                </div>
                                <div className="bg-canvas border border-hairline rounded-md p-4 text-center">
                                  <p className="text-caption uppercase tracking-tracked text-shade-40 mb-1">Merchant Account</p>
                                  <p className="text-xl font-bold text-ink tracking-tight">{EASYPAISA_NUMBER}</p>
                                  <p className="text-caption text-shade-40 mt-1">Account Title: {EASYPAISA_NAME}</p>
                                </div>
                                <div>
                                  <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Transaction ID / TID</label>
                                  <input
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    className="block w-full py-2.5 px-3 border border-hairline bg-canvas outline-none focus:border-ink text-body-md"
                                    placeholder="e.g. TID12345678"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Payment Screenshot (optional)</label>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
                                    className="block w-full py-2 px-3 border border-hairline bg-canvas outline-none focus:border-ink text-body-md file:mr-3 file:py-1.5 file:px-3 file:rounded-pill file:border-0 file:bg-ink file:text-on-primary file:text-caption file:uppercase file:tracking-tracked file:cursor-pointer"
                                  />
                                </div>
                              </div>
                            )}

                            {pm.id === "cod" && (
                              <div className="pt-4 text-caption text-shade-50 leading-relaxed max-w-xl">
                                Pay in cash upon delivery. Ensure exact amount is ready for the courier agent.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Billing Address Section Header */}
                <div>
                  <h3 className="text-heading-md font-semibold text-ink mb-1">
                    Billing address
                  </h3>
                </div>

                {/* Shopify-like Billing address selector */}
                <div className="border border-shade-30 rounded-lg overflow-hidden divide-y divide-hairline bg-white shadow-xs">
                  {/* Same as shipping */}
                  <div
                    className={`transition-all duration-200 ${
                      billingSameAsShipping
                        ? "relative z-10 bg-[#f4f8ff] ring-1 ring-[#2563eb]"
                        : "bg-white"
                    }`}
                  >
                    <label className="flex items-center gap-3 p-4 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="billingAddress"
                        checked={billingSameAsShipping}
                        onChange={() => setBillingSameAsShipping(true)}
                        className="w-4 h-4 text-[#2563eb] focus:ring-[#2563eb] border-shade-40"
                      />
                      <span className="text-body-md font-semibold text-ink">
                        Same as shipping address
                      </span>
                    </label>
                  </div>

                  {/* Different billing address */}
                  <div
                    className={`transition-all duration-200 ${
                      !billingSameAsShipping
                        ? "relative z-10 bg-[#f4f8ff] ring-1 ring-[#2563eb]"
                        : "bg-white"
                    }`}
                  >
                    <label className="flex items-center gap-3 p-4 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="billingAddress"
                        checked={!billingSameAsShipping}
                        onChange={() => setBillingSameAsShipping(false)}
                        className="w-4 h-4 text-[#2563eb] focus:ring-[#2563eb] border-shade-40"
                      />
                      <span className="text-body-md font-semibold text-ink">
                        Use a different billing address
                      </span>
                    </label>

                    {/* Expandable different billing address form */}
                    {!billingSameAsShipping && (
                      <div className="px-4 pb-5 pt-2 border-t border-hairline bg-[#fafafa]/50 animate-fade space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">First Name</label>
                            <input
                              type="text"
                              value={billingFirstName}
                              onChange={(e) => setBillingFirstName(e.target.value)}
                              className="block w-full py-2.5 px-3 border border-hairline bg-canvas outline-none focus:border-ink text-body-md"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Last Name</label>
                            <input
                              type="text"
                              value={billingLastName}
                              onChange={(e) => setBillingLastName(e.target.value)}
                              className="block w-full py-2.5 px-3 border border-hairline bg-canvas outline-none focus:border-ink text-body-md"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Address</label>
                          <input
                            type="text"
                            value={billingAddress}
                            onChange={(e) => setBillingAddress(e.target.value)}
                            className="block w-full py-2.5 px-3 border border-hairline bg-canvas outline-none focus:border-ink text-body-md"
                            placeholder="Street name and number"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Apartment, suite, etc.</label>
                          <input
                            type="text"
                            value={billingApartment}
                            onChange={(e) => setBillingApartment(e.target.value)}
                            className="block w-full py-2.5 px-3 border border-hairline bg-canvas outline-none focus:border-ink text-body-md"
                            placeholder="Suite, unit, floor (optional)"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">City</label>
                            <input
                              type="text"
                              value={billingCity}
                              onChange={(e) => setBillingCity(e.target.value)}
                              className="block w-full py-2.5 px-3 border border-hairline bg-canvas outline-none focus:border-ink text-body-md"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Postal Code</label>
                            <input
                              type="text"
                              value={billingPostalCode}
                              onChange={(e) => setBillingPostalCode(e.target.value)}
                              className="block w-full py-2.5 px-3 border border-hairline bg-canvas outline-none focus:border-ink text-body-md"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">State / Province</label>
                            <input
                              type="text"
                              value={billingRegion}
                              onChange={(e) => setBillingRegion(e.target.value)}
                              className="block w-full py-2.5 px-3 border border-hairline bg-canvas outline-none focus:border-ink text-body-md"
                            />
                          </div>
                          <div>
                            <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Country</label>
                            <select
                              value={billingCountry}
                              onChange={(e) => setBillingCountry(e.target.value)}
                              className="block w-full py-2.5 px-3 border border-hairline bg-canvas outline-none focus:border-ink text-body-md"
                            >
                              <option>Pakistan</option>
                              <option>United States</option>
                              <option>Canada</option>
                              <option>United Kingdom</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-1">Phone</label>
                          <input
                            type="text"
                            value={billingPhone}
                            onChange={(e) => setBillingPhone(e.target.value)}
                            className="block w-full py-2.5 px-3 border border-hairline bg-canvas outline-none focus:border-ink text-body-md"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    onClick={prevStep}
                    className="w-1/3 border border-ink text-ink text-button-label uppercase tracking-tracked py-4 rounded-pill hover:bg-canvas-cream transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="w-2/3 bg-ink text-on-primary text-button-label uppercase tracking-tracked py-4 rounded-pill hover:bg-shade-60 transition-colors"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade">
                <h3 className="text-caption uppercase tracking-tracked font-semibold text-ink border-b border-hairline pb-3">
                  3. Review &amp; Place Order
                </h3>
                
                <div className="bg-canvas-cream border border-hairline p-5 rounded-md text-body-md space-y-4 text-ink/90">
                  <div>
                    <h4 className="text-caption uppercase tracking-tracked text-shade-50 mb-1">Shipping Target</h4>
                    <p>{firstName} {lastName}</p>
                    <p>{address}, {apartment}</p>
                    <p>{city}, {region} {postalCode}</p>
                    <p>{country} | Tel: {phone}</p>
                  </div>
                  
                  <div className="border-t border-hairline pt-3">
                    <h4 className="text-caption uppercase tracking-tracked text-shade-50 mb-1">Payment Method</h4>
                    <p className="capitalize">{paymentType.replace("-", " ")}</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={prevStep}
                    disabled={isProcessing}
                    className="w-1/3 border border-ink text-ink text-button-label uppercase tracking-tracked py-4 rounded-pill hover:bg-canvas-cream transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleOrderSubmission}
                    disabled={isProcessing}
                    className="w-2/3 bg-success-green text-on-primary text-button-label uppercase tracking-tracked py-4 rounded-pill hover:bg-green-700 transition-colors disabled:opacity-75 flex items-center justify-center gap-2"
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

          <div className="lg:col-span-5 mt-10 lg:mt-0">
            <h2 className="text-caption uppercase tracking-tracked font-medium text-ink mb-4">
              Order summary
            </h2>

            <div className="border border-hairline bg-canvas rounded-md">
              <ul role="list" className="divide-y divide-hairline max-h-[350px] overflow-y-auto">
                {productsInCart.map((product) => (
                  <li key={product?.id} className="flex px-4 py-6 sm:px-6">
                    <div className="flex-shrink-0">
                      <img
                        src={`/assets/${product?.image}`}
                        alt={product?.title}
                        className="w-16 h-20 object-cover rounded-sm border border-hairline"
                      />
                    </div>

                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-body-md font-medium text-ink">
                            {product?.title}
                          </h4>
                          <p className="mt-1 text-caption text-shade-50 uppercase tracking-tracked-wide">
                            Color: {product?.color} | Size: {product?.size}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-1 items-end justify-between pt-2">
                        <p className="text-price-current text-ink">
                          PKR {product?.price.toLocaleString()}
                        </p>
                        <p className="text-caption text-shade-50">
                          Qty: {product?.quantity}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="space-y-4 border-t border-hairline px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between text-body-md">
                  <dt className="text-shade-50">Subtotal</dt>
                  <dd className="font-medium text-ink">
                    PKR {subtotal.toLocaleString()}
                  </dd>
                </div>
                <div className="flex items-center justify-between text-body-md">
                  <dt className="text-shade-50">Shipping</dt>
                  <dd className="font-medium text-ink">
                    PKR {subtotal ? (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold ? "0 (Free!)" : shippingFee.toLocaleString()) : "0"}
                  </dd>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between border-t border-dashed border-hairline pt-4 text-success-green font-semibold text-body-md">
                    <dt className="flex items-center gap-1">
                      <span>Discount ({appliedCoupon.code})</span>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-primary hover:text-primary-dark text-caption uppercase font-bold"
                      >
                        (x)
                      </button>
                    </dt>
                    <dd>
                      - PKR {appliedCoupon.discountAmount.toLocaleString()}
                    </dd>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-hairline pt-4 text-price-current font-bold text-ink">
                  <dt>Total</dt>
                  <dd>
                    PKR {subtotal ? (subtotal - (appliedCoupon?.discountAmount || 0) + (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold ? 0 : shippingFee)).toLocaleString() : "0"}
                  </dd>
                </div>
              </dl>

              {productsInCart.length > 0 && (
                <div className="px-4 py-4 border-t border-hairline sm:px-6 bg-canvas-cream rounded-b-md">
                  <label className="block text-caption uppercase tracking-tracked text-shade-50 mb-2">
                    Enter Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-canvas border border-hairline px-3 py-2 text-caption outline-none focus:border-ink rounded-pill"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-ink text-on-primary text-button-label uppercase tracking-tracked px-5 py-2 rounded-pill hover:bg-shade-60 transition-colors"
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