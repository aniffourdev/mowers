import React, { useState } from "react";
import { Lato, Noto_Sans } from "next/font/google";

const noto = Noto_Sans({ weight: "400", subsets: ["latin"] });
const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

interface CommentFormProps {
  postId: string; // This is the base64-encoded post ID
}

const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const [formData, setFormData] = useState({
    author: "",
    email: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Function to decode the base64 postId and extract the numeric ID
  const decodePostId = (encodedId: string): number => {
    try {
      // Decode the base64 string
      const decoded = atob(encodedId); // Example: "cG9zdDoyNg==" -> "post:26"
      // Extract the numeric ID using a regular expression
      const match = decoded.match(/post:(\d+)/);
      if (match && match[1]) {
        return parseInt(match[1], 10); // Convert the extracted ID to a number
      }
      throw new Error("Invalid post ID format");
    } catch (err) {
      console.error("Failed to decode postId:", err);
      throw new Error("Invalid post ID");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Decode the postId and extract the numeric ID
      const postIdInt = decodePostId(postId);

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/wp-json/wp/v2/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: postIdInt, // Send the numeric ID
          author_name: formData.author,
          author_email: formData.email,
          content: formData.content,
        }),
      });

      if (response.ok) {
        setSuccess("Comment posted successfully!");
        setFormData({ author: "", email: "", content: "" });
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

  return (
    <>
      <h5
        className={`${lato.className} !text-[12px] !uppercase !text-center !tracking-widest !text-[#222] !mt-0 !mb-4`}
      >
        Leave A Comment
      </h5>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      {success && <p className="text-green-500 text-xs">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="lg:flex space-x-5 mb-5">
          <div className="lg:w-6/12">
            <label
              htmlFor="author"
              className={`${noto.className} text-[10px] text-[#333333] mb-[.4em] uppercase`}
            >
              Name*
            </label>
            <input
              type="text"
              name="author"
              id="author"
              value={formData.author}
              onChange={handleChange}
              className={`${noto.className} w-full border-[1px] border-[#eee] text-[#333] font-[400] text-[13px] py-[.85em] px-[1em] outline-none transition-all !focus:shadow-[2px 2px 0 #222] !focus:outline-none`}
              required
            />
          </div>
          <div className="lg:w-6/12">
            <label
              htmlFor="email"
              className={`${noto.className} text-[10px] text-[#333333] mb-[.4em] uppercase`}
            >
              Email*
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`${noto.className} w-full border-[1px] border-[#eee] text-[#333] font-[400] text-[13px] py-[.85em] px-[1em] outline-none transition-all !focus:shadow-[2px 2px 0 #222] !focus:outline-none`}
              required
            />
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
            <textarea
              name="content"
              id="content"
              value={formData.content}
              onChange={handleChange}
              className={`${noto.className} w-full border-[1px] border-[#eee] text-[#333] font-[400] text-[13px] py-[.85em] px-[1em] outline-none h-[14em] min-h-[14em] transition-all !focus:shadow-[2px 2px 0 #222] !focus:outline-none`}
              required
            ></textarea>
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
      </form>
    </>
  );
};

export default CommentForm;