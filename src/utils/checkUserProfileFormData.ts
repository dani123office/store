import toast from "react-hot-toast";

/**
 * Validates user profile update form data.
 * First Name, Last Name, and Email are required. Password is optional.
 * 
 * @param data The form entry values
 * @returns boolean indicating if validation passed
 */
export const checkUserProfileFormData = (data: {
  [k: string]: FormDataEntryValue;
}) => {
  const { name, lastname, email } = data;
  if (!name || String(name).trim() === "") {
    toast.error("First Name is required");
    return false;
  }
  if (!lastname || String(lastname).trim() === "") {
    toast.error("Last Name is required");
    return false;
  }
  if (!email || String(email).trim() === "") {
    toast.error("Email is required");
    return false;
  }
  return true;
};
