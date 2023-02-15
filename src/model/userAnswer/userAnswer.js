export const userAnswer = {
    type: ["userAnswer"],
    subclasses: ["directAnswer", "orderedAnswer", "orderingUserAnswer", "matchPairUserAnswer"],
    courseInstance: "^userAnswer/^orderedQuestion/^quizAssignment/courseInstance",
    create: ["[orderedQuestion]"],
    // show: ["teacher", "creator"],
    show: ["all"],
    props: {
        score: {
            required: false,
            multiple: false,
            dataType: "float",
        },
    },
};
