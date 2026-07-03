import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components";
import { checkLoginFormData } from "../utils/checkLoginFormData";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { setLoginStatus } from "../features/auth/authSlice";
import { store } from "../store";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    if (!checkLoginFormData(data)) return;

    try {
      const response = await customFetch.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      const user = response.data;
      toast.success("You logged in successfully");
      localStorage.setItem("user", JSON.stringify(user));
      if (user && user.token) {
        localStorage.setItem("token", user.token);
      }
      store.dispatch(setLoginStatus(true));
      navigate("/user-profile");
    } catch {
      toast.error("Please enter correct email and password");
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      toast.success("You are already logged in");
      navigate("/user-profile");
    }
  }, [navigate]);

  return (
    <div className="max-w-screen-2xl mx-auto pt-24 flex items-center justify-center px-5">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md flex flex-col gap-6"
      >
        <h2 className="text-2xl md:text-3xl font-light tracking-[0.15em] uppercase text-center">
          Sign In
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs tracking-wider uppercase text-[#151515]/70">Email</label>
            <input
              type="email"
              id="email"
              className="bg-white border border-[#E2E2E2] text-sm py-3 px-4 w-full outline-none focus:border-[#151515] transition-colors"
              placeholder="Enter email address"
              name="email"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs tracking-wider uppercase text-[#151515]/70">Password</label>
            <input
              type="password"
              id="password"
              className="bg-white border border-[#E2E2E2] text-sm py-3 px-4 w-full outline-none focus:border-[#151515] transition-colors"
              placeholder="Enter password"
              name="password"
            />
          </div>
        </div>
        <Button type="submit" text="Login" mode="black" />
        <p className="text-xs tracking-wider text-[#151515]/60 text-center">
          Don&rsquo;t have an account?{" "}
          <Link to="/register" className="text-[#151515] underline underline-offset-2 hover:opacity-60">
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
};
export default Login;
