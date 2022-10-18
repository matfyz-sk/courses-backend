export const typeAppearance = {
    type: ["typeAppearance"],
    create: ["[generatedQuizAssignment]"],
    props: {
        questionsAmount: {
            required: true,
            multiple: false,
            dataType: "integer",
        },
        questionType: {
            required: true,
            multiple: false,
            dataType: "string",
        },
    },
};
