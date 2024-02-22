import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { RootState, useSelector } from ".";
import { ROUTES } from "@/labels/routes";

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const { token } = useSelector((state: RootState) => state.auth);
  let storageToken =
    typeof window !== "undefined" &&
    JSON.parse(localStorage.getItem("@token")!);
  const userToken = token ? token : storageToken;

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!userToken) {
      const href = ROUTES.main;

      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [userToken, router]);

  useEffect(() => {
    check();
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
