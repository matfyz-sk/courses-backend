export const resultType = {
    type: ["resultType"],
    props: {
        name: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        minPoints: {
            required: false,
            multiple: false,
            dataType: "decimal",
        },
        description: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        correctionFor: {
            required: false,
            multiple: false,
            dataType: "node",
            objectClass: "resultType",
        },
        aggregationType: {
            required: false,
            multiple: false,
            dataType: "string",
        },
        numberOfAggregatedResults: {
            required: false,
            multiple: false,
            dataType: "integer",
        },
    },
};
