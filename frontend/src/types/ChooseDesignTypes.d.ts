import { SnackbarOrigin } from "@mui/material";

export type ChooseDesignProps = {};

export type GalleryProps = {
  onCreateCase: VoidFunction;
};

export type Design = {
  title: string;
  image: string;
};

export interface ISnackbar extends SnackbarOrigin {
  open: boolean;
}
