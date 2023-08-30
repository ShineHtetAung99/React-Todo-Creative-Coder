import React from "react";
import Todo from '../components/Todo.js';

export default function TododList({todos, deleteTodo, updateTodo}) {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <Todo todo={todo} key={todo.id} deleteTodo={deleteTodo} updateTodo={updateTodo}/>
      ))}
    </ul>
  );
}
