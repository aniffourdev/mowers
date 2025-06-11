// src/app/components/pages/contact/Form.tsx
"use client";
import React from "react";
import { Noto_Sans } from "next/font/google";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Toaster, toast } from "react-hot-toast";

const noto = Noto_Sans({ weight: "400", subsets: ["latin"] });

// Validation schema using Yup
const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First Name is required")
    .min(2, "First Name must be at least 2 characters"),
  lastName: Yup.string()
    .required("Last Name is required")
    .min(2, "Last Name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  message: Yup.string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters"),
});

const ContactForm = () => {
  const [loading, setLoading] = React.useState(false);

  // Handle form submission
  const handleSubmit = async (values: any, { resetForm }: any) => {
    setLoading(true);
    try {
      // Send form data to the API route
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        resetForm();
      } else {
        throw new Error("Failed to send email.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form>
          <div className="flex gap-3 mb-3">
            <div className="w-6/12">
              <label
                htmlFor="firstName"
                className={`${noto.className} text-[10px] text-[#333333] mb-[.4em] uppercase`}
              >
                First Name*
              </label>
              <Field
                type="text"
                name="firstName"
                id="firstName"
                className={`${noto.className} w-full border-[1px] border-[#eee] text-[#333] font-[400] text-[13px] py-[.85em] px-[1em] outline-none transition-all !focus:shadow-[2px 2px 0 #222] !focus:outline-none`}
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className={`${noto.className} text-red-500 text-xs mt-1`}
              />
            </div>
            <div className="w-6/12">
              <label
                htmlFor="lastName"
                className={`${noto.className} text-[10px] text-[#333333] mb-[.4em] uppercase`}
              >
                Last Name*
              </label>
              <Field
                type="text"
                name="lastName"
                id="lastName"
                className={`${noto.className} w-full border-[1px] border-[#eee] text-[#333] font-[400] text-[13px] py-[.85em] px-[1em] outline-none transition-all !focus:shadow-[2px 2px 0 #222] !focus:outline-none`}
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className={`${noto.className} text-red-500 text-xs mt-1`}
              />
            </div>
          </div>
          <div className="w-full mb-3">
            <label
              htmlFor="email"
              className={`${noto.className} text-[10px] text-[#333333] mb-[.4em] uppercase`}
            >
              Email*
            </label>
            <Field
              type="email"
              name="email"
              id="email"
              className={`${noto.className} w-full border-[1px] border-[#eee] text-[#333] font-[400] text-[13px] py-[.85em] px-[1em] outline-none transition-all !focus:shadow-[2px 2px 0 #222] !focus:outline-none`}
            />
            <ErrorMessage
              name="email"
              component="div"
              className={`${noto.className} text-red-500 text-xs mt-1`}
            />
          </div>
          <div className="w-full mb-5">
            <label
              htmlFor="message"
              className={`${noto.className} text-[10px] text-[#333333] mb-[.4em] uppercase`}
            >
              Message*
            </label>
            <Field
              as="textarea"
              name="message"
              id="message"
              className={`${noto.className} w-full border-[1px] border-[#eee] text-[#333] font-[400] text-[13px] py-[.85em] px-[1em] outline-none h-[10em] min-h-[10em] transition-all !focus:shadow-[2px 2px 0 #222] !focus:outline-none`}
            />
            <ErrorMessage
              name="message"
              component="div"
              className={`${noto.className} text-red-500 text-xs mt-1`}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`${
              noto.className
            } cursor-pointer border-2 border-black text-[10px] uppercase px-[2.8em] py-[1.4em] pb-[1.2em] transition-all duration-200 hover:bg-black hover:text-white ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </Form>
      )}
    </Formik>
    <Toaster position="top-right" reverseOrder={true} />
    </>
  );
};

export default ContactForm;
