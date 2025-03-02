"use client";
import React from 'react'
import Error from "@/app/components/Error"
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "BKMower",
  description: "Page not found",
};

const error = () => {
  return (
    <Error />
  )
}

export default error