import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  return (
    <div className="max-w-screen-2xl mx-auto pt-20 px-5 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-light tracking-[0.15em] uppercase text-center">
        Order Confirmed
      </h1>
      <p className="text-center mt-4 text-[#151515]/70 text-sm tracking-wider">
        Your order has been confirmed and will be shipped shortly.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <Link
          to="/shop"
          className="bg-[#151515] text-white text-center text-sm tracking-[0.15em] uppercase font-medium px-10 py-3.5 hover:bg-[#151515]/90 transition-colors"
        >
          Continue shopping
        </Link>
        <Link
          to="/order-history"
          className="bg-white text-[#151515] border border-[#151515]/30 text-center text-sm tracking-[0.15em] uppercase font-medium px-10 py-3.5 hover:bg-[#151515] hover:text-white transition-colors"
        >
          View order history
        </Link>
      </div>
    </div>
  );
};
export default OrderConfirmation;
