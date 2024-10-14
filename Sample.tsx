import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useCallback, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./Sample.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const resizeObserverOptions = {};
const maxWidth = 800;
const minScale = 0.5;
const maxScale = 2;

type PDFFile = string | File | null;

export default function Sample() {
  const [file, setFile] = useState<PDFFile>("./sample0.pdf");
  const [activeFile, setActiveFile] = useState("./sample0.pdf");
  const [numPages, setNumPages] = useState<number>();
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isInsidePdfContext, setIsInsidePdfContext] = useState(false);
  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;
    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  useEffect(() => {
    // Reset scale whenever the file changes
    setScale(1);
    setOffset({ x: 0, y: 0 }); // Optionally reset the offset as well
  }, [file]);

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
    if (event.button === 1 || !isInsidePdfContext) return;
    setIsDragging(true);
    setStartDrag({ x: event.clientX, y: event.clientY });
    // (containerRef as HTMLElement).style.overflow = "hidden";
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    (containerRef as HTMLElement).style.overflow = "auto";
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
      console.log("min y = ", minY);
      console.log("new y = ", newY);
      console.log("max y = ", maxY);

      setOffset({ x: constrainedX, y: constrainedY });
      setStartDrag({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseEnter = () => {
    setIsInsidePdfContext(true);
  };

  const handleMouseLeave = () => {
    setIsInsidePdfContext(false);
    setIsDragging(false);
  };

  return (
    <div className="container">
      <div className="initiating-party">
        <div>
          <h2>Initiating Party</h2>
          <p>Initiating Party name</p>
          <input type="text" placeholder="LAKE OLIVER EMERGENCY GROUP LLC" />
        </div>
        <div>
          <h2>Non-Initiating Party</h2>
          <p>Non-Initiating Party name</p>
          <input type="text" placeholder="Florida Blue" />
        </div>
      </div>
      <div className="dispute-numbers-pdf-viewer">
        <div className="dispute-numbers">
          <h2>Dispute Numbers</h2>
          <ul>
            <li
              className={activeFile === "./sample0.pdf" ? "active" : ""}
              onClick={() => {
                setFile("./sample0.pdf");
                setActiveFile("./sample0.pdf");
              }}
            >
              Dispute 1
            </li>
            <li
              className={activeFile === "./sample1.pdf" ? "active" : ""}
              onClick={() => {
                setFile("./sample1.pdf");
                setActiveFile("./sample1.pdf");
              }}
            >
              Dispute 2
            </li>
            <li
              className={activeFile === "./sample2.pdf" ? "active" : ""}
              onClick={() => {
                setFile("./sample2.pdf");
                setActiveFile("./sample2.pdf");
              }}
            >
              Dispute 3
            </li>
          </ul>
        </div>
        <div className="additional-info-pdf-viewer">
          <div className="additional-info">
            <div className="table-container">
              <div className="table-row">
                <div className="table-header">Payment Date</div>
                <div className="table-header">Claim Number</div>
                <div className="table-header">Date of Service</div>
                <div className="table-header">Service Code</div>
                <div className="table-header">QPA Amount</div>
              </div>
              <div className="table-row">
                <div className="table-cell">
                  <input type="date" placeholder="" />
                </div>
                <div className="table-cell">
                  <input type="text" />
                </div>
                <div className="table-cell">
                  <input type="text" />
                </div>
                <div className="table-cell">
                  <input type="text" />
                </div>
                <div className="table-cell">
                  <input type="text" />
                </div>
              </div>
              <div className="table-row">
                <div className="table-cell">
                  <div className="radio-group">
                    <div>
                      <input
                        type="radio"
                        id="payment-yes"
                        name="payment-date"
                        value="yes"
                      />
                      <label htmlFor="payment-yes">Yes</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="payment-no"
                        name="payment-date"
                        value="no"
                        checked
                      />
                      <label htmlFor="payment-no">No</label>
                    </div>
                  </div>
                </div>
                <div className="table-cell">
                  <div className="radio-group">
                    <div>
                      <input
                        type="radio"
                        id="claim-yes"
                        name="claim-number"
                        value="yes"
                      />
                      <label htmlFor="claim-yes">Yes</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="claim-no"
                        name="claim-number"
                        value="no"
                        checked
                      />
                      <label htmlFor="claim-no">No</label>
                    </div>
                  </div>
                </div>
                <div className="table-cell">
                  <div className="radio-group">
                    <div>
                      <input
                        type="radio"
                        id="service-yes"
                        name="date-of-service"
                        value="yes"
                      />
                      <label htmlFor="service-yes">Yes</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="service-no"
                        name="date-of-service"
                        value="no"
                        checked
                      />
                      <label htmlFor="service-no">No</label>
                    </div>
                  </div>
                </div>
                <div className="table-cell">
                  <div className="radio-group">
                    <div>
                      <input
                        type="radio"
                        id="service-code-yes"
                        name="service-code"
                        value="yes"
                      />
                      <label htmlFor="service-code-yes">Yes</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="service-code-no"
                        name="service-code"
                        value="no"
                        checked
                      />
                      <label htmlFor="service-code-no">No</label>
                    </div>
                  </div>
                </div>
                <div className="table-cell">
                  <div className="radio-group">
                    <div>
                      {" "}
                      <input
                        type="radio"
                        id="qpa-yes"
                        name="qpa-amount"
                        value="yes"
                      />
                      <label htmlFor="qpa-yes">Yes</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="qpa-no"
                        name="qpa-amount"
                        value="no"
                        checked
                      />
                      <label htmlFor="qpa-no">No</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pdf-viewer">
            <div className="pdf-controls">
              <button onClick={handleZoomIn}>Zoom In</button>
              <button onClick={handleZoomOut}>Zoom Out</button>
            </div>
            <div
              className="pdf-container"
              ref={setContainerRef}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              <div
                className="pdf-content"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                  transformOrigin: "0 0",
                  transition: "transhtmlForm 0.1s",
                }}
              >
                <Document
                  file={file}
                  onLoadSuccess={onDocumentLoadSuccess}
                  options={options}
                >
                  {Array.from(new Array(numPages), (_el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      width={
                        containerWidth
                          ? Math.min(containerWidth, maxWidth)
                          : maxWidth
                      }
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  ))}
                </Document>
              </div>
            </div>
          </div>
          <div className="submit_btn_wrapper">
            <button>submit</button>
            <button>cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}