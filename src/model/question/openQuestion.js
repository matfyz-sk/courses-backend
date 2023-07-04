import {question} from "./question.js";

export const openQuestion = {
    type: ["openQuestion"],
    subclassOf: question,
    props: {
        regexp: {
            required: false,
            multiple: false,
            dataType: "string",
            change: ["owner"]
        }
    }
};
