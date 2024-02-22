export type HeaderType =
  | "auth"
  | "home"
  | "user-home"
  | "gallery"
  | "about-us"
  | "cart"
  | "credit";

export type HeaderProps = {
  type: HeaderType;
  onMyGallery?: VoidFunction;
};
