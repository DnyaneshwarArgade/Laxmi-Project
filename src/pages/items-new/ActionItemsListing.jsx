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
      <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
        {/* <Button className="btn-success p-1" onClick={toggle}>
          <EditIcon />
        </Button> */}

        <button
          className="editButton"
          title="Edit"
          onClick={toggle}
        >
          <EditIcon
            style={{
              color: "#3b82f6", // निळा रंग (तू हवा तो बदलू शकतोस)
              fontSize: 20,
              display: "block",
            }}
          />
        </button>

        {/* <Button
          className="bg-danger text-white p-1"
          onClick={() => {
            deleteSelectedItem(data.id);
          }}
        >
           <DeleteIcon />
        </Button> */}
        <button
          className="deleteButton"
          title="Delete"
          onClick={() => {
            deleteSelectedItem(data.id);
          }}
        >
          <FaTrash
            style={{
              color: "#ef4444",
              fontSize: 20,
              display: "block",
            }}
          />
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
                      <Button type="reset" color="danger" block className="mt-3">
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
