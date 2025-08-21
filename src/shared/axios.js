import axios from "axios";
import { baseUrl } from "./baseURL";
const instance = axios.create({
  baseURL: baseUrl,
});

export default instance;
