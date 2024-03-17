import { topicRelated } from "../topicRelated.js";

export const event = {
    type: ["event"],
    subclassOf: topicRelated,
    subclasses: ["courseInstance", "block", "session", "taskEvent"],
    create: ["teacher"],
    props: {
        name: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        location: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        description: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        startDate: {
            required: true,
            multiple: false,
            dataType: "dateTime",
        },
        endDate: {
            required: true,
            multiple: false,
            dataType: "dateTime",
        },
        uses: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "material",
        },
        recommends: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "material",
        },
        documentReference: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "documentReference",
        },
        courseInstance: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "courseInstance",
        },
    },
};
