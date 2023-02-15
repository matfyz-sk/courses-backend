export const field = {
    type: ["field"],
    courseInstance: "^hasField/courseInstance",
    props: {
        name: {
            required: true,
            multiple: false,
            dataType: "string",
        },
        description: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        label: {
            required: true,
            multiple: false,
            dataType: "string",
        },
        fieldType: {
            required: true,
            multiple: false,
            dataType: "string",
        },
    },
};
