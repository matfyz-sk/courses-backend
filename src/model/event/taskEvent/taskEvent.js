import {event} from "../event.js";

export const taskEvent = {
    type: ["taskEvent"],
    subclassOf: event,
    subclasses: ["assignmentPeriod", "examinationEvent", "questionQuizAssignment"],
    props: {
        extraTime: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        task: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "task",
        },
    },
};
