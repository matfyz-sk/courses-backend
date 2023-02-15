export const toReview = {
    type: ["toReview"],
    props: {
        submission: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "submission",
        },
        student: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "user",
        },
        team: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "team",
        },
    },
};
