const HomeCollectionFilter = () => {
  return (
    <div className="max-w-screen-2xl flex items-center justify-between mx-auto mt-24 max-lg:flex-col max-lg:gap-y-5 px-5">
      <ul className="flex gap-8 items-center text-sm tracking-wider uppercase max-sm:gap-4 max-sm:text-xs">
        <li className="text-[#151515] cursor-pointer font-medium">All</li>
        <li className="text-[#151515]/50 hover:text-[#151515] cursor-pointer transition-colors">Tops</li>
        <li className="text-[#151515]/50 hover:text-[#151515] cursor-pointer transition-colors">Dresses</li>
        <li className="text-[#151515]/50 hover:text-[#151515] cursor-pointer transition-colors">Shorts</li>
        <li className="text-[#151515]/50 hover:text-[#151515] cursor-pointer transition-colors">Jeans</li>
      </ul>
    </div>
  );
};
export default HomeCollectionFilter;
