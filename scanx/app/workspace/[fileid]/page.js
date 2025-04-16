"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Workspace_header from "./_components/workspace_header";
import PdfViewer from "./_components/PdfViewer";
import { useQueries } from "convex/react";
import { v } from "convex/values";
import { useQuery } from "convex/react";
import { query } from "../../../convex/_generated/server";
import TextEditor from "./_components/TextEditor";
import { api } from "../../../convex/_generated/api";
export const GetFileRecord = query(async ({ db }, { fileId }) => {
  return await db.get(fileId);
});

function Workspace() {
  const { fileid } = useParams();
  const fileInfo = useQuery(api.pdfStorage.GetFileRecord, {
    fileId: fileid,
  });
  useEffect(() => {
    console.log(fileInfo);
  }, [fileInfo]);
  return (
    <div>
      <Workspace_header fileName={fileInfo?.fileName ?? "No file name"} />
      <div className="grid grid-cols-2 gap-5">
        <div>
          {/*Text Editor*/}
          <TextEditor fileId={fileid} />
        </div>
        <div>
          {/*PDF Viewer*/}
          <PdfViewer fileUrl={fileInfo?.fileUrl} />
        </div>
      </div>
    </div>
  );
}

export default Workspace;
