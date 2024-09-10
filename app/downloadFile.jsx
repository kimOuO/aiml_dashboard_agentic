import { getAPI } from "@/app/api/entrypoint";

// 下載檔案
export const HandleDownloadFile = (file) => {
  let file_path = file.f_file_uid.path + "/" + file.uid;

  // 根據是否有副檔名來設定文件路徑
  if (file.f_file_uid.extension && file.f_file_uid.extension !== "null") {
    file_path += "." + file.f_file_uid.extension;
  }

  const downloadFile = async () => {
    if (file_path) {
      try {
        // 呼叫 API 獲取文件數據
        const data = { file_path: file_path };
        //GeneralFileManager/download
        const response = await getAPI("TTiue1sygXrsm0YS", data, false, true);

        if (response.status === 200) {
          // 檢查響應的數據類型
          const blob = new Blob([response.data], {
            type: "application/octet-stream",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;

          // 設定下載文件名
          const filename =
            file.f_file_uid.extension && file.f_file_uid.extension !== "null"
              ? `${file.uid}.${file.f_file_uid.extension}`
              : file.uid;
          link.setAttribute("download", filename);

          // 觸發下載並清理
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url); // 釋放內存
        }
      } catch (error) {
        console.error("Download error:", error);
      }
    }
  };

  return { downloadFile };
};

export const HandlePrintLog = ({ task, type }) => {
  const PrintLog = async () => {
    if (task) {
      try {
        // 呼叫 API 獲取文件數據
        const data = { task_uid: task.uid, type: type };
        //TaskStatusManager/get_log 
        const response = await getAPI("bJ7xLmgp4WSWK498", data, false, true);

        if (response.status === 200) {
          console.log(response.data.data);
        } else if (response && response instanceof Error) {
          console.error("Error fetching:", response.data);
        }
      } catch (error) {
        console.error("Download error:", error);
      }
    }
  };

  return { PrintLog };
};
