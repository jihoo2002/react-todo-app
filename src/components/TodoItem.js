import React from 'react';
import { MdDelete, MdDone } from 'react-icons/md';
import cn from 'classnames';
import './scss/TodoItem.scss';
//done이라는 여부에 따라서 active css가 움직인다.
const TodoItem = ({ item, remove, check }) => {
  const { id, title, done } = item;
  return (
    <li className='todo-list-item'>
      <div
        className={cn('check-circle', { active: done })}
        onClick={() => check(id)}
      >
        <MdDone />
      </div>
      <span className={cn('text', { finish: done })}>{title}</span>
      <div
        className='remove'
        onClick={() => remove(id)}
      >
        <MdDelete />
      </div>
    </li>
  );
};

export default TodoItem;
