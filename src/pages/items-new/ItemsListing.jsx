import { useState, useEffect } from "react";
import * as Yup from "yup";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Label,
  InputGroup,
  ModalFooter,
  Input,
} from "reactstrap";
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import CircularLoading from "../../Component/loaders/Loading";
import * as actions from "../../store/creators";
import ActionItemsListing from "./ActionItemsListing";
import CustomTextField from "../../Component/MuiComponents/CustomTextField";
import { MenuItem, Select, TextField, Tooltip } from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { RiResetRightFill } from "react-icons/ri";
import LinerLoader from "../../Component/loaders/LinerLoader";

function ItemsListing() {
  const dispatch = useDispatch();
  const { items, isLoading, isPostLoading } = useSelector(
    (state) => state.entities?.items
  );

  const { login } = useSelector((state) => state?.login);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState(false);

  const columns = [
    { key: "actions", label: "Actions" },
    { key: "name", label: "Name" },
    { key: "price", label: "Price" },
  ];

  const [searchFilter, setSearchFilter] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const rows = items?.isLoading
    ? []
    : items?.data?.length > 0
    ? items?.data?.filter((item) => {
        return (
          (searchValue && searchFilter
            ? item?.name
                ?.toLowerCase()
                .includes(searchValue.trim().toLowerCase())
            : item) ||
          (searchValue && searchFilter
            ? item?.type
                ?.toLowerCase()
                .includes(searchValue.trim().toLowerCase())
            : item) ||
          (searchValue && searchFilter
            ? item?.address
                ?.toLowerCase()
                .includes(searchValue.trim().toLowerCase())
            : item)
        );
      })
    : [];

  // Pagination logic
  const totalRows = rows.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const paginatedRows = rows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  let data = {
    token: login?.token,
  };

  useEffect(() => {
    dispatch(actions.itemsGetData(data));
  }, []);

  const toggle = () => {
    setModal(!modal);
  };

  const handleSubmit = (values, { setSubmitting }) => {
    let items = new FormData();
    items.append("name", values.name);
    items.append("image", values.image);
    items.append("price", values.price);
    dispatch(actions.postItemsData({ data, items, toggle, setSubmitting }));
    setSubmitting(true);
    return;
  };

  return (
    <Card className="w-100">
      <CardHeader className="bg-white text-dark p-0">
        <div className="d-flex bg-info p-2 align-items-center justify-content-between mb-2 flex-wrap">
          <strong className="pl-2 text-white">Items Details</strong>
          <Button className="btn-success p-2" onClick={toggle}>
            <i className="fa fa-plus text-white mr-2" />
            Add New
          </Button>
        </div>
        <div className="d-flex p-2 align-items-center justify-content-between flex-wrap">
          <Input
            type="text"
            name="search"
            id="search"
            placeholder="Search..."
            className="form-control"
            autoComplete="off"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: "60%" }}
          />
          <div className="d-flex align-items-center" style={{ gap: "5px" }}>
            <Button
              type="button"
              color="success"
              className="me-2"
              onClick={() => setSearchFilter(true)}
            >
              <FaSearch />
            </Button>
            <Button
              type="reset"
              color="danger"
              onClick={() => {
                setSearchValue("");
                setSearchFilter(false);
              }}
              className="me-2"
            >
              <RiResetRightFill />
            </Button>
          </div>
        </div>

        <Modal
          className="modal-lg"
          backdrop="static"
          isOpen={modal}
          toggle={toggle}
        >
          <ModalHeader toggle={toggle} className="d-flex align-items-center">
            Add New Item
          </ModalHeader>
          {isPostLoading && <LinerLoader />}
          <ModalBody className="">
            <Formik
              initialValues={{
                name: "",
                type: "Batla",
                image: "",
                price: "",
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
          <ModalFooter>{isPostLoading && <LinerLoader />}</ModalFooter>
        </Modal>
      </CardHeader>
      <CardBody style={{ width: "100%" }}>
        {isLoading ? (
          <CircularLoading />
        ) : (
          <div className="table-responsive">
            <table
              className="table table-bordered table-striped"
              style={{ minWidth: "320px" }}
            >
              <thead className="thead-dark">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="text-center">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center">
                      No data found
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => (
                    <tr key={row.id}>
                      <td className="text-center">
                        <ActionItemsListing data={row} index={row.id} />
                      </td>
                      <td>
                        <Tooltip title={row.name}>
                          <span>{row.name}</span>
                        </Tooltip>
                      </td>
                      <td className="text-center">{row.price}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div
              className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 py-2"
              style={{ rowGap: "1rem" }}
            >
              <div
                className="d-flex align-items-center mb-2 mb-md-0"
                style={{ gap: "0.5rem", minWidth: 180 }}
              >
                <span style={{ fontSize: "0.95rem" }}>Rows per page</span>
                <Select
                  id="rowsPerPage"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  size="small"
                  style={{ minWidth: 60, fontSize: "0.95rem" }}
                >
                  {[10, 20, 50].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ gap: "0.5rem" }}
              >
                <Button
                  color="primary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-3"
                >
                  Prev
                </Button>
                <span
                  className="mx-2"
                  style={{ minWidth: 90, textAlign: "center" }}
                >
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  color="primary"
                  size="sm"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
export default ItemsListing;
