import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import { Col, Row, Button, Table, Card, CardBody, Label } from "reactstrap";
import CustomAutoComplete from "../../../Component/MuiComponents/CustomAutoComplete";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../store/creators";
import CustomInput from "../../../Component/custom/CustomInput";
import { MdDelete } from "react-icons/md";
import LinerLoader from "../../../Component/loaders/LinerLoader";

const CreateOrder = ({ toggle }) => {
  const dispatch = useDispatch();
  const { login } = useSelector((state) => state?.login);
  const { isPostLoading } = useSelector((state) => state.entities?.bills);
  const { customers } = useSelector((state) => state.entities?.customers);
  const { items } = useSelector((state) => state.entities?.items);

  const data = { token: login?.token };
  const customersProps = { options: customers?.data, getOptionLabel: (option) => option?.name };

  const handleSubmit = (values, { setSubmitting }) => {
    const finalStatus = Number(values.unpaid_amount) === 0 ? "Completed" : values.status;
    const bills = {
      customer_id: values.customer_id,
      date: values.date,
      total_amount: Math.floor(values.total_amount),
      paid_amount: Math.floor(values.paid_amount),
      unpaid_amount: Math.floor(values.unpaid_amount),
      status: finalStatus,
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
    dispatch(actions.postBillsData({ data, bills, toggle, setSubmitting }));
    setSubmitting(true);
  };

  return (
    <div className="p-2">
      {isPostLoading && <LinerLoader />}
      <Card className="shadow-sm border-0">
        <CardBody>
          <Formik
            initialValues={{
              customer_id: "",
              date: "",
              notes: "",
              total_amount: "0",
              status: "Pending",
              items: [],
              item_name: "",
              is_dummy: false,
              paid_amount: "0",
              unpaid_amount: "0",
              discount: "0",
            }}
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              date: Yup.string(),
              status: Yup.string().required("This Field is Mandatory"),
              total_amount: Yup.string().required("This Field is Mandatory"),
              items: Yup.array().min(1, "At least one item is required").required("Items are required"),
            })}
          >
            {(formProps) => {
              const totalAmount = formProps.values.items?.reduce(
                (sum, item) => sum + (Number(item.price) * Number(item.quantity) || 0),
                0
              );
              formProps.values.total_amount = totalAmount;

              const totalQuantity = formProps.values?.items?.reduce(
                (sum, item) => sum + (parseInt(item.quantity) || 0),
                0
              );

              return (
                <Form>
                  {/* Dummy Checkbox */}
                  <Row className="mb-3">
                    <Col>
                      <Label check>
                        <Field type="checkbox" name="is_dummy" className="mr-2" /> Is Dummy
                      </Label>
                    </Col>
                  </Row>

                  {/* Customer & Date */}
                  <Row className="mb-3">
                    <Col md={6} xs={12} className="mb-2">
                      <CustomAutoComplete
                        name="customer_id"
                        formProps={formProps}
                        defaultProps={customersProps}
                        label="Customer Name *"
                        value={formProps.values.customer_id}
                      />
                    </Col>
                    <Col md={6} xs={12}>
                      <Field
                        component={CustomInput}
                        type="date"
                        name="date"
                        id="date"
                        className="form-control"
                        value={formProps.values.date}
                        onChange={formProps.handleChange}
                      />
                      <div className="text-danger">
                        <ErrorMessage name="date" />
                      </div>
                    </Col>
                  </Row>

                  <hr />

                  {/* Items Section */}
                  <FieldArray
                    name="items"
                    render={(arrayHelpers) => (
                      <div>
                        <Row className="align-items-center mb-2">
                          <Col md={8} xs={12} className="mb-2">
                            <Field
                              component={CustomInput}
                              type="text"
                              list="itemdatalist"
                              name="item_name"
                              placeholder="Enter Item Name"
                              className="form-control"
                              value={formProps.values.item_name}
                              onChange={formProps.handleChange}
                              autoComplete="off"
                            />
                            {items?.data?.length > 0 && (
                              <datalist id="itemdatalist">
                                {items?.data
                                  .filter((item) => !formProps.values.items.some((added) => added.name === item.name))
                                  .map((item, index) => (
                                    <option key={index} value={item.name} />
                                  ))}
                              </datalist>
                            )}
                          </Col>
                          <Col md={4} xs={12}>
                            <Button
                              color="success"
                              block
                              onClick={() => {
                                const itemName = formProps.values.item_name;
                                if (!itemName) return;
                                const exists = formProps.values.items.some((item) => item.name === itemName);
                                if (exists) {
                                  formProps.setFieldValue("item_name", "");
                                  return;
                                }
                                const obj = items?.data.find((o) => o.name === itemName);
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
                            >
                              Add Item
                            </Button>
                          </Col>
                        </Row>

                        <ErrorMessage name="items" className="text-danger" />

                        {/* Table */}
                        <div className="table-responsive">
                          <Table bordered hover className="mt-3 align-middle" size="sm">
                            <thead className="table-light" style={{ fontSize: "0.8rem" }}>
                              <tr>
                                <th>Item Name</th>
                                <th>QTY</th>
                                <th>Unit</th>
                                <th>Price</th>
                                <th>Total</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formProps.values.items.map((product, index) => {
                                const total = Number(product.price) * Number(product.quantity);
                                return (
                                  <tr key={index} style={{ fontSize: "0.75rem" }}>
                                    <td>
                                      <Field
                                        component={CustomInput}
                                        type="text"
                                        name={`items.${index}.name`}
                                        value={product.name}
                                        readOnly
                                        className="form-control-plaintext p-1"
                                      />
                                    </td>
                                    <td>
                                      <Field component={CustomInput} type="number" min="1" name={`items.${index}.quantity`} className="p-1" />
                                    </td>
                                    <td>
                                      <Field component={CustomInput} type="text" name={`items.${index}.unit`} className="p-1" />
                                    </td>
                                    <td>
                                      <Field component={CustomInput} type="number" name={`items.${index}.price`} className="p-1" />
                                    </td>
                                    <td>₹ {total}</td>
                                    <td>
                                      <Button color="danger" size="sm" onClick={() => arrayHelpers.remove(index)}>
                                        <MdDelete size={16} />
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>

                            {/* Footer */}
                            <tfoot>
                              <tr className="fw-bold" style={{ fontSize: "0.8rem" }}>
                                <td>Subtotal</td>
                                <td>Qty {totalQuantity}</td>
                                <td></td>
                                <td></td>
                                <td>₹ {formProps.values.total_amount}</td>
                                <td></td>
                              </tr>

                              {/* Paid Amount Row */}
                              <tr>
                                <td colSpan="6">
                                  <div className="d-flex justify-content-between align-items-center flex-wrap" style={{ fontSize: "0.8rem" }}>
                                    <span className="fw-bold">Paid Amount</span>
                                    <Field
                                      component={CustomInput}
                                      type="number"
                                      name="paid_amount"
                                      placeholder="Enter Paid Amount"
                                      className="form-control"
                                      style={{ maxWidth: "120px", flex: "1", marginTop: "5px" }}
                                      onChange={(e) => {
                                        const paid = Number(e.target.value) || 0;
                                        formProps.setFieldValue("paid_amount", paid);
                                        const unpaid = formProps.values.total_amount - paid;
                                        formProps.setFieldValue("unpaid_amount", unpaid >= 0 ? unpaid : 0);
                                      }}
                                    />
                                  </div>
                                </td>
                              </tr>

                              {/* Unpaid Amount Row */}
                              <tr>
                                <td colSpan="6">
                                  <div className="d-flex justify-content-between align-items-center flex-wrap" style={{ fontSize: "0.8rem" }}>
                                    <span className="fw-bold">Unpaid Amount</span>
                                    <span className="fw-bold text-danger">₹ {formProps.values.unpaid_amount}</span>
                                  </div>
                                </td>
                              </tr>
                            </tfoot>
                          </Table>
                        </div>
                      </div>
                    )}
                  />

                  {/* Buttons */}
                  <Row className="mt-4">
                    <Col md={6} xs={12} className="mb-2">
                      <Button type="reset" color="danger" block>
                        Reset
                      </Button>
                    </Col>
                    <Col md={6} xs={12}>
                      <Button
                        type="submit"
                        disabled={formProps.isSubmitting}
                        block
                        style={{
                          background: "linear-gradient(90deg, #4a6cf7, #7b42f6)",
                          border: "none",
                          color: "white",
                        }}
                      >
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateOrder;
