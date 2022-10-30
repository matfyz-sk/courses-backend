export const fsObject = {
    type: ["fsObject"],
    subclasses: ['folder', 'document'],
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
    }
}
