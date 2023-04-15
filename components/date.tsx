import { DateTime } from "luxon";

const DateFormat = ({ children }: { children: string }) => {
  const dateFormatted = DateTime.fromJSDate(new Date(children)).toLocaleString({
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return <>{dateFormatted}</>;
};

export default DateFormat;
