import {taskEvent} from "../taskEvent.js";

export const questionQuizAssignment = {
    type: ["questionQuizAssignment"],
    subclassOf: taskEvent,
    subclasses: ["questionAssignment", "quizAssignment"],
    props: {
        assignedTo: {
            required: true,
            multiple: true,
            dataType: "node",
            objectClass: "user",
        },
    },
};
