import {document} from "./document.js";

export const file = {
    type: ["file"],
    subclassOf: document,
    props: {
        filename: {
            required: true,
            multiple: false,
            dataType: 'string',
        },
        mimeType: {
            required: true,
            multiple: false,
            dataType: 'string',
        },
        payload: {
            required: true,
            multiple: false,
            dataType: 'node',
            objectClass: 'payload',
        }
    },
};
