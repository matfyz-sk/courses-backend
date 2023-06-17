export const course = {
    type: ["course"],
    create: ["superAdmin"],
    show: ["all"],
    props: {
        name: {
            required: true,
            multiple: false,
            dataType: "string",
            change: ["superAdmin", "admin"],
        },
        description: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        abbreviation: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        coursePrerequisite: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "course",
        },
        mentions: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "topic",
        },
        covers: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "topic",
        },
        hasAdmin: {
            required: false,
            multiple: true,
            dataType: "node",
            objectClass: "user",
            put: [],
            patch: [],
            delete: [],
        },
    },
};
