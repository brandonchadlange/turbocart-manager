import ApplicationLayout from "@/components/layouts/application";
import {
  Anchor,
  Button,
  Card,
  Flex,
  Image,
  Loader,
  Modal,
  PasswordInput,
  Space,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { PaymentMethod } from "@prisma/client";
import axios from "axios";
import { useState } from "react";

const fetchPaymentMethod = async (props: {
  providerKey: string;
  onSuccess: (paymentMethod: PaymentMethod) => void;
  onNotFound: () => void;
}) => {
  try {
    const response = await axios.get<PaymentMethod>(
      "/api/payment-method/" + props.providerKey
    );
    props.onSuccess(response.data);
  } catch (err: any) {
    const status = err.response.status;

    if (status === 404) {
      props.onNotFound();
      return;
    }
  }
};

const YocoPayment = () => {
  const [rowLoading, setRowLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm({
    initialValues: {
      publicKey: "",
      secretKey: "",
    },
  });

  const [modalOpened, setModalOpened] = useState(false);

  const onRowClick = async () => {
    setRowLoading(true);

    fetchPaymentMethod({
      providerKey: "yoco",
      onSuccess(paymentMethod) {
        setRowLoading(false);

        const configuration = JSON.parse(paymentMethod.configuration);
        form.setFieldValue("publicKey", configuration.publicKey);
        form.setFieldValue("secretKey", configuration.secretKey);

        setModalOpened(true);
      },
      onNotFound() {
        setRowLoading(false);
        setModalOpened(true);
      },
    });
  };

  const onModalClose = () => {
    setModalOpened(false);
    form.reset();
  };

  const onFormSubmit = async (values: any) => {
    setSaving(true);

    const request = {
      configuration: JSON.stringify(values),
    };

    await axios.post("/api/payment-method/yoco", request);
    setSaving(false);
    onModalClose();
  };

  return (
    <>
      <tr style={{ cursor: "pointer" }} onClick={onRowClick}>
        <td>
          <Flex gap="sm" align="center">
            {rowLoading && <Loader variant="dots" />}
            {!rowLoading && (
              <>
                <Image width={40} src="/payment-methods/yoco-logo.svg" />
                <Text>Yoco</Text>
              </>
            )}
          </Flex>
        </td>
        <td>
          <Flex gap="xs" align="center" justify="end">
            <Card p={2} withBorder>
              <Image
                width={30}
                src="https://developer.yoco.com/img/design-resources/mastercard_colour.svg"
              />
            </Card>
            <Card p={2} withBorder>
              <Image
                width={30}
                src="https://developer.yoco.com/img/design-resources/visa_colour.svg"
              />
            </Card>
          </Flex>
        </td>
      </tr>
      <Modal
        title={<Text size="lg">Yoco setup</Text>}
        centered
        withCloseButton={false}
        opened={modalOpened}
        onClose={onModalClose}
      >
        <form onSubmit={form.onSubmit(onFormSubmit)}>
          <Stack>
            <TextInput
              {...form.getInputProps("publicKey")}
              label="Public key"
            />
            <PasswordInput
              {...form.getInputProps("secretKey")}
              label="Secret key"
            />
            <Anchor
              target="_blank"
              href="https://developer.yoco.com/online/resources/integration-keys/"
            >
              <Text size="sm">Where do I find my keys?</Text>
            </Anchor>
          </Stack>
          <Flex justify="end" mt="lg" gap="xs">
            <Button onClick={onModalClose} variant="default">
              Cancel
            </Button>
            <Button loading={saving} type="submit">
              Save
            </Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
};

const PaymentMethodsPage = () => {
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <ApplicationLayout>
      <h1>Payment Methods</h1>
      <Space h={20} />
      <Card p={0}>
        <Table withBorder>
          <tbody>
            <YocoPayment />
          </tbody>
        </Table>
      </Card>
    </ApplicationLayout>
  );
};

export default PaymentMethodsPage;
