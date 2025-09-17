import { Input } from "reactstrap";

const CustomInput = ({ field, form: { touched, errors }, ...props }) => (
  <Input {...field} {...props} />
);

export default CustomInput;
