import { topicRelated } from "./topicRelated.js";

export const material = {
    type: ["material"],
    subclassOf: topicRelated,
    props: {
        isAlternativeTo: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "material",
        },
        refersTo: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "material",
        },
        generalizes: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "material",
        },
    },
};
