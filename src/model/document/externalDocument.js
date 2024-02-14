import {document} from "./document.js";

export const externalDocument = {
    type: ["externalDocument"],
    subclassOf: document,
    props: {
        uri: {
            required: true,
            multiple: false,
            dataType: 'string',
        }
    },
};
