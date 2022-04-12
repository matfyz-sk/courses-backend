import { fsObject } from "./fsObject";

export const folder = {
    type: "folder",
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
        courseInstance: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "courseInstance",
        },
    }
}