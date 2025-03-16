export const matchPair = {
    type: ["matchPair"],
    courseInstance: "^hasMatchPairAnswer/courseInstance",
    create: ["[matchPair]"],
    props: {
        prompt: {
            required: true,
            multiple: false,
            dataType: "string",
        },
        answer: {
            required: true,
            multiple: false,
            dataType: "string",
        },
        position: {
            required: true,
            multiple: false,
            dataType: "integer",
        },
    },
};
