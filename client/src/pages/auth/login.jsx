import CommonForm from "@/components/common/form";
import { loginFormControl } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function onSubmit(event) {
    event.preventDefault();

    try {
      const result = await dispatch(loginUser(formData));
      const data = result.payload;

      if (data.success) {
        toast.success(data.message || "Login successful");

        // ✅ Redirect based on role
        if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/shop/home");
        }
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Something went wrong during login.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account?
          <Link
            className="font-medium ml-2 text-blue-600 hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControl}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthLogin;
