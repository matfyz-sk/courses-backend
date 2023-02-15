export const quizTakePrototype = {
    type: ["quizTakePrototype"],
    courseInstance: "^hasQuizTakePrototype/courseInstance",
    create: ["[manualQuizAssignment]"],
    change: [],
    props: {
        orderedQuestion: {
            required: true,
            multiple: true,
            dataType: "node",
            objectClass: "orderedQuestion",
        },
    },
};
