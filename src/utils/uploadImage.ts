export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "product_uploads"); 
  formData.append("cloud_name", "di423bmak");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/di423bmak/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  console.log("Cloudinary response:", data); // for debugging

  if (data.secure_url) {
    return data.secure_url; // final image URL
  }

  throw new Error(data.error?.message || "Upload failed");
};
