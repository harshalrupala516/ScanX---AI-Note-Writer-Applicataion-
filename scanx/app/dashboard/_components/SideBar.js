"use client"
import { Layout, LayoutGridIcon, Shield } from "lucide-react";
import { Button } from "../../../components/components/ui/button";
import Image from "next/image";
import React from "react";
import { Progress } from "../../../components/components/ui/progress";
import UploadPdf from "./UploadPdf";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@convex/api";
import { usePathname } from "next/navigation";

function SideBar() {
  const { user } = useUser();
  const path = usePathname();
  const GetUserInfo=useQuery(api.user.GetUserInfo,{
    userEmail:user?.primaryEmailAddress?.emailAddress
  });
  console.log(GetUserInfo)
    const fileList = useQuery(api.pdfStorage.GetUserFiles, {
      userEmail: user?.primaryEmailAddress?.emailAddress,
    });
    console.log(fileList?.length)
  return (
    <div className="shadow-md h-screen p-8 ">
      <Link href="/">
      <Image src={"/ScanX_Logo.png"} alt="logo" width={280} height={280} />
      </Link>
      <div className="pt-5">
        <UploadPdf isMaxFile={fileList?.length>=5&&!GetUserInfo.upgrade}>
        <Button className="w-full">+ Upload PDF</Button>
        </UploadPdf>
      </div>
      <Link href={'/dashboard'}>
      <div className={`flex gap-2 items-center p-2 mt-10 hover:bg-slate-100 rounded-lg cursor-pointer ${path=='/dashboard'&&'bg-slate-200'}`}>
        <LayoutGridIcon />
        <h2>Workspace</h2>
      </div>
      </Link>
      <Link href={'/dashboard/upgrade'}>
      <div className={`flex gap-2 items-center p-2 mt-1 hover:bg-slate-100 rounded-lg cursor-pointer ${path=='/dashboard/upgrade'&&'bg-slate-200'}`}>
        <Shield />
        <h2>Upgrade</h2>
      </div>
      </Link>
      {!GetUserInfo?.upgrade && <div className="absolute bottom-24 w-[80%]">
        <Progress value={(fileList?.length/5)*100} />
        <p className="text-sm mt-1">{fileList?.length} out of 5 Pdf uploaded</p>
        <p className="text-sm text-gray-400 mt-2">Upgrade to upload more Pdf</p>
      </div>
}
    </div>
  );
}

export default SideBar;