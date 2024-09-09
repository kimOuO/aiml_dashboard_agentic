import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LinkApplicationModal } from "./linkapplicationModal"; // 新的 Modal 組件
import { HandlePublishToggle } from "./service"; // API 處理邏輯
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function LinkApplicationCard({
  agentUID,
  projectName,
  application,
  onEdit,
  onDelete,
}) {
  const router = useRouter();
  const [isLinkApplicationModalOpen, setIsLinkApplicationModalOpen] =
    useState(false);
  const [isPublish, setIsPublish] = useState(false); // 假設初始化為未連接狀態

  const handleApplicationClick = () => {
    router.push(
      `/projects/${projectName}/applications/${application.name}/dashboard?applicationUID=${application.uid}`
    );
  };

  const handlePublishToggle = async () => {
    setIsLinkApplicationModalOpen(true); // 開啟 Modal
  };

  const handleConfirmToggle = async () => {
    setIsLinkApplicationModalOpen(false); // 關閉 Modal
    const response = await HandlePublishToggle(application.uid, isPublish);
    console.log(response);
    if (response) {
      setIsPublish(!isPublish); // 更新本地狀態
    } else {
    }
  };

  const handleCloseModal = () => {
    setIsLinkApplicationModalOpen(false); // 關閉 Modal
  };

  return (
    <div className="relative bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
      <div onClick={handleApplicationClick} className="cursor-pointer">
        <div className="bg-blue-300 rounded-lg p-0.5">{application.uid}</div>
        <h2 className="text-xl font-semibold p-1">{application.name}</h2>
        <p className="text-gray-500">{application.description}</p>
      </div>
      <div className="flex space-x-8 px-5 items-center">
        <Switch checked={isPublish} onCheckedChange={handlePublishToggle} />
        <Label className="text-lg" htmlFor="publish">
          {isPublish ? "Unlink Application" : "Link Application"}
        </Label>
      </div>

      {isLinkApplicationModalOpen && (
        <LinkApplicationModal
          isPublish={isPublish}
          onConfirm={handleConfirmToggle}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
