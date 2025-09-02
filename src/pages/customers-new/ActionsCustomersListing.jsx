import { useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../store/creators";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  InputGroup,
  Label,
} from "reactstrap";
import Swal from "sweetalert2";
import CustomTextField from "../../Component/MuiComponents/CustomTextField";
import { FaEdit, FaTrash } from "react-icons/fa";
import LinerLoader from "../../Component/loaders/LinerLoader";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function ActionsCustomersListing(props) {
  const dispatch = useDispatch();
  const { isUpdateLoading } = useSelector((state) => state.entities?.customers);

  const { login } = useSelector((state) => state?.login);

  let data = {
    token: login?.token,
    id: props.data?.id,
  };

  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  async function deleteSelectedItem(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(actions.deleteCustomersData({ id, data }));
      }
    });
  }

  const handleSubmit = (values, { setSubmitting }) => {
    let customers = {
      name: values.name,
      phone: values.phone,
      address: values.address,
    };

    dispatch(
      actions.updateCustomersData({ data, customers, toggle, setSubmitting })
    );
    setSubmitting(true);
    return;
  };

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ gap: "0.5rem" }}
      >
        <button
          className="editButton"
          title="Edit"
          onClick={toggle}
          style={{
            width: 30,
            height: 30,
            minWidth: 30,
            minHeight: 30,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#dbeafe",
            border: "none",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            padding: 0,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          <EditIcon style={{ color: "#1369f5ff", fontSize: 16 }} />
        </button>
        <button
          className="deleteButton"
          title="Delete"
          onClick={() => {
            deleteSelectedItem(data.id);
          }}
          style={{
            width: 32,
            height: 32,
            minWidth: 32,
            minHeight: 32,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#dbeafe",
            border: "none",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            padding: 0,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          <FaTrash style={{ color: "#ef4444", fontSize: 16 }} />
        </button>
      </div>

      <Modal className="modal-lg" isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} className="d-flex align-items-center">
          Edit Customer
        </ModalHeader>
        {isUpdateLoading && <LinerLoader />}
        <ModalBody className="">
          <Formik
            initialValues={{
              name: props.data?.name ?? "",
              phone: props.data?.phone ?? "",
              address: props.data?.address ?? "",
            }}
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              name: Yup.string().required("This Field is Mandatory"),
              phone: Yup.string()
                .trim()
                .required("Phone is required")
                .test(
                  "is-10-digits",
                  "Phone must be exactly 10 digits",
                  (val) => {
                    if (!val) return false;
                    const digits = val.replace(/\D/g, ""); // keep only numbers
                    return digits.length === 10;
                  }
                ),
            })}
          >
            {(formProps) => {
              return (
                <Form>
                  <Row className="form-group">
                    <Col md={6} className="mt-3">
                      <InputGroup>
                        <CustomTextField
                          formProps={formProps}
                          name="name"
                          label="Enter Name *"
                        />
                      </InputGroup>
                    </Col>
                    <Col md={6} className="mt-3">
                      <InputGroup>
                        <CustomTextField
                          formProps={formProps}
                          name="phone"
                          label="Enter Phone *"
                          type="number"
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row className="form-group">
                    <Col md={12} className="mt-3">
                      <InputGroup>
                        <CustomTextField
                          formProps={formProps}
                          name="address"
                          label="Enter Address "
                        />
                      </InputGroup>
                    </Col>
                  </Row>

                  <Row style={{ justifyContent: "center" }} className="mt-3">
                    <Col md={4}>
                      <Button
                        type="submit"
                        disabled={formProps.isSubmitting}
                        color="primary"
                        block
                        className="mt-3"
                      >
                        Submit
                      </Button>
                    </Col>
                    <Col md={4}>
                      <Button
                        type="reset"
                        color="danger"
                        block
                        className="mt-3"
                      >
                        <b>Reset</b>
                      </Button>
                    </Col>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </ModalBody>
        <ModalFooter>{isUpdateLoading && <LinerLoader />}</ModalFooter>
      </Modal>
    </div>
  );
}
export default ActionsCustomersListing;
