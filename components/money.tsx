const Money = ({
  children,
  currency,
}: {
  children: number;
  currency: string;
}) => {
  const currencyFormatter = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    currencyDisplay: "narrowSymbol",
  });

  const valueInFull = parseFloat((children / 100).toFixed(2));
  const valueFormatted = currencyFormatter.format(valueInFull);
  return <>{valueFormatted}</>;
};

export default Money;
