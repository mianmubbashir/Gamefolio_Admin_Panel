type Type = "add" | "remove";

export type ProductCardProps = {
  image: string;
  price: string;
  itemType: Type;
  onActionClick: () => void;
  totalItems: number;
  onIncrement: () => void;
  onDecrement: () => void;
};
