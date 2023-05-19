import { Grid } from "@mantine/core";
import { ReactNode } from "react";

const defineGrid = (options: { columns: number; defenition: number[] }) => {
  return (props: { children: ReactNode[] }) => {
    const columns = props.children.map((e, i) => (
      <Grid.Col span={options.defenition[i]}>{e}</Grid.Col>
    ));

    return <Grid columns={options.columns}>{columns}</Grid>;
  };
};

export default defineGrid;
