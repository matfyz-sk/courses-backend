import { topicRelated } from "../topicRelated.js";

export const task = {
    type: ["task"],
    subclassOf: topicRelated,
    subclasses: ["assignment"],
    create: ["teacher"],
    props: {
        name: {
            required: true,
            multiple: false,
            dataType: "string",
        },
        description: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        courseInstance: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "courseInstance",
        },
    },
};
