import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import { Col, InputGroup, Label, Row, Button, Table } from "reactstrap";
import CustomAutoComplete from "../../../Component/MuiComponents/CustomAutoComplete";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../store/creators";
import CustomTextField from "../../../Component/MuiComponents/CustomTextField";
import CustomInput from "../../../Component/custom/CustomInput";
import { MdDelete } from "react-icons/md";
import LinerLoader from "../../../Component/loaders/LinerLoader";

const CreateOrder = ({ toggle }) => {
  const dispatch = useDispatch();
  const { login } = useSelector((state) => state?.login);
  const { isPostLoading } = useSelector((state) => state.entities?.bills);
  const { customers } = useSelector((state) => state.entities?.customers);
  const { items } = useSelector((state) => state.entities?.items);
  let data = {
    token: login?.token,
  };
  const customersProps = {
    options: customers?.data,
    getOptionLabel: (option) => option?.name,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const bills = {
      customer_id: values.customer_id,
      total_amount: Math.floor(values.total_amount),
      paid_amount: Math.floor(values.paid_amount),
      unpaid_amount: Math.floor(values.unpaid_amount),
      status: values.status,
      is_dummy: values.is_dummy ? 1 : 0,
      has_returned: false,
      discount: Math.floor(values.discount),
      items: values.items?.map((item) => ({
        item_id: item.item_id,
        quantity: item.quantity,
        price: item.price,
        unit: item.unit || "",
      })),
    };

    dispatch(
      actions.postBillsData({
        data,
        bills,
        toggle,
        setSubmitting,
      })
    );
    setSubmitting(true);
  };
  return (
    <div className="p-1">
      {isPostLoading && <LinerLoader />}
      <Formik
        initialValues={{
          customer_id: "",
          notes: "",
          total_amount: "0",
          status: "Pending",
          items: [],
          item_name: "",
          is_dummy: false,
          paid_amount:"0",
          unpaid_amount:"0",
          discount:"0"
        }}
        onSubmit={handleSubmit}
        validationSchema={Yup.object().shape({
          status: Yup.string().required("This Field is Mandatory"),
          total_amount: Yup.string().required("This Field is Mandatory"),
          items: Yup.array()
            .min(1, "At least one item is required")
            .required("Items are required"),
        })}
      >
        {(formProps) => {
          console.log("formProps.values", formProps.values);
          const totalAmount = formProps.values.items?.reduce(
            (sum, item) =>
              sum + (Number(item.price) * Number(item.quantity) || 0),
            0
          );
          formProps.values.total_amount = totalAmount;
          const totalQuantity = formProps.values?.items?.reduce(
            (sum, item) => sum + (parseInt(item.quantity) || 0),
            0
          );

          return (
            <div className="invoice-container">
              <Form>
                <Row className="form-group pt-2">
                  <Col md={3}>
                    <Label>
                      <Field type="checkbox" name="is_dummy" /> Is Dummy
                    </Label>
                  </Col>
                </Row>
                <Row className="form-group pt-2">
                  <Col md={6}>
                    <InputGroup>
                      <CustomAutoComplete
                        name="customer_id"
                        formProps={formProps}
                        defaultProps={customersProps}
                        label="Customer Name *"
                        value={formProps.values.customer_id}
                        variant="standard"
                      />
                    </InputGroup>
                  </Col>
                  <Col md={6}></Col>
                </Row>
                <hr />
                <Row className="form-group pt-2">
                  <Col md={12}>
                    <FieldArray
                      name="items"
                      render={(arrayHelpers) => (
                        <div>
                          <Label htmlFor="name" className="mr-2">
                            Add Items
                          </Label>
                          <Row>
                            <Col md={8}>
                              <InputGroup>
                                <Field
                                  component={CustomInput}
                                  type="text"
                                  list="itemdatalist"
                                  name="item_name"
                                  id="item_name"
                                  placeholder="Enter Item Name"
                                  className="form-control"
                                  value={formProps.values.item_name}
                                  onChange={formProps.handleChange}
                                  style={{
                                    borderRight: "1px solid lightblue",
                                  }}
                                  autoComplete="off"
                                />
                                {items?.data?.length > 0 && (
                                  <datalist id="itemdatalist">
                                    {items?.data
                                      .filter(
                                        (item) =>
                                          !formProps.values.items.some(
                                            (added) => added.name === item.name
                                          )
                                      )
                                      .map((item, index) => (
                                        <option key={index} value={item.name} />
                                      ))}
                                  </datalist>
                                )}
                              </InputGroup>
                            </Col>
                            <Col md={2}>
                              <Button
                                color="success"
                                size="small"
                                onClick={() => {
                                  const itemName = formProps.values.item_name;
                                  if (!itemName) return;
                                  const exists = formProps.values.items.some(
                                    (item) => item.name === itemName
                                  );
                                  if (exists) {
                                    formProps.setFieldValue("item_name", "");
                                    return;
                                  }
                                  const obj = items?.data.find(
                                    (o) => o.name === itemName
                                  );
                                  if (obj) {
                                    arrayHelpers.push({
                                      item_id: obj.id,
                                      name: obj.name,
                                      price: obj.price,
                                      quantity: 1,
                                      unit: "",
                                    });
                                  }
                                  formProps.setFieldValue("item_name", "");
                                }}
                                className="ml-2"
                              >
                                Add Item
                              </Button>
                            </Col>
                          </Row>

                          <div className="text-danger">
                            <ErrorMessage name="items" />
                          </div>
                          <div className="table-section">
                            <Table className="mt-3">
                              <thead>
                                <tr>
                                  <th>Item Name</th>
                                  <th>QTY</th>
                                  <th>UNIT</th>
                                  <th>PRICE</th>
                                  <th>TOTAL</th>
                                  <th>Delete</th>
                                </tr>
                              </thead>
                              <tbody>
                                {formProps.values.items.map(
                                  (product, index) => {
                                    const price = Number(product.price);
                                    const quantity = Number(product.quantity);
                                    const total = price * quantity;
                                    return (
                                      <tr key={index}>
                                        <td>
                                          <Field
                                            component={CustomInput}
                                            type="text"
                                            name={`items.${index}.name`}
                                            id="name"
                                            value={product.name}
                                            readOnly
                                            style={{ background: "#f5f5f5" }}
                                          />
                                        </td>
                                        <td>
                                          <Field
                                            component={CustomInput}
                                            type="number"
                                            min="1"
                                            name={`items.${index}.quantity`}
                                            id="quantity"
                                            placeholder="Enter Quantity"
                                          />
                                        </td>
                                        <td>
                                          <Field
                                            component={CustomInput}
                                            type="text"
                                            name={`items.${index}.unit`}
                                            id="unit"
                                            placeholder="Enter Unit"
                                          />
                                        </td>
                                        <td>
                                          <Field
                                            component={CustomInput}
                                            type="number"
                                            name={`items.${index}.price`}
                                            id="price"
                                            placeholder="Enter Price"
                                          />
                                        </td>
                                        <td>₹ {total}</td>
                                        <td>
                                          <Button
                                            color="danger"
                                            size="sm"
                                            onClick={() =>
                                              arrayHelpers.remove(index)
                                            }
                                          >
                                            <MdDelete size={20} />
                                          </Button>
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </tbody>
                              <tfoot>
                                <tr className="p-3"></tr>
                                <tr
                                  style={{
                                    borderBottom: "1px solid black",
                                  }}
                                >
                                  <td className="footer-subtotal">SUBTOTAL</td>
                                  <td className="footer-data">
                                    Qty {totalQuantity}
                                  </td>
                                  <td className="footer-data"></td>
                                  <td className="footer-data"></td>

                                  <td
                                    className="footer-data"
                                    style={{ textAlign: "center" }}
                                  >
                                    ₹ {formProps.values.total_amount}
                                  </td>
                                  <td className="footer-data"></td>
                                </tr>
                              </tfoot>
                            </Table>
                          </div>
                        </div>
                      )}
                    />
                  </Col>
                </Row>
                <Row style={{ justifyContent: "center" }} className="mt-5">
                  <Col md={4}>
                    <Button type="reset" color="danger" block>
                      <b>Reset</b>
                    </Button>
                  </Col>
                  <Col md={4}>
                    <Button
                      type="submit"
                      disabled={formProps.isSubmitting}
                      color="primary"
                      block
                    >
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default CreateOrder;
