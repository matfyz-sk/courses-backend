import {document} from "./document.js";

export const file = {
    type: ["file"],
    subclassOf: document,
    props: {
        filename: {
            required: false,
            multiple: false,
            dataType: 'string',
        },
        mimeType: {
            required: true,
            multiple: false,
            dataType: 'string',
        },
        rawContent: {
            required: false,
            multiple: false,
            dataType: 'string',
        }
    },
};
