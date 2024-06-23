import { useEffect, useState } from "react";
import { supabaseClient } from "../../utility/supabase-client";
import Image from "next/image";

type ImageProps = {
  url?: any;
  size: {
    width: number;
    height: number;
  };
};

export default function RenderImage({ url, size }: ImageProps) {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (url) handleDownloadImage(url);
  }, [url]);

  async function handleDownloadImage(path: string) {
    try {
      const { data, error } = await supabaseClient.storage
        .from("subsidy")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setImageUrl(url);
    } catch (error: any) {
      console.log("Error downloading image: ", error?.message);
    }
  }

  return (
    <div>
      {imageUrl ? (
        <Image
          src={imageUrl}
          width={size?.width}
          height={size?.height}
          className=""
          alt=""
        />
      ) : (
        <div className="no-image" style={{ height: 20, width: 20 }}>
          no image
        </div>
      )}
    </div>
  );
}
