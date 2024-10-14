export interface Task {
  Id: string;
  Name: string;
  attributes: Attributes;
  compliancequest__SQX_Task_Question__r: QuestionRelationshipOutput;
}

export interface Attributes {
  type: string;
  url: string;
}

export interface QuestionRelationshipOutput {
  done: boolean;
  records: Question[];
  totalSize: number;
}

export interface Question {
  Id: string;
  attributes: Attributes;
  compliancequest__Answer_Option__r: AnswerOptionRelationshipOutput;
  compliancequest__Answer_Type__c: string;
  compliancequest__QuestionText__c: string;
  compliancequest__SQX_Next_Question__c: string;
}

export interface AnswerOptionRelationshipOutput {
  done: boolean;
  records: AnswerOption[];
  totalSize: number;
}

export interface AnswerOption {
  Id: string;
  Name: string;
  attributes: Attributes;
  compliancequest__Next_Question__c: string;
}

export interface QuestionProperties {
  type: string;
  enum: string[];
}
