import clsx from "clsx";
import Image from "next/image";
import { Reply, ChevronUp } from "lucide-react";
import { useState } from "react";
import { MdOutlineComment } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { Comment, commentsData } from "@/public/data";

const CommentsSection = () => {
  const [comments, setComments] = useState<Comment[]>(commentsData);
  const [newCommentText, setNewCommentText] = useState("");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [openReplyForm, setOpenReplyForm] = useState<string | null>(null);

  const addReplyToComment = (
    comments: Comment[],
    commentId: string,
    reply: Comment
  ): Comment[] => {
    return comments.map((c) => {
      if (c.id === commentId) {
        return { ...c, replies: [...c.replies, reply] };
      }
      if (c.replies && c.replies.length > 0) {
        return {
          ...c,
          replies: addReplyToComment(c.replies, commentId, reply),
        };
      }
      return c;
    });
  };

  const handleSubmitComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      name: "نام کاربر",
      message: newCommentText,
      date: new Date().toLocaleDateString("fa-IR"),
      profile: "/images/profile/Avatar-24-24.png",
      replies: [],
    };
    setComments((prev) => [newComment, ...prev]);
    setNewCommentText("");
  };

  const handleSubmitReply = (
    e: React.FormEvent<HTMLFormElement>,
    commentId: string
  ) => {
    e.preventDefault();
    if (!replyText[commentId]?.trim()) return;
    const newReply: Comment = {
      id: Date.now().toString(),
      name: "نام کاربر",
      message: replyText[commentId],
      date: new Date().toLocaleDateString("fa-IR"),
      profile: "/images/profile/Avatar-24-24.png",
      replies: [],
    };
    setComments((prev) => addReplyToComment(prev, commentId, newReply));
    setReplyText((prev) => ({ ...prev, [commentId]: "" }));
    setOpenReplyForm(null);
  };

  const handleReply = (id: string) => {
    setOpenReplyForm(openReplyForm === id ? null : id);
  };

  const renderComment = (comment: Comment) => {
    return (
      <div key={comment.id} className="p-8 mb-6 bg-[#fafafa] shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-6">
            {/* Profile Image */}
            <div className="relative w-6 h-6">
              <Image
                src={comment.profile}
                alt={`${comment.name} profile`}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <span className="font-bold text-sm text-[#4D4D4D]">
              {comment.name}
            </span>
          </div>
          <button className="p-1" onClick={() => handleReply(comment.id)}>
            {openReplyForm === comment.id ? <ChevronUp /> : <Reply />}
          </button>
        </div>
        {/* Comment Message */}
        <div
          className={clsx(
            "flex items-start gap-2 mt-2",
            openReplyForm === comment.id && "border-b pb-6"
          )}
        >
          <p className="text-xs text-[#666666] leading-6">{comment.message}</p>
        </div>
        {/* Animated Reply Form */}
        <AnimatePresence>
          {openReplyForm === comment.id && (
            <motion.form
              onSubmit={(e) => handleSubmitReply(e, comment.id)}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6"
            >
              <div className="bg-[#fafafa] py-3 px-5 mb-2 flex items-center gap-2">
                <textarea
                  value={replyText[comment.id] || ""}
                  onChange={(e) =>
                    setReplyText({
                      ...replyText,
                      [comment.id]: e.target.value,
                    })
                  }
                  placeholder="دیدگاه خود را درج کنید..."
                  className="flex-1 bg-white p-2 outline-none text-sm min-h-20 resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-[#214254] py-2 text-sm font-medium"
              >
                افزودن دیدگاه
              </button>
            </motion.form>
          )}
        </AnimatePresence>
        {/* Render nested replies recursively */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-8 ml-6 border-l-2 border-gray-200 pl-4">
            {comment.replies.map((reply) => renderComment(reply))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-20 border-t">
      {/* Add Comment Form Header */}
      <div className="border-b w-full max-w-4xl">
        <h5 className="mt-8 mb-4 flex gap-3 items-center">
          <MdOutlineComment className="text-gray-600 text-xl" />
          دیدگاه خود را درج کنید
        </h5>
      </div>
      {/* Add Comment Form */}
      <form
        onSubmit={handleSubmitComment}
        className="max-w-4xl w-full bg-[#fafafa]"
      >
        <div className="py-3 px-5 mt-5 mb-2 flex items-center gap-2">
          <p className="text-sm">نام کاربری اینجا درج میشود</p>
        </div>
        <div className="py-3 px-5 mb-2 flex items-center gap-2">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="دیدگاه خود را درج کنید..."
            className="flex-1 bg-white outline-none text-sm min-h-20 resize-none"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full text-white bg-[#214254] py-2 text-sm font-medium"
        >
          افزودن دیدگاه
        </button>
      </form>
      {/* Show Comments Section */}
      <div className="mt-10 max-w-4xl">
        {comments.map((comment) => renderComment(comment))}
      </div>
    </div>
  );
};

export default CommentsSection;
