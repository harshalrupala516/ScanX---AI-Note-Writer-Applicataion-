"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../convex/_generated/api";

function Dashboard() {
  const { user } = useUser();
  const fileList = useQuery(api.pdfStorage.GetUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });
  console.log(fileList);
  return (
    <div>
      <h2 className="font-medium text-4xl">Workspace</h2>
    </div>
  );
}

export default Dashboard;
