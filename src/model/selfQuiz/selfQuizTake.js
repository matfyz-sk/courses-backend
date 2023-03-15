export const selfQuizTake = {
    type: ["selfQuizTake"],
    create: ["all"],
    props: {
        submittedDate: {
            required: false,
            multiple: false,
            dataType: "dateTime",
        },
        score: {
            required: false,
            multiple: false,
            dataType: "decimal"
        },
        orderedQuestion: {
            required: true,
            multiple: true,
            dataType: "node",
            objectClass: "orderedQuestion",
        },
        courseInstance: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "courseInstance",
        },
    },
};
