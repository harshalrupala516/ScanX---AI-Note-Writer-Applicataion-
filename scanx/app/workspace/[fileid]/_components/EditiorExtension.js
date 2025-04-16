
import React from "react";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3Icon,
  Highlighter,
  Italic,
  Sparkles,
  UnderlineIcon,
} from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { chatSession } from "configs/AIModel";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
function EditorExtension({ editor }) {
  const params = useParams();
  const fileid = params?.fileid || ""; // Ensure fileid is defined

  const SearchAI = useAction(api.myAction.SearchAI);
  const saveNotes = useMutation(api.notes.AddNotes);
  const { user, isLoaded, isSignedIn } = useUser();
  
  const onAiClick = async () => {
    toast("AI processing started...");
    if (!editor) return;

    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      " "
    );

    if (!selectedText.trim()) {
      console.warn("No text selected for AI processing.");
      return;
    }

    try {
      const result = await SearchAI({ query: selectedText, fileId: fileid });

      const UnformattedAns =
        typeof result === "string" ? JSON.parse(result) : result;
      let AllUnformattedAns =
        UnformattedAns?.map((item) => item.pageContent).join(" ") || "";

      const PROMPT = `
        For question: ${selectedText}
        The answer content is: ${AllUnformattedAns}
      `;

      const AiModelResult = await chatSession.sendMessage(PROMPT);
      const aiResponseText = await AiModelResult.response.text();
      const FinalAns = aiResponseText
  .replace(/\*\*(.*?)\*\*/g, "</ul></li><li><strong>$1</strong><ul>") // main topics
  .replace(/(?:\r\n|\r|\n)- (.*?)(?=\n|$)/g, "<li>$1</li>") // subtopics
  .replace(/^<\/ul><\/li>/, "") // remove first unnecessary closing
  .concat("</ul></li></ul>") // close the last open tags
  .replace(/``|html/g, "");


      const AllText = editor.getHTML();
      editor.commands.setContent(
        `${AllText}<div class="mt-4 p-4 border-l-4 border-purple-500 bg-gray-50 rounded-md">
          <h3 class="font-semibold text-purple-700 mb-2">AI Answer:</h3>
          <div class="text-gray-800 leading-relaxed">${FinalAns}</div>
        </div>`
      );
      

      if (!isLoaded) {
        console.error("Clerk user data is still loading...");
        return;
      }

      if (!isSignedIn) {
        console.error("User is not signed in, skipping saveNotes()");
        toast.error("You must be signed in to save notes.");
        return;
      }

      if (!user || !user.primaryEmailAddress?.emailAddress) {
        console.error("User data is missing, skipping saveNotes()");
        return;
      }

      console.log("Saving notes with:", {
        notes: editor.getHTML(),
        fileId: fileid,
        createdBy: user.primaryEmailAddress.emailAddress,
      });

      await saveNotes({
        notes: editor.getHTML(),
        fileId: fileid,
        createdBy: user.primaryEmailAddress.emailAddress,
      });
    } catch (error) {
      console.error("Error in AI processing:", error);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-white border border-gray-300 rounded-lg shadow-md">
      {editor && (
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-lg hover:bg-slate-100 border p-2 ${editor.isActive("bold") ? "bg-gray-300" : "bg-white"}`}
          >
            <Bold size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-lg hover:bg-slate-100 border p-2 ${editor.isActive("italic") ? "bg-gray-300" : "bg-white"}`}
          >
            <Italic size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHighlight({ color: "#ffc078" }).run()}
            className={`p-2 rounded-lg hover:bg-slate-100 border p-2 ${editor.isActive("highlight", { color: "#ffc078" }) ? "bg-yellow-300" : "bg-white"}`}
          >
            <Highlighter size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded-lg hover:bg-slate-100 border p-2 ${editor.isActive("underline") ? "bg-gray-300" : "bg-white"}`}
          >
            <UnderlineIcon size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded-lg hover:bg-slate-100 border p-2 ${editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : "bg-white"}`}
          >
            <Heading1 size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded-lg  hover:bg-slate-100 border p-2 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : "bg-white"}`}
          >
            <Heading2 size={20} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded-lg border p-2 ${editor.isActive("heading", { level: 3 }) ? "bg-gray-300" : "bg-white"}`}
          >
            <Heading3Icon size={20} />
          </button>
          <button onClick={onAiClick} className="p-2 rounded-lg border  text-purple-600 hover:text-white hover:bg-purple-600 ml-80 p-3">
            <Sparkles />
          </button>
        </div>
      )}
    </div>
  );
}  

export default EditorExtension;
