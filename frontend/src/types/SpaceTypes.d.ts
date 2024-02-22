import { ReactElement } from "react";

type SpaceType = "mb" | "mt" | "mr" | "ml";

export type SpaceProps = {
  type?: SpaceType;
  children?: ReactElement;
  xl?: number;
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
};
