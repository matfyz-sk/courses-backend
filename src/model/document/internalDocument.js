import {document} from "./document.js";

export const internalDocument = {
    type: ["internalDocument"],
    subclassOf: document,
    props: {
        mimeType: {
            required: true,
            multiple: false,
            dataType: 'string',
        },
        editorContent: { // Markdown or HTML -> based on mimeType
            required: true,
            multiple: false,
            dataType: 'string',
        }
    },
};
