import {taskEvent} from "../taskEvent.js";

export const examinationEvent = {
    type: ["examinationEvent"],
    subclassOf: taskEvent,
    subclasses: ["oralExam", "testTake"],
    props: {}
};
