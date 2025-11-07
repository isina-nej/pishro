"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AiFillLike, AiFillDislike } from "react-icons/ai";

interface LikeDislikeProps {
  likes?: number;
}

const LikeDislike = ({ likes: initialLikes = 0 }: LikeDislikeProps) => {
  const [likes] = useState<number>(initialLikes);
  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
    } else {
      setLiked(true);
      if (disliked) setDisliked(false);
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
    } else {
      setDisliked(true);
      if (liked) {
        setLiked(false);
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
      </motion.button>

      <span className="text-sm font-bold">
        {likes + (liked ? 1 : 0) + (disliked ? -1 : 0)}
      </span>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleDislike}
        className={`flex items-center gap-1 transition-colors duration-200 ${
          disliked ? "text-red-500" : "text-gray-500 hover:text-red-500"
        }`}
      >
        <AiFillDislike size={20} />
      </motion.button>
    </div>
  );
};

export default LikeDislike;
