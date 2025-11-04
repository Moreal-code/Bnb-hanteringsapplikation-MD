"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  const handleUpload = useCallback(
    (result: unknown) => {
      console.log("Upload result:", result);
      // Handle different event types from Cloudinary
      const typedResult = result as {
        event?: string;
        info?: string | { secure_url?: string; url?: string };
      };
      
      if (typedResult?.event === "success" || typedResult?.event === "upload-success") {
        let url: string | undefined;
        
        if (typeof typedResult.info === "string") {
          url = typedResult.info;
        } else if (typedResult.info && typeof typedResult.info === "object") {
          url = typedResult.info.secure_url || typedResult.info.url;
        }
        
        if (url && typeof url === "string") {
          console.log("Setting image URL:", url);
          onChange(url);
        } else {
          console.error("Invalid URL format:", url);
        }
      }
    },
    [onChange]
  );

  return (
    <CldUploadWidget
      uploadPreset="fnhetpim"
      onSuccess={handleUpload}
      options={{
        maxFiles: 1,
      }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open?.()}
            className="
          relative
          cursor-pointer
          hover:opacity-70
          transition
          border-2
          border-dashed
          border-neutral-300
          flex
          flex-col
          items-center
          justify-center
          gap-4
          p-20
          text-neutral-600"
          >
            <TbPhotoPlus size={50} />
            <div className="font-semibold text-lg">Click to upload</div>
            {value && (
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={value}
                  fill
                  alt="Upload"
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
