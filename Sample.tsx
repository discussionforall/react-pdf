import React from 'react';
import { useCallback, useState } from 'react';
import { useResizeObserver } from '@wojtekmaj/react-hooks';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './Sample.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

const resizeObserverOptions = {};
const maxWidth = 800;
const minScale = 0.5;
const maxScale = 2;

type PDFFile = string | File | null;

export default function Sample() {
  const [file, setFile] = useState<PDFFile>('./sample0.pdf');
  const [numPages, setNumPages] = useState<number>();
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;
    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { files } = event.target;
    const nextFile = files?.[0];
    if (nextFile) {
      setFile(nextFile);
    }
  }

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: {
    numPages: number;
  }): void {
    setNumPages(nextNumPages);
  }

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, maxScale));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, minScale));
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setStartDrag({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging) {
      const newX = offset.x + (event.clientX - startDrag.x);
      const newY = offset.y + (event.clientY - startDrag.y);

      // Calculate scaled dimensions
      const pdfWidth = Math.min(containerWidth || maxWidth, maxWidth) * scale;
      const pdfHeight = numPages ? pdfWidth * numPages : 0;

      // Set bounds
      const minX = Math.min(0, containerWidth! - pdfWidth);
      const maxX = 0;
      const minY = Math.min(0, containerWidth! - pdfHeight);
      const maxY = 0;

      // Constrain the new offsets
      const constrainedX = Math.max(minX, Math.min(newX, maxX));
      const constrainedY = Math.max(minY, Math.min(newY, maxY));

      setOffset({ x: constrainedX, y: constrainedY });
      setStartDrag({ x: event.clientX, y: event.clientY });
    }
  };

  return (
    <div className="container">
      <div className="dispute-numbers">
        <h2>Dispute Numbers</h2>
        <ul>
          <li onClick={() => setFile('./sample0.pdf')}>Dispute 1</li>
          <li onClick={() => setFile('./sample1.pdf')}>Dispute 2</li>
          <li onClick={() => setFile('./sample2.pdf')}>Dispute 3</li>
        </ul>
        <div className="load-file">
          <label htmlFor="file">Load from file:</label>
          <input onChange={onFileChange} type="file" />
        </div>
      </div>

      <div className="pdf-viewer">
        <h2>PDF Viewer</h2>
        <div className="pdf-controls">
          <button onClick={handleZoomIn}>Zoom In</button>
          <button onClick={handleZoomOut}>Zoom Out</button>
        </div>
        <div className="pdf-container" ref={setContainerRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
          <div className="pdf-content" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transformOrigin: '0 0', transition: 'transform 0.1s' }}>
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
              {Array.from(new Array(numPages), (_el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth} />
              ))}
            </Document>
          </div>
        </div>
      </div>

      <div className="additional-info">
        <h2>Additional Information</h2>
        {/* Additional Information content can be added here */}
      </div>
    </div>
  );
}
