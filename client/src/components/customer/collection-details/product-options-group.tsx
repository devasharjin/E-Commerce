type ProductOptionsGroupProps = {
    value: string[];
    variant: "color" | "size";
    selectedValue: string;
    onSelect: (value: string) => void;
};

const ProductOptionsGroup = ({
    value,
    variant,
    selectedValue,
    onSelect,
}: ProductOptionsGroupProps) => {
    return (
        <div className="flex gap-2 flex-wrap">
            {value.map((item) => {
                const isActive = item === selectedValue;

                if (variant === "color") {
                    return (
                        <button
                            key={item}
                            type="button"
                            onClick={() => onSelect(item)}
                            style={{ backgroundColor: item }}
                            className={`h-8 w-8 rounded-full border-2 ${isActive ? "border-black" : "border-gray-300"
                                }`}
                        />
                    );
                }

                return (
                    <button
                        key={item}
                        type="button"
                        onClick={() => onSelect(item)}
                        className={`px-3 py-1 rounded-md border ${isActive
                                ? "bg-black text-white border-black"
                                : "border-gray-300 hover:border-black"
                            }`}
                    >
                        {item}
                    </button>
                );
            })}
        </div>
    );
};

export default ProductOptionsGroup;