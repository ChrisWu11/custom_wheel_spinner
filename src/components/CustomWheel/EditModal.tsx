import React, { useState } from 'react';
import { X, Trash2, Plus } from 'lucide-react';
import { WheelData } from '../../types';

interface EditModalProps {
  title: string;
  items: string[];
  spinDuration: number;
  onSave: (data: WheelData) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
  title,
  items,
  spinDuration,
  onSave,
  onClose
}) => {
  const [editTitle, setEditTitle] = useState(title);
  const [editItems, setEditItems] = useState([...items]);
  const [editDuration, setEditDuration] = useState(spinDuration);

  const addItem = () => {
    setEditItems([...editItems, `新选项${editItems.length + 1}`]);
  };

  const removeItem = (index: number) => {
    if (editItems.length > 2) {
      setEditItems(editItems.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, value: string) => {
    const updated = [...editItems];
    updated[index] = value;
    setEditItems(updated);
  };

  const saveChanges = () => {
    onSave({
      title: editTitle,
      items: editItems.filter(item => item.trim()),
      spinDuration: editDuration
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>编辑转盘</h3>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="form-group">
            <label>标题</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>转盘时间 (秒)</label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={editDuration / 1000}
              onChange={(e) => setEditDuration(Number(e.target.value) * 1000)}
              className="range-input"
            />
            <span>{editDuration / 1000}秒</span>
          </div>

          <div className="form-group">
            <label>转盘选项</label>
            <div className="items-list">
              {editItems.map((item, index) => (
                <div key={index} className="item-row">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem(index, e.target.value)}
                    className="item-input"
                  />
                  {editItems.length > 2 && (
                    <button
                      onClick={() => removeItem(index)}
                      className="remove-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addItem} className="add-btn">
                <Plus size={16} /> 添加选项
              </button>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">
            取消
          </button>
          <button onClick={saveChanges} className="save-btn">
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;