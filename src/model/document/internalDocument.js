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
        // content: {
        //     required: true,
        //     multiple: false,
        //     dataType: 'string',
        // }
        payload: {
            required: true,
            multiple: false,
            dataType: 'node',
            objectClass: 'payload',
        }
    },
};
