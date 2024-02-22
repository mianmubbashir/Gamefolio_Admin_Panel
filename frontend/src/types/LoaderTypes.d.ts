type LoaderType = "overlay" | "simple";

export type LoaderProps = {
  open?: boolean;
  type?: LoaderType;
};

export type ProgressBarProps = {
  open?: boolean;
  value?: number;
};
