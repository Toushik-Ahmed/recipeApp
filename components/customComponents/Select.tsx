import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  items?: string[];
  placeholder?: string;
  onSelect?: (value: string) => void;
  selectedValue?: string;
};

const SelectComp = ({ items, placeholder, selectedValue, onSelect }: Props) => {
  return (
    <div>
      <Select value={selectedValue} onValueChange={onSelect}>
        <SelectTrigger className="w-[100%] border-black">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items?.map((value, index) => (
            <SelectItem key={index} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectComp;
