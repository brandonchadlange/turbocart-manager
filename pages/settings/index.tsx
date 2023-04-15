import ApplicationLayout from "@/components/layouts/application";
import { Card, Center, Grid, Stack, UnstyledButton } from "@mantine/core";
import { HierachyLevel } from "@prisma/client";
import axios from "axios";
import { useQuery } from "react-query";

const getHierachyLevels = async () => {
  const response = await axios.get<HierachyLevel[]>("/api/hierachy/level");
  return response.data;
};

const Settings = () => {
  const levelsQuery = useQuery("hierachy-levels", getHierachyLevels, {
    initialData: [],
  });
  const levels = levelsQuery.data || [];

  return (
    <ApplicationLayout>
      <h1>Settings Page</h1>
      <Card withBorder>
        <h2>Hierachy</h2>
        <h3>Levels</h3>
        <Grid columns={3}>
          <Grid.Col span={1}>
            <Stack spacing="xs">
              {levels.map((level) => (
                <Card withBorder key={level.id}>
                  {level.name}
                </Card>
              ))}
              <UnstyledButton>
                <Card withBorder>
                  <Center>Add Level</Center>
                </Card>
              </UnstyledButton>
            </Stack>
          </Grid.Col>
          <Grid.Col span={2}></Grid.Col>
        </Grid>
      </Card>
    </ApplicationLayout>
  );
};

export default Settings;
