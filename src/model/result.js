export const result = {
    type: ["result"],
    props: {
        courseInstance: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "courseInstance",
        },
        hasUser: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "user",
        },
        awardedBy: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "user",
        },
        type: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "resultType",
        },
        points: {
            required: false,
            multiple: false,
            dataType: "float",
        },
        description: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        reference: {
            required: false,
            multiple: false,
            dataType: "string",
        },
    },
};
