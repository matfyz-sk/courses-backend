import {fsObject} from "./fsObject.js";

export const document = {
    type: ["document"],
    subclassOf: fsObject,
    subclasses: ['internaldocument', 'externaldocument', 'file'],
    create: ["all"],
    show: ["all"],
    props: {
        name: {
            required: true,
            multiple: false,
            dataType: "string"
        },
        isDeleted: {
            required: false,
            multiple: false,
            dataType: "boolean",
        },
        restoredFrom: {
            required: false,
            multiple: false,
            dataType: "dateTime",
        },
        courseInstances: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "courseInstance",
        },
        previousVersion: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "document",
        },
        nextVersion: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "document",
        },
        historicVersion: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "document",
        },
    },
};
