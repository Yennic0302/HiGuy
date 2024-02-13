import { TextField, styled } from "@mui/material";

const CssTextField = styled(TextField)({
  "& input": {
    color: "var(--text-primary)",
    fontSize: "1rem",
  },
  "& label": {
    color: "var(--secondary)",
    fontSize: "1rem",
  },
  "&:hover label": {
    color: "var(--text-primary)",
  },
  "& label.Mui-focused": {
    color: "var(--dropdown-background-hover)",
    fontSize: "1.2rem",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "var(--secondary)",
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
      borderColor: "var(--dropdown-background-hover)",
    },
  },
});

export default CssTextField;
