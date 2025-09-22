import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import { Col, Row, Button, Table, Card, CardBody, Label } from "reactstrap";
import CustomAutoComplete from "../../../Component/MuiComponents/CustomAutoComplete";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../store/creators";
import CustomInput from "../../../Component/custom/CustomInput";
import { MdDelete } from "react-icons/md";
import LinerLoader from "../../../Component/loaders/LinerLoader";
import { Autocomplete, TextField } from "@mui/material";
import "./CreateOrder.css";

const UpdateOrder = ({ toggle, prevOrder }) => {
  const dispatch = useDispatch();
  const { login } = useSelector((state) => state?.login);
  const { isUpdateLoading } = useSelector((state) => state.entities?.bills);
  const { customers } = useSelector((state) => state.entities?.customers);
  const { items } = useSelector((state) => state.entities?.items);

  const data = { token: login?.token, id: prevOrder?.id };
  const truncateWords = (str, numWords = 10) => {
    if (!str) return "";
    const words = str.split(" ").filter(Boolean);
    return words.length > numWords
      ? words.slice(0, numWords).join(" ") + "..."
      : str;
  };

  const customersProps = {
    options: customers?.data,
    getOptionLabel: (option) => truncateWords(option?.name),
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const finalStatus =
      Number(values.unpaid_amount) === 0 ? "Completed" : "Pending";
    const bills = {
      customer_id: values.customer_id,
      date: values.date,
      total_amount: Math.floor(values.total_amount),
      paid_amount: Math.floor(values.paid_amount),
      unpaid_amount: Math.floor(values.unpaid_amount),
      status: finalStatus,
      is_dummy: values.is_dummy ? 1 : 0,
      has_returned: prevOrder?.has_returned || false,
      discount: Math.floor(values.discount),
      items: values.items?.map((item) => ({
        item_id: item.item_id,
        quantity: item.quantity,
        price: item.price,
        unit: item.unit || "",
      })),
    };
    dispatch(actions.updateBillsData({ data, bills, toggle, setSubmitting }));
    setSubmitting(true);
  };

  // Prepare initial values from prevOrder
  const initialValues = prevOrder
    ? {
        customer_id: prevOrder.customer_id || "",
        date: prevOrder.date || "",
        notes: prevOrder.notes || "",
        total_amount: prevOrder.total_amount || "0",
        status: prevOrder.status || "Pending",
        items:
          prevOrder.items?.map((item) => ({
            item_id: item.item_id || item.id || "",
            quantity: item.quantity?.toString() || "1",
            price: item.price?.toString() || "0",
            unit: item.unit || "",
          })) || [
            {
              item_id: "",
              quantity: "1",
              price: "0",
              unit: "",
            },
          ],
        is_dummy: !!prevOrder.is_dummy,
        paid_amount: prevOrder.paid_amount?.toString() || "0",
        unpaid_amount: prevOrder.unpaid_amount?.toString() || "0",
        discount: prevOrder.discount?.toString() || "0",
      }
    : {
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
      };

  return (
    <div className="create-order-container">
      {isUpdateLoading && <LinerLoader />}
      <Card className="create-order-card">
        <CardBody>
          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              customer_id: Yup.string().required("Customer Name is required"),
              items: Yup.array().of(
                Yup.object().shape({
                  item_id: Yup.string().required("Item Name is required"),
                })
              ),
              total_amount: Yup.string().required("This Field is Mandatory"),
            })}
          >
            {(formProps) => {
              const totalAmount = formProps.values.items?.reduce(
                (sum, item) =>
                  sum + (Number(item.price) * Number(item.quantity) || 0),
                0
              );
              formProps.values.total_amount = totalAmount;

              // Set unpaid_amount to total_amount minus paid_amount, or total_amount if paid is 0
              const paid = Number(formProps.values.paid_amount) || 0;
              formProps.values.unpaid_amount = paid === 0 ? totalAmount : Math.max(totalAmount - paid, 0);

              const totalQuantity = formProps.values?.items?.reduce(
                (sum, item) => sum + (parseInt(item.quantity) || 0),
                0
              );

              return (
                <Form className="create-order-form">
                  <Row className="create-order-row">
                    <Col className="text-right">
                      <Label check className="create-order-checkbox-label">
                        <Field
                          type="checkbox"
                          name="is_dummy"
                          className="create-order-checkbox"
                        />{" "}
                        Is Dummy
                      </Label>
                    </Col>
                  </Row>

                  <Row className="create-order-row">
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
                        placeholder="dd-mm-yyyy"
                        pattern="\d{4}-\d{2}-\d{2}"
                        inputMode="numeric"
                      />
                      <div className="create-order-error">
                        <ErrorMessage name="date" />
                      </div>
                    </Col>
                  </Row>

                  <FieldArray
                    name="items"
                    render={(arrayHelpers) => (
                      <div>
                        {/* Fix the error by using a custom error renderer for the items array */}
                        {formProps.errors.items && formProps.touched.items && (
                          <div className="create-order-error">
                            {typeof formProps.errors.items === "string"
                              ? formProps.errors.items
                              : "Please check all item fields"}
                          </div>
                        )}
                        <div className="create-order-table-container">
                          <Table
                            bordered
                            className="create-order-table align-middle"
                            size="sm"
                          >
                            <thead>
                              <tr>
                                <th></th>
                                <th>Sr No</th>
                                <th>Item Name</th>
                                <th>QTY</th>
                                <th>Unit</th>
                                <th>Price</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formProps.values.items.map((product, index) => {
                                const total =
                                  Number(product.price) *
                                  Number(product.quantity);
                                return (
                                  <tr key={index}>
                                    <td className="text-center">
                                      <Button
                                        color="danger"
                                        size="sm"
                                        className="create-order-delete-btn"
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        }
                                      >
                                        <MdDelete size={19} />
                                      </Button>
                                    </td>
                                    <td className="create-order-sr-no">
                                      <b>{index + 1}</b>
                                    </td>
                                    <td className="create-order-item-cell">
                                      <Autocomplete
                                        options={items?.data || []}
                                        getOptionLabel={(option) =>
                                          option?.name || ""
                                        }
                                        value={
                                          items?.data?.find(
                                            (item) =>
                                              item.id === product.item_id
                                          ) || null
                                        }
                                        onChange={(event, value) => {
                                          if (
                                            value &&
                                            typeof value === "object"
                                          ) {
                                            formProps.setFieldValue(
                                              `items.${index}.item_id`,
                                              value.id ?? ""
                                            );
                                            formProps.setFieldValue(
                                              `items.${index}.price`,
                                              value.price ?? ""
                                            );
                                            formProps.setFieldValue(
                                              `items.${index}.unit`,
                                              value.unit ?? ""
                                            );
                                          } else {
                                            formProps.setFieldValue(
                                              `items.${index}.item_id`,
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
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="Item Name *"
                                            fullWidth
                                            size="small"
                                            error={Boolean(
                                              formProps.errors.items?.[index]
                                                ?.item_id &&
                                                formProps.touched.items?.[index]
                                                  ?.item_id
                                            )}
                                          />
                                        )}
                                        sx={{ width: "100%" }}
                                      />
                                      <div className="create-order-field-error">
                                        {formProps.errors.items?.[index]
                                          ?.item_id &&
                                        formProps.touched.items?.[index]
                                          ?.item_id ? (
                                          <div>
                                            {
                                              formProps.errors.items[index]
                                                .item_id
                                            }
                                          </div>
                                        ) : null}
                                      </div>
                                    </td>
                                    <td className="create-order-quantity-cell">
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
                                    <td className="create-order-unit-cell">
                                      <Field
                                        component={CustomInput}
                                        type="text"
                                        name={`items.${index}.unit`}
                                        placeholder="Unit"
                                        className="p-1"
                                        style={{ width: "100%" }}
                                      />
                                    </td>
                                    <td className="create-order-price-cell">
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
                                    <td className="create-order-total-cell">
                                      &#8377;&nbsp;{total}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </div>
                        <div className="create-order-add-item-btn d-flex justify-content-end">
                          <Button
                            color="primary"
                            size="sm"
                            onClick={() =>
                              arrayHelpers.push({
                                item_id: "",
                                quantity: "1",
                                price: "0",
                                unit: "",
                              })
                            }
                          >
                            Add Item
                          </Button>
                        </div>
                        {/* Mobile-friendly summary section */}
                        <div className="create-order-summary-mobile">
                          <div className="create-order-summary-row">
                            <div className="create-order-summary-label">
                              Subtotal (Qty: {totalQuantity})
                            </div>
                            <div className="create-order-summary-value">
                              ₹ {formProps.values.total_amount}
                            </div>
                          </div>
                          <div className="create-order-summary-row">
                            <div className="create-order-summary-label">
                              Paid Amount
                            </div>
                            <div className="create-order-summary-input">
                              <Field
                                component={CustomInput}
                                type="number"
                                name="paid_amount"
                                placeholder="Enter Paid Amount"
                                className="form-control paid-amount-input"
                                onChange={(e) => {
                                  const paid = Number(e.target.value) || 0;
                                  formProps.setFieldValue("paid_amount", paid);
                                  const unpaid = paid === 0
                                    ? formProps.values.total_amount
                                    : Math.max(formProps.values.total_amount - paid, 0);
                                  formProps.setFieldValue("unpaid_amount", unpaid);
                                }}
                              />
                            </div>
                          </div>
                          <div className="create-order-summary-row">
                            <div className="create-order-summary-label">
                              Unpaid Amount
                            </div>
                            <div className="create-order-summary-value">
                              ₹ {formProps.values.unpaid_amount}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                  <div className="create-order-form-buttons">
                    <Button type="reset" color="danger">
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      disabled={formProps.isSubmitting}
                      className="create-order-submit-btn"
                    >
                      Update
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

export default UpdateOrder;
