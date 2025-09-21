import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { HistoryRecord } from '../../types';

interface HistoryModalProps {
  history: HistoryRecord[];
  onDeleteRecord: (id: number) => void;
  onClearHistory: () => void;
  onApplyConfig: (record: HistoryRecord) => void;
  onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({
  history,
  onDeleteRecord,
  onClearHistory,
  onApplyConfig,
  onClose
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal history-modal">
        <div className="modal-header">
          <h3>历史记录</h3>
          <div className="header-actions">
            {history.length > 0 && (
              <button onClick={onClearHistory} className="clear-btn">
                清空记录
              </button>
            )}
            <button onClick={onClose} className="close-btn">
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="modal-content history-content">
          {history.length === 0 ? (
            <div className="empty-history">
              <p>暂无历史记录</p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((record) => (
                <div key={record.id} className="history-item">
                  <div 
                    className="history-info"
                    onClick={() => onApplyConfig(record)}
                  >
                    <h4>{record.title}</h4>
                    <p className="result">结果: {record.result}</p>
                    <p className="timestamp">{record.timestamp}</p>
                    <p className="options">选项: {record.items.join(', ')}</p>
                    <div className="apply-hint">点击应用此配置到转盘</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRecord(record.id);
                    }}
                    className="delete-record-btn"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;