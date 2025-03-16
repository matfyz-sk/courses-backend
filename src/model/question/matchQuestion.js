import {question} from "./question.js";

export const matchQuestion = {
    type: ["matchQuestion"],
    subclassOf: question,
    props: {
        hasMatchPairAnswer: {
            required: true,
            multiple: true,
            dataType: "node",
            objectClass: "matchPair",
        },
    },
};
