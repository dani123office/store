import { nanoid } from "nanoid";

interface ISelectElement {
  id: number;
  value: string;
}

const StandardSelectInput = ({
  selectList,
  ...props
}: {
  selectList: ISelectElement[];
}) => {
  return (
    <select
      className="w-full py-2.5 px-3 border border-[#E2E2E2] text-sm text-[#151515] outline-none focus:border-[#151515] transition-colors bg-white"
      {...props}
    >
      {selectList &&
        selectList.map((element: ISelectElement) => (
          <option key={nanoid()} value={element.id}>
            {element.value}
          </option>
        ))}
    </select>
  );
};
export default StandardSelectInput;
