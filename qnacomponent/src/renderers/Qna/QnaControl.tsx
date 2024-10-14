import { useEffect, useState } from 'react';
import { JsonForms, withJsonFormsControlProps } from '@jsonforms/react';
import { ControlProps, JsonSchema7 } from '@jsonforms/core';
import { AnswerOption, Question } from '../../interfaces/interfaces';

//custom renderers
import { dateRendererTester } from "../DateRenderer";
import { dateTimeRendererTester } from "../DateTimeRenderer";
import { enumRendererTester } from "../EnumRenderer";
import { numberRendererTester } from "../NumberRenderer";
import { stringRendererTester } from "../StringRenderer";
import {
    materialRenderers,
    materialCells,
} from "@jsonforms/material-renderers";

// Combine custom renderers with material renderers
const jsonFormRenderers = [
    enumRendererTester,
    stringRendererTester,
    numberRendererTester,
    dateRendererTester,
    dateTimeRendererTester,
    ...materialRenderers,
];


const QnaControl = ({ uischema, handleChange, path }: ControlProps) => {
    let _uischema: any = uischema;
    const allQuestions: [Question] = _uischema.allQuestions;

    // convert the list of question to map of question id to question
    const questionMap: { [key: string]: Question } = {};
    allQuestions.forEach((question: Question) => {
        questionMap[question.Id] = question; //map question ID to the question object
    });

    // Selecting the first Question from the list of all the questions
    const [questionToShow, setQuestionToShow] = useState<any>([allQuestions[0]]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Function to generate properties for the question based on its type
    function handlePropertiesObject(question: Question){
        var questionProperties: any = {};
        questionProperties.type = "string"; // Default to string type

        // Set specific properties based on the answer type
        if (
            question.compliancequest__Answer_Type__c === "Options - Radio Button" ||
            question.compliancequest__Answer_Type__c === "Options - Picklist"
        ) {
            questionProperties.enum =
                question.compliancequest__Answer_Option__r.records.map(
                    (answerOption: any) => answerOption.Name
                );
        }
        if (question.compliancequest__Answer_Type__c === "Number Input") {
            questionProperties.type = "number";
        }
        if (question.compliancequest__Answer_Type__c === "Date Input") {
            questionProperties.format = "date";
        }
        if (question.compliancequest__Answer_Type__c === "DateTime Input") {
            questionProperties.format = "date-time";
        }
        if (question.compliancequest__Answer_Type__c === "Text Input") {
            questionProperties.minimum = 2;
        }
        return questionProperties;
    }

    // Function to create UI schema elements based on the question
    function handleAddingToUiSchema(question: Question)  {
        // Define a new schema element for the question
        let newSchemaElement: any = {
            type: "Control",
            scope: `#/properties/${question.Id}`,
            label: question.compliancequest__QuestionText__c,
            questionId: question.Id,
        };

        if (question.compliancequest__Answer_Type__c === "Options - Picklist") {
            newSchemaElement.options = {
                format: "picklist",
            };
        }
        return newSchemaElement;
    }

   

    // Function to determine the next question based on the current question and the user's answer
    function getNextQuestion(currentQuestionId: string, newValue: string) {
        let nextQuestionId: string | null = "";
        let currentQuestion: Question = questionMap[currentQuestionId]; // Get the current question from the map

        // Find the matching answer option for the new value
        if (currentQuestion.compliancequest__Answer_Option__r) {
            let matchedAnswer: AnswerOption | undefined =
                currentQuestion.compliancequest__Answer_Option__r.records.find(
                    (element: AnswerOption) => element.Name === newValue
                );

            if (matchedAnswer) {
                nextQuestionId = matchedAnswer.compliancequest__Next_Question__c; // Get the next question ID from the matched answer
            }
        }

        // Fall back to the default next question ID if no matched answer is found
        if (!nextQuestionId) {
            nextQuestionId = currentQuestion.compliancequest__SQX_Next_Question__c;
        }

        return nextQuestionId; // Return the ID of the next question
    }

    function handleInputChange(
        questionId: string,
        updatedValue: string,
        questionIndex: number
    ) {
        if (questionId) {
            var nextQuestionId: string | null = getNextQuestion(questionId, updatedValue);
            
            if (nextQuestionId && questionMap[nextQuestionId]) {
                if (currentQuestionIndex === questionIndex) {
                    setQuestionToShow([...questionToShow, questionMap[nextQuestionId]]);
                    updateSchemas([...questionToShow, questionMap[nextQuestionId]]);
                } else {
                    let updatedQuestions: Question[] = questionToShow.slice(
                        0,
                        questionIndex + 1
                    );
                    updatedQuestions.push(questionMap[nextQuestionId]);
                    setQuestionToShow(updatedQuestions);
                    updateSchemas(updatedQuestions);
                }
                setCurrentQuestionIndex(questionIndex + 1);
            }
        handleChange(path, { questionId, value:updatedValue });
        }
    }
    // State to manage the form data
const [dataToPersist, setDataToPersist] = useState<{ [key: string]: string }>({});

    // Define schema and UI schema based on the question object
    const [schema,setSchema] = useState<JsonSchema7>({
        type: "object",
        properties: {},
    });

    let [uiSchema,setUiSchema] = useState<{type:string,elements:any[]}>({
        type: "VerticalLayout",
        elements:[]
    });
 

useEffect(()=>{
    updateSchemas(questionToShow);
},[]);

function updateSchemas(questions:Question[]){
    const questionProperties:{[key: string]: any}={};
    const uiElements:any[] = [];

    questions.forEach((question: Question, index: number) => {        
        questionProperties[question?.Id] = handlePropertiesObject(question);
        uiElements.push(handleAddingToUiSchema(question));
    });
    const updatedSchema= {
        type: "object",
        properties: questionProperties,
    };
    setSchema(updatedSchema);

    console.log('Schema',updatedSchema);
    

    const updatedUiSchema = {
        type: "VerticalLayout",
        elements:uiElements
    }
    setUiSchema(updatedUiSchema);
    console.log('UI Schema',updatedUiSchema);

}
    return (
        <JsonForms
        schema={schema}
        uischema={uiSchema}
        data={dataToPersist}
        renderers={jsonFormRenderers}
        cells={materialCells}
        onChange={({ data, errors }) => {
            const questionIds =Object.keys(data);
            let found = false;
            let changedIndex:number;
            questionIds.forEach(questionId=>{
                if(!found && (!dataToPersist.hasOwnProperty(questionId) || data[questionId]!==dataToPersist[questionId])){
                    const updatedData = {...dataToPersist}
                    updatedData[questionId]=data[questionId];
                    setDataToPersist(updatedData);
                    found=true;
                    questionToShow.forEach((question:Question,index:number)=>{
                        if(question.Id === questionId){
                            changedIndex =index;
                        }
                    })
                    handleInputChange(questionId, data[questionId],changedIndex);
                }
            })
        }}
    />
    )
};

export default withJsonFormsControlProps(QnaControl);