export const document = {
    type: "document",
    subclasses: ['internalDocument', 'externalDocument', 'file'],
    create: ["all"],
    show: ["all"],
    props: {
        name: {
            required: true,
            multiple: false,
            dataType: "string"
        },
        shortName: {
            required: false,
            multiple: false,
            dataType: "string"
        },
        slug: {
            required: false,
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
        author: {
            required: true,
            multiple: true,
            dataType: "node",
            objectClass: "user",
            change: ["teacher"],
        },
        owner: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "user",
            change: ["teacher"],
        },
        courseInstance: {
            required: true,
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
