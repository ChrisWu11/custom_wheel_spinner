import React, { useState, useEffect, useRef } from "react";
import { History, Shuffle, Play, Edit3, Menu, Heart } from "lucide-react";
import EditModal from "./EditModal";
import HistoryModal from "./HistoryModal";
import MenuModal from "./MenuModal";
import { generateColors } from "../../utils/colorGenerator";
import {
  loadWheelData,
  saveWheelData,
  loadHistory,
  saveHistory,
} from "../../utils/storage";
import { WheelData, HistoryRecord } from "../../types";
import "../../styles/CustomWheel.css";

const CustomWheel: React.FC = () => {
  const [title, setTitle] = useState("今天撸不撸");
  const [items, setItems] = useState([
    "三天不撸",
    "永远不撸",
    "一天不撸",
    "撸到昏",
    "再转一次",
    "看韩片撸",
    "看欧美撸",
    "看日片撸",
    "不撸",
    "大撸特撸",
    "偷偷撸",
    "只看不撸",
    "撸一晚上",
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [spinDuration, setSpinDuration] = useState(3000);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [colors, setColors] = useState<string[]>(() =>
    generateColors(items.length)
  );

  useEffect(() => {
    setColors(generateColors(items.length));
  }, [items.length]);

  useEffect(() => {
    const savedData = loadWheelData();
    if (savedData) {
      setTitle(savedData.title || "幸运转盘");
      setItems(savedData.items || items);
      setSpinDuration(savedData.spinDuration || 3000);
    }

    const savedHistory = loadHistory();
    if (savedHistory) {
      setHistory(savedHistory);
    }
  }, []);

  const addHistoryRecord = (newRecord: Omit<HistoryRecord, "id">) => {
    const recordWithId = { ...newRecord, id: Date.now() };
    const newHistory = [recordWithId, ...history];
    setHistory(newHistory);
    saveHistory(newHistory);
  };

  const spin = () => {
    if (isSpinning || items.length === 0) return;

    setIsSpinning(true);
    setResult(null);

    const randomIndex = Math.floor(Math.random() * items.length);
    const finalResult = items[randomIndex];

    const anglePerItem = 360 / items.length;
    const selectedItemCenterAngle =
      -90 + randomIndex * anglePerItem + anglePerItem / 2;
    const currentRotation = rotation % 360;
    const currentItemAngle = (currentRotation + selectedItemCenterAngle) % 360;

    let rotationNeeded = -90 - currentItemAngle;
    while (rotationNeeded <= 0) {
      rotationNeeded += 360;
    }

    const extraSpins = Math.floor(Math.random() * 5) + 5;
    const totalRotation = rotation + extraSpins * 360 + rotationNeeded;

    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(finalResult);
      addHistoryRecord({
        title,
        result: finalResult,
        timestamp: new Date().toLocaleString(),
        items: [...items],
      });
    }, spinDuration);
  };

  const shuffleItems = () => {
    if (isSpinning) return;
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setColors(generateColors(shuffled.length));
    setResult(null);
  };

  const handleSaveEdit = (data: WheelData) => {
    setTitle(data.title);
    setItems(data.items.filter((item) => item.trim()));
    setSpinDuration(data.spinDuration);
    setResult(null);
    setShowEditModal(false);

    setTimeout(() => {
      saveWheelData(data);
    }, 100);
  };

  const handleDeleteRecord = (id: number) => {
    const newHistory = history.filter((record) => record.id !== id);
    setHistory(newHistory);
    saveHistory(newHistory);
  };

  const handleClearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  const handleApplyConfig = (record: HistoryRecord) => {
    setTitle(record.title);
    setItems([...record.items]);
    setResult(null);

    const data: WheelData = {
      title: record.title,
      items: record.items,
      spinDuration,
    };
    saveWheelData(data);

    setShowHistoryModal(false);
    setShowMenuModal(false);
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="main-title">{title}</h1>
          <div className="result-display">
            {result ? (
              <>
                <span className="result-label">结果:</span>
                <span className="result-value">{result}</span>
              </>
            ) : (
              <span className="result-placeholder">等待转盘结果...</span>
            )}
          </div>
        </header>

        <div className="wheel-container">
          <div
            className="wheel-wrapper"
            style={{
              width: "min(500px, calc(100vw - 40px))",
              height: "min(500px, calc(100vw - 40px))",
              margin: "0 auto",
              position: "relative",
            }}
          >
            <div className="pointer"></div>

            <div
              ref={wheelRef}
              className={`wheel ${isSpinning ? "spinning" : ""}`}
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning
                  ? `transform ${spinDuration}ms cubic-bezier(0.15, 0, 0.25, 1)`
                  : "none",
                width: "100%",
                height: "100%",
              }}
            >
              <svg
                className="wheel-svg"
                viewBox="0 0 600 600"
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
              >
                {items.map((item, index) => {
                  const angle = 360 / items.length;
                  const startAngle = index * angle - 90;
                  const endAngle = (index + 1) * angle - 90;
                  const isResult = result && item === result && !isSpinning;

                  const centerX = 300;
                  const centerY = 300;
                  const radius = 300;

                  const startAngleRad = (startAngle * Math.PI) / 180;
                  const endAngleRad = (endAngle * Math.PI) / 180;

                  const x1 = centerX + radius * Math.cos(startAngleRad);
                  const y1 = centerY + radius * Math.sin(startAngleRad);
                  const x2 = centerX + radius * Math.cos(endAngleRad);
                  const y2 = centerY + radius * Math.sin(endAngleRad);

                  const largeArcFlag = angle > 180 ? 1 : 0;

                  const pathData = [
                    `M ${centerX} ${centerY}`,
                    `L ${x1} ${y1}`,
                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    "Z",
                  ].join(" ");

                  return (
                    <g key={index}>
                      <path
                        d={pathData}
                        fill={colors[index]}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="1"
                        className={`wheel-segment-path ${
                          isResult ? "highlight" : ""
                        }`}
                      />
                      {result && item !== result && !isSpinning && (
                        <path
                          d={pathData}
                          fill="rgba(0,0,0,0.5)"
                          className="segment-overlay-path"
                        />
                      )}
                      {/* 文本：末端贴外圈 */}
                      {(() => {
                        let displayText = item;
                        if (displayText.length > 6) {
                          displayText = displayText.slice(0, 6) + "…";
                        }

                        const fontSize = 22; // 固定字体大小
                        const outerRadius = radius * 0.85;

                        const angleMid = (startAngle + endAngle) / 2;
                        const angleRad = (angleMid * Math.PI) / 180;

                        const endX = centerX + outerRadius * Math.cos(angleRad);
                        const endY = centerY + outerRadius * Math.sin(angleRad);

                        return (
                          <text
                            x={endX}
                            y={endY}
                            textAnchor="end"
                            dominantBaseline="middle"
                            className="segment-text-svg"
                            fill="#2c3e50"
                            fontSize={fontSize}
                            fontWeight="600"
                            transform={`rotate(${angleMid} ${endX} ${endY})`}
                          >
                            {displayText}
                          </text>
                        );
                      })()}
                    </g>
                  );
                })}
              </svg>
            </div>

            <button
              className={`spin-btn ${isSpinning ? "spinning" : ""}`}
              onClick={spin}
              disabled={isSpinning || items.length === 0}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {isSpinning ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <Play size={24} />
                  <span>GO</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="controls">
          <button
            onClick={() => setShowMenuModal(true)}
            className="control-btn"
          >
            <Menu size={20} />
            <span>主题</span>
          </button>

          <button
            onClick={shuffleItems}
            className="control-btn "
            disabled={isSpinning}
          >
            <Shuffle size={20} />
            <span className="text">打乱顺序</span>
          </button>

          <button
            onClick={() => setShowEditModal(true)}
            className="control-btn"
          >
            <Edit3 size={20} />
            <span>编辑</span>
          </button>
        </div>

        <button
          onClick={() => setShowHistoryModal(true)}
          className="control-btn history-btn"
        >
          <History size={20} />
        </button>

        {/* <button
          onClick={shuffleItems}
          className="control-btn shuffle-btn"
          disabled={isSpinning}
        >
          <Shuffle size={20} />
          <span className="text">打乱顺序</span>
        </button> */}
      </div>

      {showEditModal && (
        <EditModal
          title={title}
          items={items}
          spinDuration={spinDuration}
          onSave={handleSaveEdit}
          shuffleItems={shuffleItems}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showHistoryModal && (
        <HistoryModal
          history={history}
          onDeleteRecord={handleDeleteRecord}
          onClearHistory={handleClearHistory}
          onApplyConfig={handleApplyConfig}
          onClose={() => setShowHistoryModal(false)}
        />
      )}

      {showMenuModal && (
        <MenuModal
          // onDeleteRecord={handleDeleteRecord}
          // onClearHistory={handleClearHistory}
          onApplyConfig={handleApplyConfig}
          onClose={() => setShowMenuModal(false)}
        />
      )}
    </div>
  );
};

export default CustomWheel;
