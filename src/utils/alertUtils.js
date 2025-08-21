import Swal from "sweetalert2";

export const showSuccessAlert = (message) => {
  Swal.fire({
    position: "center",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 3000,
  });
};

export const showErrorAlert = (message) => {
  Swal.fire({
    position: "center",
    icon: "error",
    title: message,
    showConfirmButton: false,
    timer: 3000,
  });
};
