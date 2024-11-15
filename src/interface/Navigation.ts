import { ReactNode } from "react";

export type VerticalNavItem = {
  children?: VerticalNavItem[];
  key?: string;
  icon?: ReactNode;
  label: ReactNode;
  path: string;
  hidden?: boolean;
};
