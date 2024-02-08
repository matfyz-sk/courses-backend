export const documentReference = {
    type: ["documentReference"],
    create: ["all"],
    show: ["all"],
    props: {
        document: {
            required: true,
            multiple: false,
            dataType: 'node',
            objectClass: 'document',
        },
        courseInstance: {
            required: true,
            multiple: false,
            dataType: 'node',
            objectClass: 'courseInstance',
        }
    },
};
