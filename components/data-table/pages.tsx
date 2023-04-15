import { Select } from "@mantine/core";

type PagesComponentProps = {
  itemsPerPage: {
    get: string;
    set: (itemsPerPage: string) => void;
  };
};

const PagesComponent = (props: PagesComponentProps) => {
  const { get, set } = props.itemsPerPage;

  return (
    <Select
      value={get}
      onChange={(e) => set(e!)}
      w={60}
      data={["5", "10", "20"]}
      size="xs"
    />
  );
};

export default PagesComponent;
