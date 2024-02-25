import {fsObject} from "./fsObject.js";

export const document = {
    type: ["document"],
    subclassOf: fsObject,
    subclasses: ['internalDocument', 'externalDocument', 'file'],
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
        previousDocumentVersion: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "document",
        },
        nextDocumentVersion: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "document",
        },
        historicDocumentVersions: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "document",
        },
    },
};
