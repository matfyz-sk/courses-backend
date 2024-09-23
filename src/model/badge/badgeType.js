export const badgeType = {
    type: ["badgeType"],
    props: {
        title: {
            required: true,
            multiple: false,
            dataType: "string",
        },
        description: {
            required: true,
            multiple: false,
            dataType: "string",
        },
        icon: {
            required: false,
            multiple: false,
            dataType: "string",
        },
    },
};