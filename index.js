import dotenv from "dotenv";
dotenv.config();
import express from "express";
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

//GET method to fetch records of all fields

app.get("/api/question/:id", async (req, res) => {
  try {
    const questionId = req.params.id;
    const recordUrl = `${process.env.BASE_URL}/services/data/v61.0/query/?q=SELECT+FIELDS(ALL)+FROM+compliancequest__SQX_Task_Question__c+WHERE+ID='${questionId}'+LIMIT+5`;

    const headers = {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      "Content-type": "application/json",
    };
    console.log(recordUrl);
    const recordResponse = await fetch(recordUrl, { headers });
    const recordsData = await recordResponse.json();
    console.log(recordsData);
    res.send({
      records: recordsData,
    });
  } catch (error) {
    console.error(error);
  }
});

app.get("/task", async (req, res) => {
  try {
    let query =
      "SELECT Id , name, ( SELECT Id, compliancequest__QuestionText__c, compliancequest__SQX_Next_Question__c, compliancequest__Answer_Type__c,(SELECT Id, Name, compliancequest__Next_Question__c FROM compliancequest__Answer_Option__r) FROM compliancequest__SQX_Task_Question__r ORDER BY Name) FROM compliancequest__SQX_Task__c";
    const taskUrl = `${
      process.env.BASE_URL
    }/services/data/v61.0/query/?q=${encodeURIComponent(query)}`;
    const headers = {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      "Content-type": "application/json",
    };
    console.log(taskUrl);
    const recordResponse = await fetch(taskUrl, { headers });
    const recordsData = await recordResponse.json();
    console.log(recordsData);
    res.send({
      records: recordsData.records,
    });
  } catch (error) {
    console.error(error);
  }
});

app.get("/task/:id/first-question", async (req, res) => {
  const taskId = req.params.id;

  try {
    const query = `SELECT FIELDS(ALL) FROM compliancequest__SQX_Task_Question__c WHERE compliancequest__SQX_Task__c='${taskId}' ORDER BY Name ASC LIMIT 1`;
    const questionUrl = `${
      process.env.BASE_URL
    }/services/data/v61.0/query/?q=${encodeURIComponent(query)}`;

    const headers = {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      "Content-type": "application/json",
    };
    console.log(questionUrl);
    const questionResponse = await fetch(questionUrl, { headers });
    const questionData = await questionResponse.json();

    if (questionData.records && questionData.records.length > 0) {
      res.send({
        question: questionData.records[0],
      });
    } else {
      res
        .status(404)
        .send({ message: "No questions found for the given task ID." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "An error occurred while fetching the question." });
  }
});

app.get("/question/:id/answer-options", async (req, res) => {
  const questionId = req.params.id;

  try {
    const query = `SELECT FIELDS(ALL) FROM compliancequest__SQX_Answer_Option__c WHERE compliancequest__Question__c='${questionId}' LIMIT 50`;
    const answerOptionsUrl = `${
      process.env.BASE_URL
    }/services/data/v61.0/query/?q=${encodeURIComponent(query)}`;

    const headers = {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      "Content-type": "application/json",
    };
    console.log(answerOptionsUrl);
    const answerOptionsResponse = await fetch(answerOptionsUrl, { headers });
    const answerOptionsData = await answerOptionsResponse.json();

    if (answerOptionsData.records && answerOptionsData.records.length > 0) {
      res.send({
        answerOptions: answerOptionsData.records,
      });
    } else {
      res.status(404).send({
        message: "No answer options found for the given question ID.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "An error occurred while fetching the answer options.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
