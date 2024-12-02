import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import ScrollContainer from "react-indiana-drag-scroll"; 
import "./Sample.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

type PDFFile = string | File | null;

export default function Sample() {
  const [file, setFile] = useState<PDFFile>("./sample0.pdf");
  const [activeFile, setActiveFile] = useState("./sample0.pdf");
  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState(1.0); 
  const [selectedDispute, setSelectedDispute] = useState<string>("Dispute 1"); // New state for selected dispute

  useEffect(() => {
    setScale(1);
  }, [file]);

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: {
    numPages: number;
  }): void {
    setNumPages(nextNumPages);
  }

  const zoomIn = () => {
    if (scale < 5) {
      setScale(prevScale => prevScale + 0.5);
    }
  };

  const zoomOut = () => {
    if (scale > 0.5) {
      setScale(prevScale => prevScale - 0.5);
    }
  };

  const zoomReset = () => {
    setScale(1.0);
  };

  return (
    <div className="container">
      <h1>{selectedDispute}</h1> {/* Display the selected dispute here */}
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
                setSelectedDispute("Dispute 1"); // Update selected dispute
              }}
            >
              Dispute 1
            </li>
            <li
              className={activeFile === "./sample1.pdf" ? "active" : ""}
              onClick={() => {
                setFile("./sample1.pdf");
                setActiveFile("./sample1.pdf");
                setSelectedDispute("Dispute 2"); // Update selected dispute
              }}
            >
              Dispute 2
            </li>
            <li
              className={activeFile === "./sample2.pdf" ? "active" : ""}
              onClick={() => {
                setFile("./sample2.pdf");
                setActiveFile("./sample2.pdf");
                setSelectedDispute("Dispute 3"); // Update selected dispute
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
              <button onClick={zoomIn}>Zoom In</button>
              <button onClick={zoomOut}>Zoom Out</button>
              <button onClick={zoomReset}>Reset</button>
            </div>
            <ScrollContainer className="pdf-container">
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                options={options}
              >
                {Array.from(new Array(numPages), (_el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={800 * scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                ))}
              </Document>
            </ScrollContainer>
          </div>
          <div className="submit_btn_wrapper">
            <button>Submit</button>
            <button>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
