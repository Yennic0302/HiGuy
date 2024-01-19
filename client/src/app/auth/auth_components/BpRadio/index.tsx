import { Radio, RadioProps, styled } from "@mui/material";

const BpIcon = styled("span")(() => ({
  borderRadius: "50%",
  width: 20,
  height: 20,
  border: "3px solid var(--dropdown-background) ",
  "input:hover ~ &": {
    backgroundColor: "var(--input-background)",
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "transparent",
  border: "3px solid var(--dropdown-background)",

  "&:before": {
    display: "block",
    position: "relative",
    left: "2.6px",
    top: "3px",
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "var(--dropdown-background)",
    content: '""',
  },
});

// Inspired by blueprintjs
export default function BpRadio(props: RadioProps) {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
}
