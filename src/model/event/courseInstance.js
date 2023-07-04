import {event} from "./event.js";

export const courseInstance = {
    type: ["courseInstance"],
    subclassOf: event,
    create: ["admin"],
    show: ["all"],
    props: {
        course: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "course",
            change: ["admin"],
        },
        hasInstructor: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "user",
            put: ["admin"],
            patch: ["admin"],
            delete: ["admin"],
        },
        // TODO use to list all the materials in the course's general info?
        hasDocument: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "document",
            // TODO permissions might need to change...
            put: ["admin"],
            patch: ["admin"],
            delete: ["admin"],
        },
        fileExplorerRoot: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "folder",
        },
        hasGrading: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "courseGrading",
        },
        hasResultType: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "resultType",
        },
        hasPersonalSettings: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "coursePersonalSettings",
        },
    },
};
