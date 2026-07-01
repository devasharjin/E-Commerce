import { useState } from "react";
import { useAllBanners, useCreateBanners } from "./api";

export function useAdminSettings() {
  const { data: banners, isLoading } = useAllBanners();
  const [files, setFiles] = useState<File[]>([]);

  const { mutateAsync, isPending } = useCreateBanners();

  async function handleUpload() {
    try {
      if (!files.length) return;

      const formData = new FormData();

      files.forEach((file) => {
        formData.append("images", file);
      });

      await mutateAsync(formData);

      setFiles([]);
    } catch (error) {
      console.error(error);
    }
  }

  const fieldData =
    files.length === 0
      ? "0 files selected"
      : `${files.length} files selected`;

  return {
    banners,
    isLoading,
    files,
    setFiles,
    handleUpload,
    fieldData,
    isPending,
  };
}