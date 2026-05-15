import { SnackbarOptions } from "zmp-ui";

type SnackbarFunction = (options: SnackbarOptions) => void;

let snackbarFunction: SnackbarFunction | null = null;

export const setSnackbarFunction = (fn: SnackbarFunction) => {
  snackbarFunction = fn;
};

export const openSnackbar = (options: SnackbarOptions) => {
  if (snackbarFunction) {
    snackbarFunction(options);
  } else {
    console.warn(
      "Snackbar function not initialized. Make sure <SnackbarRegister /> is rendered within SnackbarProvider.",
    );
  }
};
