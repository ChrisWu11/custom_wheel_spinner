import React from "react";
import { X, Trash2 } from "lucide-react";
import { HistoryRecord } from "../../types";
import { menuData } from "../../lib/menuData";

interface MenuModalProps {
  // onDeleteRecord: (id: number) => void;
  // onClearHistory: () => void;
  onApplyConfig: (record: HistoryRecord) => void;
  onClose: () => void;
}

const MenuModal: React.FC<MenuModalProps> = ({
  // onDeleteRecord,
  // onClearHistory,
  onApplyConfig,
  onClose,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal history-modal">
        <div className="modal-header">
          <h3>主题大全</h3>
          <div className="header-actions">
            <button onClick={onClose} className="close-btn">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-content history-content">
          {menuData.length === 0 ? (
            <div className="empty-history">
              <p>暂无主题</p>
            </div>
          ) : (
            <div className="history-list">
              {menuData.map((record) => (
                <div key={record.id} className="history-item">
                  <div
                    className="history-info"
                    onClick={() => onApplyConfig(record)}
                  >
                    <h4 style={{ marginBottom: "16px" }}>{record.title}</h4>
                    <p className="options">选项: {record.items.join(", ")}</p>
                    <div className="apply-hint">点击应用此主题到转盘</div>
                  </div>
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRecord(record.id);
                    }}
                    className="delete-record-btn"
                  >
                    <Trash2 size={16} />
                  </button> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
