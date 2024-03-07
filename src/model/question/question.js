export const question = {
    type: ["question"],
    subclasses: ["essayQuestion", "openQuestion", "questionWithPredefinedAnswer", "orderingQuestion", "matchQuestion"],
    create: ["ofTopic/hasQuestionAssignment/assignedTo"],
    show: ["all"],
    props: {
        name: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        text: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        visibilityIsRestricted: {
            required: false,
            multiple: false,
            dataType: "boolean",
        },
        hasQuestionState: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        ofTopic: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "topic",
        },
        approver: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "user",
        },
        hasChangeEvent: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "changeEvent",
        },
        comment: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "comment",
        },
        previous: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "question",
        },
        hasNewerVersion: {
            required: false,
            multiple: false,
            dataType: "boolean"
        },
        courseInstance: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "courseInstance",
            change: ["admin", "superAdmin"],
        },
        questionSubmittedBy: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "user",
        },
    },
};
