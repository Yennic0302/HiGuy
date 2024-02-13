/* eslint-disable prettier/prettier */
/* eslint-disable import/extensions */
"use client";
import { setPropertyUserData } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { styled } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "./style.css";

/* const getCurrentDate = (): string => {
  const date = new Date();
  const day = date.getDate().toString();
  const month = date.getMonth() + 1;
  const monthString = month.toString();
  const year = date.getFullYear().toString();

  const dayParsed = day.length < 2 ? `0${day}` : day;
  const monthParsed = monthString.length < 2 ? `0${monthString}` : monthString;

  return `${year}-${monthParsed}-${dayParsed}`;
}; */
const CssDatePicker = styled(DatePicker)({
  "& input": {
    color: "var(--text-primary)",
  },
  "& label": {
    color: "var(--secondary)",
  },

  "&:hover label": {
    color: "var(--text-primary)",
  },

  "& label.Mui-focused": {
    color: "var(--dropdown-background)",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "var(--dropdown-background)",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: "0px",
      border: "none",
      borderBottom: "1px solid",
      borderColor: "var(--secondary)",
    },
    "&:hover fieldset": {
      borderColor: "var(--text-primary)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--dropdown-background)",
    },
  },
});
// setBirthDay: Dispatch<SetStateAction<Dayjs | null>>;

const BirthDayPicker = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {
          <CssDatePicker
            label="birth day"
            sx={{
              width: "100%",
              color: "var(--text-primary)",
            }}
            closeOnSelect={true}
            format="DD/MM/YYYY"
            onChange={(date: any) =>
              dispatch(
                setPropertyUserData({
                  name: "birthDay",
                  value: date.$d.toISOString(),
                })
              )
            }
            defaultValue={dayjs(new Date())}
            maxDate={dayjs(new Date())}
            minDate={dayjs("1910-01-01")}
          />
        }
      </LocalizationProvider>
    </>
  );
};

export default BirthDayPicker;
