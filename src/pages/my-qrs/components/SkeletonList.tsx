import React from "react";
import { Box } from "zmp-ui";

export const SkeletonList: React.FC = () => {
  // Render 3 skeleton cards in a stacked layout
  const skeletons = [0, 1, 2];

  return (
    <Box p={4}>
      {skeletons.map((index) => (
        <div
          key={index}
          className="mx-auto max-w-[400px] aspect-[1.586/1] relative w-full h-[250px] rounded-3xl p-7 flex flex-col justify-between border border-gray-100 bg-gray-50 shadow-md animate-pulse"
          style={{
            marginTop: index === 0 ? "0px" : "-125px",
            zIndex: index,
          }}
        >
          {/* Top section */}
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-3">
              {/* Title placeholder */}
              <div className="h-6 bg-gray-200 rounded-md w-3/4" />
              {/* Badges placeholder */}
              <div className="flex gap-2">
                <div className="h-5 bg-gray-200 rounded-full w-20" />
                <div className="h-5 bg-gray-200 rounded-full w-14" />
              </div>
            </div>
            {/* More options button placeholder */}
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
          </div>

          {/* Bottom section */}
          <div className="flex justify-between items-end">
            {/* Date placeholder */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
            {/* QR display block placeholder */}
            <div className="w-28 h-28 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      ))}
    </Box>
  );
};

export default SkeletonList;
