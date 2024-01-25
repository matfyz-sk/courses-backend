import {question} from "./question.js";

export const questionWithPredefinedAnswer = {
    type: ["questionWithPredefinedAnswer"],
    subclassOf: question,
    props: {
        hasPredefinedAnswer: {
            required: true,
            multiple: true,
            dataType: "node",
            objectClass: "predefinedAnswer",
        },
    },
};
