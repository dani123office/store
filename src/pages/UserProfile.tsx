import { useEffect, useState } from "react";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import customFetch from "../axios/custom";
import { checkUserProfileFormData } from "../utils/checkUserProfileFormData";
import { setLoginStatus } from "../features/auth/authSlice";
import { store } from "../store";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();

  const logout = () => {
    toast.error("Logged out successfully");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("meta_connected");
    store.dispatch(setLoginStatus(false));
    navigate("/login");
  };

  const fetchUser = async (userId: number | string) => {
    const response = await customFetch(`/users/${userId}`);
    setUser(response.data);
  };

  const updateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    if (!checkUserProfileFormData(data)) return;

    const payload = { ...data };
    if (!payload.password || String(payload.password).trim() === "") {
      delete payload.password;
    }

    const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
    if (userId) {
      try {
        await customFetch.put(`/users/${userId}`, payload);
      } catch (e) {
        toast.error("User update failed");
        return;
      }
      toast.success("User updated successfully");
    } else {
      toast.error("Please login to view this page");
      navigate("/login");
    }
  };

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
    if (!userId) {
      toast.error("Please login to view this page");
      navigate("/login");
    } else {
      fetchUser(userId);
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="max-w-screen-lg mx-auto mt-24 px-5 flex items-center justify-center min-h-[300px]">
        <div className="text-body-md tracking-tracked-wide uppercase text-shade-50 animate-pulse">
          Loading Account...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto mt-24 px-5">
      <h1 className="text-heading-section text-ink mb-10 text-center">
        My Account
      </h1>
      <form className="flex flex-col gap-5 max-w-md mx-auto" onSubmit={updateUser}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="firstname" className="text-caption uppercase tracking-tracked text-shade-50">First Name</label>
          <input
            type="text"
            className="bg-canvas border border-hairline text-body-md py-3 px-4 w-full outline-none focus:border-ink transition-colors"
            placeholder="Enter first name"
            id="firstname"
            name="name"
            defaultValue={user?.name}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lastname" className="text-caption uppercase tracking-tracked text-shade-50">Last Name</label>
          <input
            type="text"
            className="bg-canvas border border-hairline text-body-md py-3 px-4 w-full outline-none focus:border-ink transition-colors"
            placeholder="Enter last name"
            id="lastname"
            name="lastname"
            defaultValue={user?.lastname}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-caption uppercase tracking-tracked text-shade-50">Email</label>
          <input
            type="email"
            className="bg-canvas border border-hairline text-body-md py-3 px-4 w-full outline-none focus:border-ink transition-colors"
            placeholder="Enter email address"
            id="email"
            name="email"
            defaultValue={user?.email}
          />
        </div>
         <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-caption uppercase tracking-tracked text-shade-50">Password</label>
          <input
            type="password"
            className="bg-canvas border border-hairline text-body-md py-3 px-4 w-full outline-none focus:border-ink transition-colors"
            placeholder="Enter new password (optional)"
            id="password"
            name="password"
          />
        </div>
        <Button type="submit" text="Update Profile" mode="black" />
        <Link
          to="/order-history"
          className="text-center text-button-label uppercase tracking-tracked font-medium border border-ink py-4 rounded-pill hover:bg-ink hover:text-on-primary transition-colors"
        >
          Order History
        </Link>
        <Button onClick={logout} text="Logout" mode="white" />
      </form>
    </div>
  );
};

export default UserProfile;