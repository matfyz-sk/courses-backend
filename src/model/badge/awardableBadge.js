export const awardableBadge = {
    type: ["awardableBadge"],
    props: {
        courseInstance: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "courseInstance",
        },
        courseBadgeType: {
            required: true,
            multiple: false,
            dataType: "node",
            objectClass: "courseBadgeType",
        },
        badgeType: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "badgeType",
        },
        hasUser: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "user",
        },
        awardableTo: {
            required: false,
            multiple: true,
            dataType: "string",
        },
        awardedTo: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "user",
        },
        awardedOn: {
            required: false,
            multiple: false,
            dataType: "dateTime",
        },
        color: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        additional: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        awardComment: {
            required: false,
            multiple: false,
            dataType: "string",
        },
    },
};