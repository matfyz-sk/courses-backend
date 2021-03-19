import { document } from "./document";

export const internalDocument = {
    type: "internalDocument",
    subclassOf: document,
    props: {
        mimeType: {
            required: true,
            multiple: false,
            dataType: 'string',
        },
        content: {
            required: true,
            multiple: false,
            dataType: 'string',
        }
    },
};
