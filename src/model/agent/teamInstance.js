export const teamInstance = {
    type: ["teamInstance"],
    courseInstance: "instanceOf/courseInstance",
    create: ["student"],
    change: ["teacher"],
    props: {
        approved: {
            required: true,
            multiple: false,
            dataType: "boolean",
        },
        instanceOf: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "team",
        },
        requestFrom: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "user",
        },
        hasUser: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "user",
        },
    },
};
