import { createState } from "@/services/state";

interface DialogState {
  isOpen: boolean;
  type: "alert" | "confirm" | "error";
  title: string;
  message: string;
}

export const dialogState = createState<DialogState>({
  data: {
    isOpen: false,
    type: "alert",
    title: "",
    message: "",
  },
});
