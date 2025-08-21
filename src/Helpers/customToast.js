import Swal from "sweetalert2";

const customToast = (
  type = "success",
  message = "Data Saved",
  position = "top-end",
  timer = 3000
) => {
  const newPostion = position ?? "top-end";
  const Toast = Swal.mixin({
    toast: true,
    position: newPostion,
    showConfirmButton: false,
    timer: timer,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: type,
    title: message,
  });
};

export default customToast;
