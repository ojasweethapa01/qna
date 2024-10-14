import { FC } from "react";
import { Task } from "./interfaces/interfaces";

const TaskList: FC<{ tasks: Task[]; onTaskClick: any }> = ({
  tasks,
  onTaskClick,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "20px",
      }}
    >
      {tasks.map((task: Task) => (
        <button
          key={task.Id}
          onClick={() => onTaskClick(task)}
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            backgroundColor: "#f7f7f7",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#e0e0e0")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#f7f7f7")
          }
        >
          {task.Name}
        </button>
      ))}
    </div>
  );
};

export default TaskList;
