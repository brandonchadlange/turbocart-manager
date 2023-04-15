interface IBasketService<AddItemHandler> {
  addItemHandler: AddItemHandler;
}

type StudentItem = {
  studentId: string;
  menuItemId: string;
};

type AddStudentItemHandler = (item: StudentItem) => void;

const StudentBasketService: IBasketService<AddStudentItemHandler> = {
  addItemHandler(item) {},
};

export type BasketContext = "student" | "combined";

const BasketFactory = () => {};
