import React from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

function DisplayFile(props) {

  let docs = [
    {
      uri: props.file.path
    },
  ];

  return (
    <div className="max-w-6xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Document Viewer
        </h2>
        <a 
          href={props.file.path}
          className="inline-block px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-600 transition duration-300"
        >
          Download
        </a>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <DocViewer 
          documents={docs} 
          pluginRenderers={DocViewerRenderers} 
          config={{
            header: {
              disableHeader: false,
              disableFileName: false,
              retainURLParams: false
            }
          }} 
          className="w-full h-[1500px]" 
        />
      </div>

      {!props.file.path && (
        <div className="text-center py-4 text-gray-500">
          No file to display
        </div>
      )}
    </div>
  );
}

export default DisplayFile;
