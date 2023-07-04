import {userAnswer} from "./userAnswer.js";

export const orderingUserAnswer = {
    type: ["orderingUserAnswer"],
    subclassOf: userAnswer,
    props: {
        userChoiceNumber: {
            required: true,
            multiple: false,
            dataType: "integer"
        },
        orderingAnswer: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "orderingAnswer"
        }
    }
};
