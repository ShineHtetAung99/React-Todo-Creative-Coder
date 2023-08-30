import './reset.css';
import './App.css';
import TodoForm from './components/TodoForm.js';
import TodoList from './components/TododList.js';
import CheckAllAndRemaining from './components/CheckAllAndRemaining.js';
import TodoFilters from './components/TodoFilters.js';
import ClearCompletedBtn from './components/ClearCompletedBtn.js';
import { useCallback, useEffect, useState } from 'react';

function App() {

  let [ todos, setTodos ] = useState([]);
  let [ filteredTodos, setFilteredTodos ] = useState(todos);

  useEffect(() => {
    fetch('http://127.0.0.1:3001/todos')
    .then(res => res.json())
    .then((todos) => {
      setTodos(todos)
      setFilteredTodos(todos)
    })
  },[])

  let addTodo = (todo) => {
    //update data at server side
    fetch('http://127.0.0.1:3001/todos' ,{
      method : "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify(todo)
    })
    //update data at client side
    setTodos(prevState => [...prevState,todo])
  }

  let deleteTodo = (todoId) => {
    //server
    fetch(`http://127.0.0.1:3001/todos/${todoId}`,{
      method : "DELETE"
    })

    //client
    setTodos(prevState => {
      return prevState.filter(todo => {
        return todo.id != todoId
      });
    })
  }

  let updateTodo = (todo) => {
    //server
    fetch(`http://127.0.0.1:3001/todos/${todo.id}` ,{
      method : "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify(todo)
    })
    //client
    setTodos(prevState => {
      return prevState.map(t => {
        if (t.id == todo.id) {
          return todo;
        }
        return t;
      });
    })
  }

  let checkAll = () => {
    //server
    todos.forEach(t => {
      t.completed = true;
      updateTodo(t)
    })
    //client
    setTodos((prevState) => {
      return prevState.map(t => {
        return {...t, completed : true};
      })
    })
  }

  let remainingCount = todos.filter(t => !t.completed).length

  let clearCompleted = () => {
    //server
    todos.forEach(t => {
      if (t.completed) {
        deleteTodo(t.id)
      }
    })
    //client
    setTodos((prevState) => {
      return prevState.filter(t => !t.completed)
    })
  }

  let filterBy = useCallback((filter) => {
      if (filter == 'All') {
        setFilteredTodos(todos);
      }
      if (filter == 'Active') {
        setFilteredTodos(todos.filter(t => !t.completed));
      }
      if (filter == 'Completed') {
        setFilteredTodos(todos.filter(t => t.completed));
      }
    },[todos])

  return (
    <div className="todo-app-container">
      <div className="todo-app">
        <h2>Todo App</h2>

        <TodoForm addTodo= {addTodo} />

        <TodoList todos= {filteredTodos} deleteTodo={deleteTodo} updateTodo={updateTodo}/>

        <CheckAllAndRemaining remainingCount={remainingCount} checkAll={checkAll}/>
        
        <div className="other-buttons-container">
          <TodoFilters filterBy={filterBy}/>
          <ClearCompletedBtn clearCompleted={clearCompleted}/>
        </div>
      </div>
    </div>
  );
}

export default App;
