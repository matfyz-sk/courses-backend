export const predefinedAnswer = {
    type: ["predefinedAnswer"],
    courseInstance: "^hasPredefinedAnswer/courseInstance",
    create: ["[questionWithPredefinedAnswer]"],
    props: {
        text: {
            required: true,
            multiple: false,
            dataType: "string",
            change: ["teacher"],
        },
        position: {
            required: false,
            multiple: false,
            dataType: "integer",
        },
        correct: {
            required: true,
            multiple: false,
            dataType: "boolean",
        },
    },
};
