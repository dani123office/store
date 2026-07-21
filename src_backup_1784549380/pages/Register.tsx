import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components";
import { checkRegisterFormData } from "../utils/checkRegisterFormData";
import customFetch from "../axios/custom";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    if (!checkRegisterFormData(data)) return;

    try {
      const response = await customFetch.post("/auth/register", {
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
      });
      if (response.status === 201 || response.status === 200) {
        toast.success("User registered successfully");
        navigate("/login");
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        toast.error("User with this email already exists");
      } else {
        toast.error("An error occurred. Please try again");
      }
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto pt-24 flex items-center justify-center px-5">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md flex flex-col gap-6"
      >
        <h2 className="text-heading-section text-ink text-center">
          Create Account
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-caption uppercase tracking-tracked text-shade-50">First Name</label>
            <input
              type="text"
              id="name"
              className="bg-canvas border border-hairline text-body-md py-3 px-4 w-full outline-none focus:border-ink transition-colors"
              placeholder="Enter first name"
              name="name"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="lastname" className="text-caption uppercase tracking-tracked text-shade-50">Last Name</label>
            <input
              type="text"
              id="lastname"
              className="bg-canvas border border-hairline text-body-md py-3 px-4 w-full outline-none focus:border-ink transition-colors"
              placeholder="Enter last name"
              name="lastname"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-caption uppercase tracking-tracked text-shade-50">Email</label>
            <input
              type="email"
              id="email"
              className="bg-canvas border border-hairline text-body-md py-3 px-4 w-full outline-none focus:border-ink transition-colors"
              placeholder="Enter email address"
              name="email"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-caption uppercase tracking-tracked text-shade-50">Password</label>
            <input
              type="password"
              id="password"
              className="bg-canvas border border-hairline text-body-md py-3 px-4 w-full outline-none focus:border-ink transition-colors"
              placeholder="Enter password"
              name="password"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-caption uppercase tracking-tracked text-shade-50">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="bg-canvas border border-hairline text-body-md py-3 px-4 w-full outline-none focus:border-ink transition-colors"
              placeholder="Confirm password"
              name="confirmPassword"
            />
          </div>
        </div>
        <Button type="submit" text="Register" mode="black" />
        <p className="text-caption text-shade-50 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-ink underline underline-offset-2 hover:opacity-60">
            Login now
          </Link>
        </p>
      </form>
    </div>
  );
};
export default Register;