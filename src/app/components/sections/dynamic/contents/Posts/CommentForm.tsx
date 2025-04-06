// CommentForm.tsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Lato, Noto_Sans } from "next/font/google";

const noto = Noto_Sans({ weight: "400", subsets: ["latin"] });
const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

interface CommentFormProps {
  postId: string; // This is the base64-encoded post ID
  onCommentPosted: (comment: Comment) => void; // Callback to notify the parent component
}

interface Comment {
  id: number;
  author_name: string;
  author_email: string;
  content: {
    rendered: string;
  };
  date: string;
  parent: number;
  post: number;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentPosted }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  // Function to decode the base64 postId and extract the numeric ID
  const decodePostId = (encodedId: string): number => {
    try {
      const decoded = atob(encodedId);
      const match = decoded.match(/post:(\d+)/);
      if (match && match[1]) {
        return parseInt(match[1], 10);
      }
      throw new Error("Invalid post ID format");
    } catch (err) {
      console.error("Failed to decode postId:", err);
      throw new Error("Invalid post ID");
    }
  };

  const handleSubmit = async (values: { author: string; email: string; content: string }) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const postIdInt = decodePostId(postId);

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/wp-json/wp/v2/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: postIdInt,
          author_name: values.author,
          author_email: values.email,
          content: values.content,
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        setSuccess("Comment posted successfully!");
        onCommentPosted(comment); // Notify the parent component
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to post comment.");
      }
    } catch (err) {
      setError("An error occurred while posting the comment.");
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    author: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    content: Yup.string().required("Comment is required"),
  });

  return (
    <>
      <h5
        className={`${lato.className} !text-[12px] !uppercase !text-center !tracking-widest !text-[#222] !mt-0 !mb-4`}
      >
        Leave A Comment
      </h5>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      {success && <p className="text-green-500 text-xs">{success}</p>}
      <Formik
        initialValues={{ author: "", email: "", content: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div className="lg:flex space-x-5 mb-5">
              <div className="lg:w-6/12">
                <label
                  htmlFor="author"
                  className={`${noto.className} text-[10px] text-[#333333] mb-[.4em] uppercase`}
                >
                  Name*
                </label>
                <Field
                  type="text"
                  name="author"
                  id="author"
                  className={`${noto.className} w-full border-[1px] border-[#eee] text-[#333] font-[400] text-[13px] py-[.85em] px-[1em] outline-none transition-all !focus:shadow-[2px 2px 0 #222] !focus:outline-none`}
                />
                <ErrorMessage name="author" component="div" className="text-red-500 text-xs" />
              </div>
              <div className="lg:w-6/12">
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
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
              </div>
            </div>
            <div className="lg:flex mb-3.5">
              <div className="w-full">
                <label
                  htmlFor="content"
                  className={`${noto.className} text-[10px] text-[#333333] mb-[.4em] uppercase`}
                >
                  Comment*
                </label>
                <Field
                  as="textarea"
                  name="content"
                  id="content"
                  className={`${noto.className} w-full border-[1px] border-[#eee] text-[#333] font-[400] text-[13px] py-[.85em] px-[1em] outline-none h-[14em] min-h-[14em] transition-all !focus:shadow-[2px 2px 0 #222] !focus:outline-none`}
                />
                <ErrorMessage name="content" component="div" className="text-red-500 text-xs" />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`${noto.className} cursor-pointer border-2 border-black text-[10px] uppercase px-[2.8em] py-[1.4em] pb-[1.2em] transition-all duration-200 hover:bg-black hover:text-white ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CommentForm;