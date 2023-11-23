import React from 'react';
import TodoItem from './TodoItem';
import './scss/TodoMain.scss';
const TodoMain = ({ todoList, remove }) => {
  return (
    <ul className='todo-list'>
      {todoList.map((todo) => (
        <TodoItem
          key={todo.id}
          item={todo}
          remove={remove}
        />
      ))}
    </ul> //아이템들을 각각 구분할 수 있는 key값과 item이라는 이름 으로 todo줌
  );
};

export default TodoMain;
