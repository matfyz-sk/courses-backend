export const fsObject = {
    type: "fsObject",
    subclasses: ['folder', 'document'],
    create: ["all"],
    show: ["all"],
    props: {
        name: {
            required: true,
            multiple: false,
            dataType: "string"
        },
        // TODO maybe this just in the folder?
        parent: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "folder",
            change: ["teacher"],
        },   
        isDeleted: {
            required: false,
            multiple: false,
            dataType: "boolean",
        },
    }
}