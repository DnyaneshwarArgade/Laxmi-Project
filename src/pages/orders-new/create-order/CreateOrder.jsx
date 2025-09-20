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
  const customersProps = {
    options: customers?.data,
    getOptionLabel: (option) => option?.name,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const finalStatus =
      Number(values.unpaid_amount) === 0 ? "Completed" : values.status;
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
              items: [
                {
                  item_id: "",
                  quantity: "1",
                  price: "0",
                  unit: "",
                },
              ],
              is_dummy: false,
              paid_amount: "0",
              unpaid_amount: "0",
              discount: "0",
            }}
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              customer_id: Yup.string().required("This Field is Mandatory"),
              total_amount: Yup.string().required("This Field is Mandatory"),
            //   items: Yup.array()
            //     .of(
            //       Yup.object().shape({
            //         item_id: Yup.string().required("Item is required"),
            //         quantity: Yup.number().min(1, "Quantity must be at least 1"),
            //         price: Yup.number(),
            //         unit: Yup.string(),
            //       })
            //     )
            //     .min(1, "At least one item is required")
            //     .required("Items are required"),
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
                <Form>
                  <Row className="mb-3">
                    <Col className="text-right">
                      <Label check>
                        <Field
                          type="checkbox"
                          name="is_dummy"
                          className="mr-2"
                        />{" "}
                        Is Dummy
                      </Label>
                    </Col>
                  </Row>

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

                  <FieldArray
                    name="items"
                    render={(arrayHelpers) => (
                      <div>
                        <ErrorMessage name="items" className="text-danger" />
                        <div
                          className="table-responsive"
                          style={{
                            overflowX: "auto",
                            width: "100%",
                            display: "block",
                          }}
                        >
                          <Table
                            bordered
                            hover
                            className="mt-3 align-middle"
                            size="sm"
                            style={{
                              tableLayout: "fixed",
                              minWidth: "600px",
                              width: "100%",
                            }}
                          >
                            <colgroup>
                              <col style={{ width: "50px" }} />
                              <col style={{ width: "150px" }} />
                              <col style={{ width: "50px" }} />
                              <col style={{ width: "80px" }} />
                              <col style={{ width: "100px" }} />
                              <col style={{ width: "100px" }} />
                            </colgroup>
                            <thead
                              className="table-light"
                              style={{ fontSize: "0.8rem" }}
                            >
                              <tr>
                                <th style={{ width: "50px" }}></th>
                                <th style={{ width: "150px" }}>Item Name</th>
                                <th
                                  style={{ width: "50px", textAlign: "center" }}
                                >
                                  QTY
                                </th>
                                <th style={{ width: "100px" }}>Unit</th>
                                <th style={{ width: "80px" }}>Price</th>
                                <th style={{ width: "100px" }}>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formProps.values.items.map((product, index) => {
                                const total =
                                  Number(product.price) *
                                  Number(product.quantity);
                                return (
                                  <tr
                                    key={index}
                                    style={{ fontSize: "0.75rem" }}
                                  >
                                    <td
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <Button
                                        color="danger"
                                        size="sm"
                                        className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                                        style={{
                                          width: "30px",
                                          height: "30px",
                                        }}
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        }
                                      >
                                        <MdDelete size={19} />
                                      </Button>
                                    </td>
                                    <td
                                      style={{
                                        width: "150px",
                                        verticalAlign: "middle", // optional, for better alignment
                                      }}
                                    >
                                      <CustomAutoComplete
                                        name={`items.${index}.item_id`}
                                        formProps={formProps}
                                        defaultProps={{
                                          options: items?.data,
                                          getOptionLabel: (option) =>
                                            option?.name || "",
                                        }}
                                        label="Item Name"
                                        value={product.item_id}
                                        onChange={(e, value) => {
                                          if (value) {
                                            formProps.setFieldValue(
                                              `items.${index}.item_id`,
                                              value.id
                                            );
                                            formProps.setFieldValue(
                                              `items.${index}.name`,
                                              value.name
                                            );
                                            formProps.setFieldValue(
                                              `items.${index}.price`,
                                              value.price
                                            );
                                            formProps.setFieldValue(
                                              `items.${index}.unit`,
                                              value.unit || ""
                                            );
                                          } else {
                                            formProps.setFieldValue(
                                              `items.${index}.item_id`,
                                              ""
                                            );
                                            formProps.setFieldValue(
                                              `items.${index}.name`,
                                              ""
                                            );
                                            formProps.setFieldValue(
                                              `items.${index}.price`,
                                              ""
                                            );
                                            formProps.setFieldValue(
                                              `items.${index}.unit`,
                                              ""
                                            );
                                          }
                                        }}
                                        style={{ width: "100%" }}
                                      />
                                    </td>
                                    <td
                                      style={{
                                        width: "50px",
                                        textAlign: "center",
                                      }}
                                    >
                                      <Field
                                        component={CustomInput}
                                        type="number"
                                        min="1"
                                        name={`items.${index}.quantity`}
                                        className="p-1"
                                        style={{
                                          width: "100%",
                                          textAlign: "center",
                                        }}
                                      />
                                    </td>
                                    <td style={{ width: "100px" }}>
                                      <Field
                                        component={CustomInput}
                                        type="text"
                                        name={`items.${index}.unit`}
                                        placeholder="Unit"
                                        className="p-1"
                                        style={{ width: "100%" }}
                                      />
                                    </td>
                                    <td style={{ width: "80px" }}>
                                      <Field
                                        component={CustomInput}
                                        type="number"
                                        name={`items.${index}.price`}
                                        className="p-1"
                                        style={{
                                          width: "100%",
                                          textAlign: "center",
                                        }}
                                      />
                                    </td>
                                    <td
                                      style={{
                                        width: "100px",
                                        textAlign: "center",
                                        fontSize: "18px",
                                      }}
                                    >
                                      <b>&#8377;&nbsp;{total}</b>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>

                            <tfoot>
                              <tr
                                className="fw-bold"
                                style={{ fontSize: "0.8rem" }}
                              >
                                <td colSpan="2">
                                  Subtotal (Qty: {totalQuantity})
                                </td>
                                <td colSpan="3"></td>
                                <td
                                  style={{
                                    width: "100px",
                                    textAlign: "center",
                                    fontSize: "18px",
                                  }}
                                >
                                  &#8377;&nbsp;{formProps.values.total_amount}
                                </td>
                              </tr>

                              <tr>
                                <td colSpan="6">
                                  <div
                                    className="d-flex justify-content-between align-items-center flex-wrap"
                                    style={{ fontSize: "0.8rem" }}
                                  >
                                    <span className="fw-bold">Paid Amount</span>
                                    <Field
                                      component={CustomInput}
                                      type="number"
                                      name="paid_amount"
                                      placeholder="Enter Paid Amount"
                                      className="form-control"
                                      style={{
                                        maxWidth: "120px",
                                        flex: "1",
                                        marginTop: "5px",
                                      }}
                                      onChange={(e) => {
                                        const paid =
                                          Number(e.target.value) || 0;
                                        formProps.setFieldValue(
                                          "paid_amount",
                                          paid
                                        );
                                        const unpaid =
                                          formProps.values.total_amount - paid;
                                        formProps.setFieldValue(
                                          "unpaid_amount",
                                          unpaid >= 0 ? unpaid : 0
                                        );
                                      }}
                                    />
                                  </div>
                                </td>
                              </tr>

                              <tr>
                                <td colSpan="6">
                                  <div
                                    className="d-flex justify-content-between align-items-center flex-wrap"
                                    style={{ fontSize: "0.8rem" }}
                                  >
                                    <span className="fw-bold">
                                      Unpaid Amount
                                    </span>
                                    <span className="fw-bold text-danger">
                                      ₹ {formProps.values.unpaid_amount}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            </tfoot>
                          </Table>
                        </div>
                      </div>
                    )}
                  />

                  <div className="d-flex gap-2 mt-4">
                    <Button
                      type="submit"
                      disabled={formProps.isSubmitting}
                      className="flex-fill"
                      style={{
                        background: "linear-gradient(90deg, #4a6cf7, #7b42f6)",
                        border: "none",
                        color: "white",
                      }}
                    >
                      Submit
                    </Button>
                    <Button type="reset" color="danger" className="flex-fill">
                      Reset
                    </Button>
                  </div>
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
