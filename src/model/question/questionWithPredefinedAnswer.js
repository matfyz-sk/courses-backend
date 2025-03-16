import {question} from "./question.js";

export const questionWithPredefinedAnswer = {
    type: ["questionWithPredefinedAnswer"],
    subclassOf: question,
    props: {
        hasPredefinedAnswer: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "predefinedAnswer",
        },
    },
};
