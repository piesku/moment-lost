import { create_store } from "innerself";
import with_logger from "innerself/logger";
import reducer from "./reducer";

const { attach, connect, dispatch } =
  create_store(with_logger(reducer));
window.dispatch = dispatch;
export { attach, connect };
