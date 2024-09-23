export const courseBadgeType = {
    type: ["courseBadgeType"],
    props: {
        courseInstance: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "courseInstance",
        },
        badgeType: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "badgeType",
        },
        additional: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        color: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        canAwardStudent: {
            required: false,
            multiple: false,
            dataType: "boolean",
        },
        canAwardInstructor: {
            required: false,
            multiple: false,
            dataType: "boolean",
        },
        awardableTo: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        enabled: {
            required: false,
            multiple: false,
            dataType: "boolean",
        },
        enabledFrom: {
            required: false,
            multiple: false,
            dataType: "dateTime",
        },
        enabledUntil: {
            required: false,
            multiple: false,
            dataType: "dateTime",
        },
    },
};