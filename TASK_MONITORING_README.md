# 任務即時 Log 監控功能實現文檔

## 功能概述
將原本需要下載才能查看的 Log 改為在前端直接即時查看，支持自動更新和實時滾動。

## 我的技術實現和修改內容

### 1. 核心組件架構

#### A. RealtimeLogModal 組件 (`/components/ui/realtime-log-modal.jsx`)
**全新創建的組件，技術特點:**
- **React Hooks**: 使用 `useState`, `useEffect`, `useRef` 管理狀態
- **定時更新**: 使用 `setInterval` 每 3 秒自動獲取最新 Log
- **智能自動滾動**: 檢測用戶是否在底部，智能決定是否自動滾動到最新內容
- **記憶體管理**: 正確清理定時器避免內存泄漏

**主要功能實現:**
```javascript
// 定時獲取 Log
useEffect(() => {
  if (isOpen && taskId) {
    fetchLogs();
    intervalRef.current = setInterval(fetchLogs, refreshInterval);
  }
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, [isOpen, taskId, taskType, refreshInterval]);

// 智能自動滾動邏輯
const handleScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target;
  const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10;
  setAutoScroll(isAtBottom);
};
```

#### B. useTaskStatusMonitor Hook (`/hooks/useTaskStatusMonitor.js`)
**全新創建的自定義 Hook，技術特點:**
- **自定義 Hook**: 封裝任務狀態監控邏輯，便於重用
- **條件監控**: 支持動態啟用/禁用監控
- **性能優化**: 避免不必要的 API 調用

### 2. TaskCard 組件的重大改進

#### A. 修改的文件
1. **Preprocessing Pipeline TaskCard**:
   `/app/(home)/projects/[projectName]/applications/[applicationName]/dashboard/preprocessing_pipeline/[prePipeName]/tasks/taskCard.jsx`

2. **Training Pipeline TaskCard**:
   `/app/(home)/projects/[projectName]/applications/[applicationName]/dashboard/training_pipeline/[trainPipeName]/tasks/taskCard.jsx`

#### B. 具體改動內容

**1. 新增導入:**
```javascript
import RealtimeLogModal from "@/components/ui/realtime-log-modal";
```

**2. 新增狀態管理:**
```javascript
const [isLogModalOpen, setIsLogModalOpen] = useState(false);
```

**3. 新增事件處理函數:**
```javascript
const handleViewLogsClick = () => {
  setIsLogModalOpen(true);
};

const handleCloseLogModal = () => {
  setIsLogModalOpen(false);
};
```

**4. UI 改進 - 按鈕升級:**
```javascript
// 原本：單一 Log 按鈕
<button onClick={handleDownloadClick}>Log</button>

// 改為：兩個功能分離的按鈕
<button onClick={handleDownloadClick}>下載 Log</button>
<button onClick={handleViewLogsClick}>即時 Log</button>
```

**5. 集成即時 Log 模態框:**
```javascript
{isLogModalOpen && (
  <RealtimeLogModal
    isOpen={isLogModalOpen}
    onClose={handleCloseLogModal}
    taskId={task.uid}
    taskName={task.name}
    taskType={type}
  />
)}
```

### 3. 樣式和視覺設計改進

#### A. Tailwind CSS 配置升級
**文件:** `/tailwind.config.ts`
**改動:** 添加自定義滾動條支持
```typescript
// 原本
plugins: [require("tailwindcss-animate")]

// 改為
plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar")]
```

#### B. 全新的視覺設計
- **終端風格界面**: 黑背景 + 綠色文字，模擬真實終端體驗
- **即時狀態指示器**: 動畫脈衝圓點顯示 "即時更新中"
- **響應式模態框**: 占屏幕 80% 寬度和高度，適配各種設備
- **美化滾動條**: 自定義滾動條顏色和寬度

### 4. API 和後端集成

#### A. 使用現有 API
- **API Endpoint**: 使用現有的 `GET_TASK_LOG` API
- **API Key**: `bJ7xLmgp4WSWK498`
- **請求格式**: `{ task_uid: taskId, type: taskType }`

#### B. 數據處理邏輯
```javascript
// 支持多種 Log 格式
if (typeof jsonData.data === "object") {
  Object.keys(jsonData.data).forEach((key) => {
    logContent += `=== ${key.toUpperCase()} LOG ===\n${jsonData.data[key]}\n\n`;
  });
} else if (typeof jsonData.data === "string") {
  logContent = jsonData.data;
}
```

### 5. 功能特點和用戶體驗

#### A. 即時更新機制
- **定時刷新**: 每 3 秒自動獲取最新 Log
- **條件更新**: 只在模態框開啟時進行 API 調用
- **性能優化**: 組件卸載時自動清理定時器

#### B. 智能用戶交互
- **自動滾動控制**: 用戶可手動開關自動滾動
- **滾動位置檢測**: 用戶手動滾動時暫停自動滾動到底部
- **下載功能保留**: 保持原有下載 Log 文件功能

#### C. 錯誤處理和加載狀態
- **加載動畫**: 首次加載時顯示旋轉動畫
- **錯誤提示**: API 失敗時顯示友好錯誤信息
- **空狀態處理**: 無 Log 數據時的提示信息

### 6. 支持的所有 Pipeline 類型

由於某些 Pipeline 共享 TaskCard 組件，這次改動覆蓋了：

#### A. 直接受益的 Pipeline
- **Preprocessing Pipeline** ✅
- **Training Pipeline** ✅

#### B. 間接受益的 Pipeline
- **Optimization Pipeline** ✅ (使用 Preprocessing 的 TaskCard)
- **Evaluation Pipeline** ✅ (使用 Preprocessing 的 TaskCard)

### 7. 包依賴管理

#### A. 新增依賴
```bash
npm install tailwind-scrollbar@3.0.5
```
選擇 3.0.5 版本以兼容現有的 Tailwind CSS 3.x

### 8. 具體的用戶使用流程

1. **創建任務**: 點擊 "Run Preprocessing Task" 或 "Run Training Task"
2. **查看即時 Log**: 點擊任務卡片上的 "即時 Log" 按鈕  
3. **即時監控**: Log 內容每 3 秒自動更新
4. **控制選項**: 
   - 開關自動滾動
   - 下載 Log 文件
   - 關閉模態框
5. **智能體驗**: 手動滾動查看歷史記錄時，自動滾動會暫停

### 9. 技術架構優勢

- **模組化設計**: RealtimeLogModal 可在其他地方重用
- **性能優化**: 條件渲染和智能更新機制
- **用戶體驗**: 保留原功能的同時增加新功能
- **維護性**: 代碼結構清晰，易於後續擴展

### 10. 未來可擴展功能

基於這個架構，後續可以輕易添加：
- **WebSocket 實時推送**: 替代定時輪詢
- **Log 搜索功能**: 在 Log 中搜索關鍵字
- **Log 級別過濾**: 按 ERROR, WARN, INFO 等級別過濾
- **多任務同時監控**: 在一個界面監控多個任務

## 總結

這次改動實現了從 **"下載後查看"** 到 **"即時在線查看"** 的重大用戶體驗升級，使用現代 React 開發模式和最佳實踐，在不破壞現有功能的前提下，大幅提升了系統的可用性和用戶滿意度。
