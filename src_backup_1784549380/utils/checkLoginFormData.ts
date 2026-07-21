import toast from "react-hot-toast";

/**
 * Validates the login form fields.
 * Ensures that both the email and password are provided by the user.
 * 
 * @param data Object containing the login form fields
 * @returns boolean indicating if validation succeeded
 */
export const checkLoginFormData = (data: {
  [k: string]: FormDataEntryValue;
}) => {
    if(data?.email === "" || data?.password === "") {
        toast.error("Please fill in all fields");
        return false;
    }
    return true;
};
