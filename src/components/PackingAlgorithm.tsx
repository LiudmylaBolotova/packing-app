
import React, { useEffect, useState } from 'react';
import './PackingAlgorithm.css';

interface Block {
  width: number;
  height: number;
  quantity: number;
}

interface Sheet {
  blocks: Block[];
  filledArea: number;
}

const maxSheetArea = 800;
const blocks: Block[] = [
  { width: 5, height: 7, quantity: 50 },
  { width: 3, height: 4.5, quantity: 70 },
  { width: 9, height: 2, quantity: 50 },
];

const PackingAlgorithm: React.FC = () => {
  const [sheets, setSheets] = useState<Sheet[]>([]);

  useEffect(() => {
    calculateSheetCountAndArrangement();
  }, []);

  const calculateSheetCountAndArrangement = () => {
    let remainingBlocks: Block[] = [...blocks];
    let calculatedSheets: Sheet[] = [];

    while (remainingBlocks.some(block => block.quantity > 0)) {
      let currentSheetArea = 0;
      let currentSheetBlocks: Block[] = [];

      remainingBlocks.sort((a, b) => b.width * b.height - a.width * a.height);

      for (let i = 0; i < remainingBlocks.length; i++) {
        const block = remainingBlocks[i];
        const blockArea = block.width * block.height;

        if (currentSheetArea + blockArea <= maxSheetArea && block.quantity > 0) {
          const blocksToAdd = Math.min(
            Math.floor((maxSheetArea - currentSheetArea) / blockArea),
            block.quantity
          );

          currentSheetArea += blocksToAdd * blockArea;
          remainingBlocks[i].quantity -= blocksToAdd;

          for (let j = 0; j < blocksToAdd; j++) {
            currentSheetBlocks.push({ ...block, quantity: 1 });
          }
        }
      }

      if (currentSheetBlocks.length > 0) {
        calculatedSheets.push({ blocks: currentSheetBlocks, filledArea: currentSheetArea });
      } else {
        break;
      }
    }

    setSheets(calculatedSheets);
  };

  return (
    <div>
      {sheets.map((sheet, index) => (
        <div key={index} className="sheet-container">
          <h3 className="sheet-header">Sheet {index + 1}</h3>
          <p className="filled-area-info">Filled Area: {sheet.filledArea} sq. inches</p>
          <div className="block-container">
            {sheet.blocks.map((block, blockIndex) => (
              <div
                key={blockIndex}
                className={`block block-${block.width}`}
                style={{
                  width: `${block.width * 20}px`,
                  height: `${block.height * 20}px`,
                }}
              >
                {block.width}x{block.height}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PackingAlgorithm;
