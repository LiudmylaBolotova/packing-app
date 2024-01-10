// PackingAlgorithm.tsx

import React from 'react';
import './PackingAlgorithm.css';

interface Block {
  width: number;
  height: number;
  quantity: number;
  usedArea?: number;
}

const sheetWidth = 20;
const sheetHeight = 40;
const maxSheetArea = sheetWidth * sheetHeight;

const blocks: Block[] = [
  { width: 5, height: 7, quantity: 50 },
  { width: 3, height: 4.5, quantity: 70 },
  { width: 9, height: 2, quantity: 50 },
];

const calculateBlockArea = (block: Block) => block.width * block.height;

const findBestFit = (remainingBlocks: Block[], remainingSheetArea: number): Block[] | null => {
  for (const block of remainingBlocks) {
    if (block.quantity > 0 && calculateBlockArea(block) <= remainingSheetArea) {
      return [block];
    }
  }
  return null;
};

const PackingAlgorithm: React.FC = () => {
  const arrangeBlocks = () => {
    let remainingBlocks = [...blocks];
    let sheets: Block[][] = [];

    while (remainingBlocks.length > 0) {
      let currentSheet: Block[] = [];
      let remainingSheetArea = maxSheetArea;

      let block = findBestFit(remainingBlocks, remainingSheetArea);

      while (block !== null) {
        const [fittingBlock] = block;
        const blockArea = calculateBlockArea(fittingBlock);
        currentSheet.push({ ...fittingBlock, usedArea: blockArea, quantity: 1 });
        remainingSheetArea -= blockArea;
        fittingBlock.quantity--;

        block = findBestFit(remainingBlocks, remainingSheetArea);
      }

      if (currentSheet.length === 0) {
        // Unable to fit any remaining block on the sheet
        break;
      }

      sheets.push(currentSheet);
    }

    return sheets;
  };

  const getBlockSummary = (sheet: Block[]) => {
    const summary: Record<string, number> = {};
    sheet.forEach((block) => {
      const key = `${block.width} x ${block.height}`;
      summary[key] = (summary[key] || 0) + block.quantity;
    });
    return summary;
  };

  const sheets = arrangeBlocks();

  return (
    <div className="container">
      {sheets.map((sheet, index) => (
        <div key={index} className="sheet">
          <div className="sheet-title">Sheet {index + 1}</div>
          <div className="block-summary">
            <p className="summary">
              Block Summary:
            </p>
            <ul>
              {Object.entries(getBlockSummary(sheet)).map(([size, count], summaryIndex) => (
                <li key={summaryIndex}>{`${count} - ${size}`}</li>
              ))}
            </ul>
          </div>
          <p className="total-used-area">
            Total Used Area: {sheet.reduce((total, block) => total + (block.usedArea || 0), 0)} square inches
          </p>
        </div>
      ))}
    </div>
  );
};

export default PackingAlgorithm;




