import { useState, useEffect } from "react";
import * as Yup from "yup";
import "../Style.css";
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
    InputGroup,
    ModalFooter,
    Input,
} from "reactstrap";
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import CircularLoading from "../../Component/loaders/Loading";
import * as actions from "../../store/creators";
import ActionCustomersListing from "./ActionsCustomersListing";
import CustomTextField from "../../Component/MuiComponents/CustomTextField";
import { MenuItem, Select, TextField, Tooltip } from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { RiResetRightFill } from "react-icons/ri";
import LinerLoader from "../../Component/loaders/LinerLoader";
import { Box, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download"
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AddIcon from "@mui/icons-material/Add";

function CustomersListing() {
    const dispatch = useDispatch();
    const { customers, isLoading, isPostLoading } = useSelector(
        (state) => state.entities?.customers
    );

    const { login } = useSelector((state) => state?.login);

    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [modal, setModal] = useState(false);

    const columns = [
        { key: "actions", label: "Actions" },
        { key: "name", label: "Name" },
        { key: "phone", label: "Phone" },
        { key: "address", label: "Address" },
    ];

    const [searchFilter, setSearchFilter] = useState(false);

    const [searchValue, setSearchValue] = useState("");

    const rows = customers?.isLoading
        ? []
        : customers?.data?.length > 0
            ? customers?.data?.filter((item) => {
                return (
                    (searchValue && searchFilter
                        ? item?.name
                            ?.toLowerCase()
                            .includes(searchValue.trim().toLowerCase())
                        : item) ||
                    (searchValue && searchFilter
                        ? item?.phone
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
        dispatch(actions.customersGetData(data));
    }, []);

    const toggle = () => {
        setModal(!modal);
    };

    const handleExport = () => {
        if (!customers?.data || customers?.data?.length === 0) {
            alert("No data available to export");
            return;
        }

        // JSON to worksheet
        const worksheet = XLSX.utils.json_to_sheet(customers?.data);

        // Workbook तयार करा
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

        // Buffer तयार करा
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        // Blob तयार करा
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "customers_data.xlsx");
    };


    const handleSubmit = (values, { setSubmitting }) => {
        let customers = {
            name: values.name,
            phone: values.phone,
            address: values.address,
        };
        dispatch(actions.postCustomersData({ data, customers, toggle, setSubmitting }));
        setSubmitting(true);
        return;
    };

    return (
        <Card className="w-100">
            <CardHeader className="bg-white text-dark p-0">
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        width: "100%",
                        mb: 2,
                        p: 2,
                        bgcolor: "background.paper",
                        borderRadius: 1,
                    }}
                >
                    {/* Title */}
                    <Box
                        sx={{
                            background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            display: "inline-block",
                        }}
                    >
                        <Typography variant="h4" fontWeight="bold">
                            Customers
                        </Typography>
                    </Box>

                    {/* Buttons group */}
                    <Box sx={{ display: "flex", gap: 1 }}>
                        {/* Download Button */}
                        <Button
                            onClick={handleExport}
                            className="gradientButton"
                        >
                            <DownloadIcon />
                        </Button>

                        {/* Add Button (mobile only) */}
                        <Button
                            onClick={toggle} className="gradientButton"
                        >
                            <AddIcon />
                        </Button>
                    </Box>
                </Box>

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
                            <SearchIcon />
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
                            <RestartAltIcon />

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
                        Add New Customer
                    </ModalHeader>
                    {isPostLoading && <LinerLoader />}
                    <ModalBody className="">
                        <Formik
                            initialValues={{
                                name: "",
                                phone: "",
                                address: "",
                            }}
                            onSubmit={handleSubmit}
                            validationSchema={Yup.object().shape({
                                name: Yup.string().required("This Field is Mandatory"),
                                phone: Yup.string()
                                    .trim()
                                    .required("Phone is required")
                                    .test("is-10-digits", "Phone must be exactly 10 digits", (val) => {
                                        if (!val) return false;
                                        const digits = val.replace(/\D/g, ""); // keep only numbers
                                        return digits.length === 10;
                                    }),
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
                                                        type="text"
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
                    <ModalFooter>{isPostLoading && <LinerLoader />}</ModalFooter>
                </Modal>
            </CardHeader>
            <CardBody style={{ width: "100%" }}>
                {isLoading ? (
                    <CircularLoading />
                ) : (
                    <div className="table-responsive" style={{ paddingBottom: '5rem' }}>
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
                                                <ActionCustomersListing data={row} index={row.id} />
                                            </td>
                                            <td>
                                                <Tooltip title={row.name}>
                                                    <span>{row.name}</span>
                                                </Tooltip>
                                            </td>
                                            <td className="text-center">{row.phone}</td>
                                            <td className="text-center">{row.address}</td>
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
export default CustomersListing;

