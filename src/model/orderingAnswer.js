export const orderingAnswer = {
    type: ["orderingAnswer"],
    courseInstance: "^hasOrderingAnswer/courseInstance",
    create: ["[orderingQuestion]"],
    props: {
        text: {
            required: true,
            multiple: false,
            dataType: "string",
            change: ["teacher"],
        },
        position: {
            required: true,
            multiple: false,
            dataType: "integer",
        },
    },
};
