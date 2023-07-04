import {question} from "./question.js";

export const matchQuestion = {
    type: ["matchQuestion"],
    subclassOf: question,
    props: {
        hasAnswer: {
            required: true,
            multiple: true,
            dataType: "node",
            objectClass: "matchPair",
        },
    },
};
