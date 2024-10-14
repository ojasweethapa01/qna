export const qnaSchema = {
    type: "object",
    properties: {
        questionId: {
            type: "string"
        },
        value: {
            type: "string"
        }
    },
};
export const qnaUiSchema = {
    type: "Control",
    scope: `#/properties/qna`
}