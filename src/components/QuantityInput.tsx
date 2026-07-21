const QuantityInput = ({...props}) => {
  return (
    <input type="number" {...props} className="w-full h-10 bg-white indent-3 outline-none border border-[#E2E2E2] text-sm text-[#151515] focus:border-[#151515] transition-colors" placeholder="Enter quantity" />
  );
};

export default QuantityInput;
