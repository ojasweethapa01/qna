import { useState, useEffect, FC } from "react";
import TaskList from "./TaskList";
import Form from "./Form";
import { Task } from "./interfaces/interfaces";

const App: FC = () => {
  // State to store the list of tasks fetched from the server
  const [tasks, setTasks] = useState<Task[]>([]);
  // State to store the currently selected task for detailed view or editing
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    fetch("/task")
      .then((res) => res.json())
      .then((data) => setTasks(data.records));
  }, []);

  // Handler function to set the selected task when a task is clicked
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <div>
      {/* Conditional rendering based on whether a task is selected */}
      {!selectedTask && (
        <div>
          <h1>Task List</h1> {/* Heading for the task list */}
          <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
          {/* Render the task list and pass click handler */}
        </div>
      )}
      {selectedTask && <Form task={selectedTask} />}{" "}
      {/* Render the Form component if a task is selected */}
    </div>
  );
};
export default App;
