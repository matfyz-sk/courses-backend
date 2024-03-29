import {fsObject} from "./fsObject.js";

export const folder = {
    type: ["folder"],
    subclassOf: fsObject,
    create: ["all"],
    show: ["all"],
    props: {
        folderContent: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "fsObject",
        },
        parent: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "folder",
            change: ["teacher"],
        },
        courseInstance: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "courseInstance",
        },
        lastChanged: {
            required: false,
            multiple: false,
            dataType: "dateTime",
        },
    }
}
