"use client";
import React from "react";
import { LuSearch } from "react-icons/lu";
import SearchComponent from "@/app/components/SearchComponent";
import { motion, AnimatePresence } from "framer-motion";

const Search = () => {
  const [search, setSearch] = React.useState(false);

  const handleSearch = () => {
    setSearch(true);
  };

  const closeSearchPopup = () => {
    setSearch(false);
  };

  // console.log("Search state:", search);

  return (
    <>
      <LuSearch className="size-5 cursor-pointer" onClick={handleSearch} />
      <AnimatePresence>
        {search && (
          <motion.div
            initial={{ y: "-100vh", marginTop: "61px" }} // Start from below the header
            animate={{ y: "0", marginTop: "61px" }}
            exit={{ y: "-100vh", marginTop: "61px" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-start mt-[61px]"
          >
            <SearchComponent onClose={closeSearchPopup} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Search;
