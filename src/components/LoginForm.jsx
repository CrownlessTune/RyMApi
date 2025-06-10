import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext"; // <-- importa tu contexto
import "../sass/components/_LoginForm.scss";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- extraemos la función login del contexto

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const { email, password } = values;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Guardamos el usuario en el contexto para mantener sesión
      login({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        // puedes añadir otros datos que quieras guardar
      });

      Swal.fire({
        title: "Success",
        text: "Login successful.",
        icon: "success",
      });

      resetForm();
      navigate("/user"); // Redirige a la página de usuario
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="login-form">
          <div className="form-group">
            <Field
              name="email"
              type="email"
              placeholder="Enter your email"
              className="input-field"
            />
            <ErrorMessage name="email" component="div" className="error-message" />
          </div>
          <div className="form-group">
            <Field
              name="password"
              type="password"
              placeholder="Enter your password"
              className="input-field"
            />
            <ErrorMessage name="password" component="div" className="error-message" />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`submit-button ${isSubmitting ? "disabled" : ""}`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
