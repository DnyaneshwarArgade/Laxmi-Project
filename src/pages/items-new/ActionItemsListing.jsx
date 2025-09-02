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

function ActionItemsListing(props) {
  const dispatch = useDispatch();
  const { isUpdateLoading } = useSelector((state) => state.entities?.items);

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
        dispatch(actions.deleteItemsData({ id, data }));
      }
    });
  }

  const handleSubmit = (values, { setSubmitting }) => {
    let items = new FormData();
    items.append("name", values.name);
    items.append("image", values.image);
    items.append("price", values.price);

    dispatch(actions.updateItemsData({ data, items, toggle, setSubmitting }));
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
          <EditIcon style={{ color: "#3b82f6", fontSize: 16 }} />
        </button>

        <button
          className="deleteButton"
          title="Delete"
          onClick={() => {
            deleteSelectedItem(data.id);
          }}
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
          <FaTrash style={{ color: "#ef4444", fontSize: 16 }} />
        </button>
      </div>

      <Modal className="modal-lg" isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} className="d-flex align-items-center">
          Edit Item
        </ModalHeader>
        {isUpdateLoading && <LinerLoader />}
        <ModalBody className="">
          <Formik
            initialValues={{
              name: props.data?.name ?? "",
              type: props.data?.type ?? "",
              image: props.data?.image ?? "",
              price: props.data?.price ?? "",
            }}
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              name: Yup.string().required("This Field is Mandatory"),
              price: Yup.number()
                .typeError("Price must be a number")
                .positive("Price must be a positive number")
                .required("This Field is Mandatory"),
            })}
          >
            {(formProps) => {
              return (
                <Form>
                  {console.log(`formProps.values users`, formProps.values)}
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
                          name="price"
                          label="Enter Price *"
                          type="number"
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
export default ActionItemsListing;
