import { fsObject } from "./fsObject";

export const folder = {
    type: ["folder"],
    subclassOf: fsObject,
    create: ["all"],
    show: ["all"],
    props: {
        content: {
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
