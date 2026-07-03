import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  return (
    <div className="max-w-screen-2xl mx-auto pt-20 px-5 flex flex-col items-center">
      <h1 className="text-heading-section text-ink text-center">
        Order Confirmed
      </h1>
      <p className="text-center mt-4 text-body-md text-shade-50">
        Your order has been confirmed and will be shipped shortly.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <Link
          to="/shop"
          className="bg-ink text-on-primary text-center text-button-label uppercase tracking-tracked font-medium px-10 py-4 rounded-pill hover:bg-shade-60 transition-colors"
        >
          Continue shopping
        </Link>
        <Link
          to="/order-history"
          className="bg-canvas text-ink border border-ink text-center text-button-label uppercase tracking-tracked font-medium px-10 py-4 rounded-pill hover:bg-ink hover:text-on-primary transition-colors"
        >
          View order history
        </Link>
      </div>
    </div>
  );
};
export default OrderConfirmation;