import {
  json,
  type ActionFunction,
  type LoaderFunction,
  redirect,
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import { AuthButton } from "~/components/auth-button";
import { FormField } from "~/components/form-fields";
import { Layout } from "~/components/layout";
import { login, register, getUser } from "~/utils/auth.server";
import type { ActionData } from "~/utils/types.server";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "~/utils/validators.server";

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect("/") : null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action");
  const email = form.get("email");
  const password = form.get("password");
  let firstName = form.get("firstName");
  let lastName = form.get("lastName");

  if (
    typeof action !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return json({ error: "invalid Form Data", from: action }, { status: 400 });
  }
  if (
    action === "register" &&
    (typeof firstName !== "string" || typeof lastName !== "string")
  ) {
    return json({ error: "invalid Form Data", from: action }, { status: 400 });
  }
  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    ...(action === "register"
      ? {
          firstName: validateName((firstName as string) || ""),
          lastName: validateName((lastName as string) || ""),
        }
      : {}),
  };
  if (Object.values(errors).some(Boolean)) {
    return json(
      {
        errors,
        fields: { email, password, firstName, lastName },
        form: action,
      },
      { status: 400 }
    );
  }
  switch (action) {
    case "login": {
      return await login({ email, password });
    }
    case "register": {
      firstName = firstName as string;
      lastName = lastName as string;
      return await register({ email, password, firstName, lastName });
    }
    default:
      return json({ error: "invalid Form Data" }, { status: 400 });
  }
};
const Login = () => {
  const actionData: ActionData | undefined = useActionData();
  const [formError, setFormError] = useState(actionData?.error || "");
  const [errors, setErrors] = useState<ActionData["errors"]>(
    actionData?.errors
  );
  const [action, setAction] = useState<"login" | "register">("login");
  const firstLoad = useRef(true);
  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || "",
    password: actionData?.fields?.password || "",
    firstName: actionData?.fields?.firstName || "",
    lastName: actionData?.fields?.lastName || "",
  });
  useEffect(() => {
    if (!firstLoad.current) {
      const newState = {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
      };
      setErrors(newState);
      setFormError("");
      setFormData(newState);
    }
  }, [action]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({
      ...form,
      [field]: event.target.value,
    }));
  };

  return (
    <Layout>
      <div className="h-full flex justify-center items-center flex-col gap-y-4">
        <AuthButton
          onClick={() =>
            setAction((cur) => (cur === "login" ? "register" : "login"))
          }
          className="absolute top-8 right-8 rounded-xl bg-amber-300 px-3 py-2 transition duration-300 ease-in-out hover:bg-amber-200 hover:-translate-y-1"
        >
          {" "}
          {action === "login" ? "Sign Up" : "Sign In"}
        </AuthButton>
        <h2 className="text-5xl font-extrabold text-slate-100 p-2">
          Welcome to CraftCrawl 🍻
        </h2>
        <p>Make yourself comfortable</p>
        <form method="post" className="bg-amber-950 rounded-xl p-6">
          <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
            {formError}
          </div>
          <FormField
            htmlFor="email"
            label="Email"
            onChange={(e) => handleInputChange(e, "email")}
            value={formData.email}
            error={errors?.email}
          />
          <FormField
            htmlFor="password"
            label="Password"
            type="password"
            onChange={(e) => handleInputChange(e, "password")}
            value={formData.password}
            error={errors?.password}
          />
          {action !== "login" ? (
            <>
              <FormField
                htmlFor="firstName"
                label="firstName"
                onChange={(e) => handleInputChange(e, "firstName")}
                value={formData.firstName}
                error={errors?.firstName}
              />
              <FormField
                htmlFor="lastName"
                label="lastName"
                onChange={(e) => handleInputChange(e, "lastName")}
                value={formData.lastName}
                error={errors?.lastName}
              />
            </>
          ) : null}
          <AuthButton
            type="submit"
            name="_action"
            value={action}
            className="rounded-xl bg-amber-300 px-3 py-2 transition duration-300 ease-in-out hover:bg-amber-200 hover:-translate-y-1"
          >
            {" "}
            {action === "login" ? "Sign In" : "Sign Up"}
          </AuthButton>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
