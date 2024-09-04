import { getAPI } from "@/app/api/entrypoint";

// 下載檔案
export const HandleDownloadFile = (file) => {
  let file_path = "";

  if (file.f_file_uid.extension !== "null") {
    file_path =
      file.f_file_uid.path + "/" + file.uid + "." + file.f_file_uid.extension;
  } else {
    file_path = file.f_file_uid.path + "/" + file.uid;
  }

  // const file_path =
  //   "1fceb3f6-275f-4070-bfb6-3be85160c5fc/3f916f7e-dac9-4fb5-8152-939c86ada8da/Original/795e0169-0535-46dc-a2cb-5fb0d19d6bbb.zip";
  console.log("file path:", file_path);
  const downloadFile = async () => {
    if (file_path) {
      try {
        // GeneralFileManager/download
        const data = { file_path: file_path };
        console.log(data);
        const response = await getAPI("TTiue1sygXrsm0YS", data, false, true);
        console.log(response);
        if (response.status === 200) {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute(
            "download",
            `${file.uid}.${file.f_file_uid.extension}`
          );
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        }
      } catch (error) {
        // console.error("Download error:", error);
      }
    }
  };

  return { downloadFile };
};
