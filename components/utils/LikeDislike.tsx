"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AiFillLike, AiFillDislike } from "react-icons/ai";

interface LikeDislikeProps {
  likes?: number;
}

const LikeDislike = ({ likes: ls = 0 }: LikeDislikeProps) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(ls);
  const [dislikes, setDislikes] = useState(0);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikes(likes - 1);
    } else {
      setLiked(true);
      setLikes(likes + 1);
      if (disliked) {
        setDisliked(false);
        setDislikes(dislikes - 1);
      }
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
      setDislikes(dislikes - 1);
    } else {
      setDisliked(true);
      setDislikes(dislikes + 1);
      if (liked) {
        setLiked(false);
        setLikes(likes - 1);
      }
    }
  };

  return (
    <div className="flex items-center justify-between mt-3">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleLike}
        className={`flex items-center gap-1 transition-colors duration-200 ${
          liked ? "text-green-600" : "text-gray-500 hover:text-green-600"
        }`}
      >
        <AiFillLike size={20} />
        <span className="text-sm font-bold">{likes}</span>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleDislike}
        className={`flex items-center gap-0 transition-colors duration-200 ${
          disliked ? "text-red-500" : "text-gray-500 hover:text-red-500"
        }`}
      >
        <AiFillDislike size={20} />
        <span className="text-sm font-bold">{dislikes}</span>
      </motion.button>
    </div>
  );
};

export default LikeDislike;
