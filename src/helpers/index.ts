import { format, parseISO } from "date-fns";

export const formatDate = (inputDate: string) => {
  const date = new Date(inputDate);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  // Function to get the ordinal suffix (st, nd, rd, th)
  const getOrdinalSuffix = (num: number) => {
    if (num > 3 && num < 21) return "th"; // Covers 11th, 12th, 13th
    switch (num % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
};

export function formatEventDate(date?: string) {
  const parsedDate = date ? parseISO(date) : new Date();

  return {
    day: format(parsedDate, "d"),
    monthYear: format(parsedDate, "MMMM yyyy"),
    time: format(parsedDate, "h:mm a"),
  };
}

export const formatDateTime = ({
  date,
  formatDate,
}: {
  date: string | Date;
  formatDate: string;
}) => {
  const newDate = new Date(date);

  if (isNaN(newDate.getTime())) {
    return "Invalid Date Time";
  }

  return format(newDate, formatDate);
};
