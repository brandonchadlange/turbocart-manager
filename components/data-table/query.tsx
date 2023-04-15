import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons";

type QueryComponentProps = {
  query: {
    get: string;
    set: (query: string) => void;
  };
};

const QueryComponent = (props: QueryComponentProps) => {
  const { get, set } = props.query;

  return (
    <TextInput
      icon={<IconSearch />}
      type="search"
      placeholder="search..."
      value={get}
      onChange={(e) => set(e.target.value)}
    />
  );
};

export default QueryComponent;
