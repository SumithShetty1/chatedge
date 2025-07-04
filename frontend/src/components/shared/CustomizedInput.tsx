import TextField from "@mui/material/TextField";

// Props type definition for the customized input
type Props = {
  name: string;
  type: string;
  label: string;
};

// Props type definition for the customized input
const CustomizedInput = (props: Props) => {
  return (
    <TextField
      margin="normal"
      name={props.name}
      label={props.label}
      type={props.type}
      slotProps={{
        inputLabel: {
          style: { color: "white" },
        },
        input: {
          style: {
            width: "100%",
            maxWidth: "400px",
            borderRadius: 10,
            fontSize: 20,
            color: "white",
          },
        },
      }}
    />
  );
};

export default CustomizedInput;
