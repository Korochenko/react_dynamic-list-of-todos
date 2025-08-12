/* eslint-disable max-len */
import React from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import { User } from './types/User';
import { getTodos, getUser } from './api';
import { useEffect } from 'react';

export const App: React.FC = () => {
  const [loadingUser, setLoadingUser] = React.useState(false);
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);
  const [selectedTodo, setSelectedTodo] = React.useState<Todo | null>(null); // Added missing state

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleUserFetch = (userId: number) => {
    setLoadingUser(true);
    
    // Find the todo by userId
    const todo = todos.find(t => t.userId === userId);
    if (todo) {
      setSelectedTodo(todo);
    }
    
    getUser(userId)
      .then(data => {
        setUser(data);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  };

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter />
            </div>

            <div className="block">
              {loading && <Loader />}
              {!loading && <TodoList todos={todos} onTodoSelect={handleUserFetch} />}
            </div>
          </div>
        </div>
      </div>

      <TodoModal
        selectedTodo={selectedTodo}
        user={user}
        loadingUser={loadingUser}
        onClose={() => {
          setSelectedTodo(null);
          setUser(null);
        }}
      />
    </>
  );
};