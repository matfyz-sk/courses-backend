import {agent} from "./agent.js";

export const team = {
    type: ["team"],
    subclassOf: agent,
    create: ["teacher", "student"],
    change: ["teacher"],
    props: {
        name: {
            required: true,
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
