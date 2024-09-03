"use client";
import React, { useState } from "react";
import { Card, CardBody } from "@nextui-org/react";

const GeminiPrompt = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      setResponse(data.text_content || "No response content available");
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("An error occurred. Please try again later.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(response)
      .then(() => setCopySuccess("Copied!"))
      .catch(() => setCopySuccess("Failed to copy!"));
  };

  const defaultFAQ = `
    What is Next.js? 
    Next.js is a React framework that enables server-side rendering, static site generation, and API routes.

    How do you create dynamic routes in Next.js?
    Use brackets in the file name inside the pages directory, like [id].js, to create dynamic routes.

    What is the purpose of getStaticProps? 
    getStaticProps is used for static site generation, fetching data at build time for pre-rendered pages.

    When should I use getServerSideProps? 
    Use getServerSideProps to fetch data on each request for server-side rendering of dynamic content.
  `;

  return (
    <div className="h-screen flex flex-col items-center rounded-md dark:bg-gradient-to-r from-slate-900 to-slate-800 text-white">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter your prompt here"
          value={prompt}
          className="border border-gray-300 max-w-2xl w-[42rem] rounded-md p-2 m-6 outline-none text-black dark:text-white"
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#E114E5] text-white rounded-lg px-4 py-2 hover:bg-blue-600 max-w-md  focus:outline-none "
        >
          Generate
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
            />
          </svg>
        </button>
      </form>

      <Card className="max-w-2xl min-w-96 mx-auto mt-4 p-4 dark:bg-black border border-gray-300 rounded-lg shadow-md min-h-40">
        <CardBody>
          <p className="text-base whitespace-pre-line break-words text-center">
            {response || defaultFAQ}
          </p>

          {response && (
            <>
              <button
                onClick={copyToClipboard}
                className="mt-4 px-4 py-2 dark:bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded  focus:outline-none "
              >
                Copy Text
              </button>
              {copySuccess && (
                <p className="flex items-center justify-center mt-2 text-green-500 ">{copySuccess}</p>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default GeminiPrompt;
