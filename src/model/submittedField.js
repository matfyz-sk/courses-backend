export const submittedField = {
    type: ["submittedField"],
    courseInstance: "^submittedField/ofAssignment/courseInstance",
    create: ["[submission]"],
    show: ["all"],
    props: {
        field: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "field",
        },
        value: {
            required: true,
            multiple: false,
            dataType: "string",
        },
    },
};
