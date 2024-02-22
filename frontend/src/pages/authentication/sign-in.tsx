/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { useState, type FC, ChangeEvent } from "react";
import { IMAGES } from "../../assets/images";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "../../store";
import { validateLogin } from "../../validation";
import { toastError, toastSuccess } from "../../components/Toast/Toast";
import { useNavigate } from "react-router";
import { ROUTES } from "../../labels/routes";
import { login } from "../../store/slices/authSlice";

const SignInPage: FC = function () {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onLogin = async () => {
    const payload = {
      email: email.trim(),
      password: password.trim(),
    };

    const errorMsg = validateLogin(payload);
    if (errorMsg) return toastError(errorMsg);

    const successCallback = (response: any) => {
      toastSuccess(response.message);

      setTimeout(() => {
        navigate(ROUTES.dashboard);
      }, 6000);
    };

    const errorCallback = (error: string) => {
      toastError(error);
    };

    const params = {
      payload,
      successCallback,
      errorCallback,
    };

    dispatch(login(params));
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
      <a href="/" className="my-6 flex items-center gap-x-1 lg:my-0">
        <img alt="Gamefolio logo" src={IMAGES.logo} className="mr-3 h-10" />
        <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          Gamefolio
        </span>
      </a>
      <Card
        horizontal
        imgSrc="/images/authentication/login.jpg"
        imgAlt=""
        className="w-full md:max-w-[1024px] md:[&>*]:w-full md:[&>*]:p-16 [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 lg:[&>img]:block"
      >
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          Sign in to platform
        </h1>

        <div className="mb-4 flex flex-col gap-y-3">
          <Label htmlFor="email">Your email</Label>
          <TextInput
            id="email"
            name="email"
            placeholder="name@company.com"
            type="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6 flex flex-col gap-y-3">
          <Label htmlFor="password">Your password</Label>
          <TextInput
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <Checkbox id="rememberMe" name="rememberMe" />
            <Label htmlFor="rememberMe">Remember me</Label>
          </div>
          <a
            href="#"
            className="w-1/2 text-right text-sm text-primary-600 dark:text-primary-300"
          >
            Lost Password?
          </a>
        </div>
        <div className="mb-6">
          <Button type="submit" className="w-full lg:w-auto" onClick={onLogin}>
            Login to your account
          </Button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Not registered?&nbsp;
          <a href="#" className="text-primary-600 dark:text-primary-300">
            Create account
          </a>
        </p>
      </Card>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default SignInPage;
