"use client";
import { Lato } from "next/font/google";
import { useRouter } from "next/navigation";
import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";

const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

interface FormValues {
  email: string;
}

const Newsletter = () => {
  const router = useRouter();

  const acceptedDomains = ["gmail.com", "hotmail.com", "outlook.com", "icloud.com", "mail.com"];

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .test("accepted-domains", "Email domain not accepted", (value) => {
        if (value) {
          const domain = value.split("@")[1];
          return acceptedDomains.includes(domain);
        }
        return true;
      })
      .test("spam-check", "", (value) => {
        if (value) {
          const randomSpamCheck = Math.random();
          return randomSpamCheck >= 0.3;
        }
        return true;
      }),
  });

  const initialValues: FormValues = {
    email: "",
  };

  const handleSubmit = (values: FormValues, { setSubmitting, setFieldError }: FormikHelpers<FormValues>) => {
    setSubmitting(true);

    fetch("/functions/email", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Thank you for subscribing!");
          // router.push("/thank-u-for-subscribing");
        } else {
          return response.json().then((data) => {
            throw new Error(data.message || "Something went wrong");
          });
        }
      })
      .catch((error) => {
        setFieldError("email", error.message);
        console.log(error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <div className="mb-12">
        <h2
          className={`!${lato.className} !uppercase !text-slate-400 !font-[600] !text-xs !tracking-widest`}
        >
          Subscribe to newsletter
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field
                type="email"
                name="email"
                className="py-3 w-full border-[1px] px-2 placeholder:text-slate-300 border-slate-200 rounded-none text-slate-500 text-xs outline-none"
                placeholder="Your Email"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 cursor-pointer py-2 border-2 border-black transition-all duration-200 hover:bg-black hover:text-white mt-3 text-xs"
              >
                {isSubmitting ? "Submitting..." : "Get Updates"}
              </button>
            </Form>
          )}
        </Formik>
        <Toaster position="top-right" reverseOrder={true} />
      </div>
    </>
  );
};

export default Newsletter;
