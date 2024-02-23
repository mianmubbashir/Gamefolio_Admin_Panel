import { useEffect, type FC } from "react";
import { Route, Routes, useNavigate } from "react-router";
import { BrowserRouter } from "react-router-dom";
import FlowbiteWrapper from "./components/flowbite-wrapper";
import DashboardPage from "./pages";
import ForgotPasswordPage from "./pages/authentication/forgot-password";
import ProfileLockPage from "./pages/authentication/profile-lock";
import ResetPasswordPage from "./pages/authentication/reset-password";
import SignInPage from "./pages/authentication/sign-in";
import SignUpPage from "./pages/authentication/sign-up";
import EcommerceBillingPage from "./pages/e-commerce/billing";
import EcommerceInvoicePage from "./pages/e-commerce/invoice";
import EcommerceProductsPage from "./pages/e-commerce/products";
import KanbanPage from "./pages/kanban";
import MailingComposePage from "./pages/mailing/compose";
import MailingInboxPage from "./pages/mailing/inbox";
import MailingReadPage from "./pages/mailing/read";
import MailingReplyPage from "./pages/mailing/reply";
import NotFoundPage from "./pages/pages/404";
import ServerErrorPage from "./pages/pages/500";
import MaintenancePage from "./pages/pages/maintenance";
import PricingPage from "./pages/pages/pricing";
import UserFeedPage from "./pages/users/feed";
import UserListPage from "./pages/users/list";
import UserProfilePage from "./pages/users/profile";
import UserSettingsPage from "./pages/users/settings";

import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import { RootState, useDispatch } from "./store";
import { getFromLocal } from "./utils/localStorage";
import { userSession } from "./store/slices/authSlice";
import { ROUTES } from "./labels/routes";

const ProtectedRoute = () => {
  const { userData } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const payload = {
    userToken: getFromLocal("@token"),
  };
  const params = {
    payload,
  };

  useEffect(() => {
    if (!getFromLocal("@token")) {
      const timer = setTimeout(() => {
        navigate(ROUTES.login); // Redirect to sign-in page
      }, 1000);

      return () => clearTimeout(timer); // Clear timeout on unmount
    } else {
      dispatch(userSession(params));
    }
    return () => {};
  }, []);

  // show unauthorized screen if no user is found in redux store
  if (!userData) {
    return (
      <div className="loading">
        <h1>Loading</h1>
      </div>
    );
  }

  return <Outlet />;
};

const App: FC = function () {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<FlowbiteWrapper />}>
            <Route path="/*" element={<DashboardPage />} index />
            <Route path="/users/feed" element={<UserFeedPage />} />
            <Route path="/users/list" element={<UserListPage />} />
            <Route path="/users/profile" element={<UserProfilePage />} />
            <Route path="/users/settings" element={<UserSettingsPage />} />
            <Route path="/mailing/compose" element={<MailingComposePage />} />
            <Route path="/mailing/inbox" element={<MailingInboxPage />} />
            <Route path="/mailing/read" element={<MailingReadPage />} />
            <Route path="/mailing/reply" element={<MailingReplyPage />} />
            <Route path="/kanban" element={<KanbanPage />} />
            <Route path="/pages/pricing" element={<PricingPage />} />
            <Route path="/pages/maintenance" element={<MaintenancePage />} />
            <Route path="/pages/404" element={<NotFoundPage />} />
            <Route path="/pages/500" element={<ServerErrorPage />} />
          </Route>
        </Route>
        <Route element={<FlowbiteWrapper />}>
          <Route path="/authentication/sign-in" element={<SignInPage />} />
          <Route path="/authentication/sign-up" element={<SignUpPage />} />
          <Route
            path="/authentication/forgot-password"
            element={<ForgotPasswordPage />}
          />
          <Route
            path="/authentication/reset-password"
            element={<ResetPasswordPage />}
          />
          <Route
            path="/authentication/profile-lock"
            element={<ProfileLockPage />}
          />
          <Route
            path="/e-commerce/billing"
            element={<EcommerceBillingPage />}
          />
          <Route
            path="/e-commerce/invoice"
            element={<EcommerceInvoicePage />}
          />
          <Route
            path="/e-commerce/products"
            element={<EcommerceProductsPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
