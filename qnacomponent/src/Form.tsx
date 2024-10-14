import { FC } from "react";
import { JsonForms } from "@jsonforms/react";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";

import { Question, Task } from "./interfaces/interfaces";
import { JsonSchema7 } from "@jsonforms/core";
import QnaTester from "./renderers/Qna/QnaTester";
import QnaControl from "./renderers/Qna/QnaControl";
import { qnaSchema, qnaUiSchema } from "./jsonUtils/qnaSchema";

// Combine custom renderers with material renderers
const jsonFormRenderers = [
  { tester: QnaTester, renderer: QnaControl },
  ...materialRenderers,
];

const Form: FC<{ task: Task }> = ({ task }) => {
  //Store all the questions from the task
  const allQuestions: Question[] =
    task.compliancequest__SQX_Task_Question__r?.records;

  // Define schema and UI schema based on the question object
  const schema: JsonSchema7 = qnaSchema;
  const uiSchema = {
    ...qnaUiSchema,
    allQuestions,
  };

  return (
    <JsonForms
      schema={schema}
      uischema={uiSchema}
      data={{}}
      renderers={jsonFormRenderers}
      cells={materialCells}
    />
  );
};

export default Form;
