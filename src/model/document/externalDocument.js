import { document } from "./document";

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
