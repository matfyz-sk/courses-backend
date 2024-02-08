import {document} from "./document.js";

export const internaldocument = {
    type: ["internaldocument"],
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
        },
        // payload: {
        //     required: true,
        //     multiple: false,
        //     dataType: 'node',
        //     objectClass: 'payload',
        // }
    },
};
