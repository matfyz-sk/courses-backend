import {document} from "./document.js";

export const externaldocument = {
    type: ["externaldocument"],
    subclassOf: document,
    props: {
        uri: {
            required: true,
            multiple: false,
            dataType: 'string',
        }
    },
};
