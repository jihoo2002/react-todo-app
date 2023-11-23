import React from 'react';
import { MdAdd } from 'react-icons/md';
import './scss/TodoInput.scss';

const TodoInput = () => {
  return (
    <>
      <div className='form-wrapper'>
        <form className='insert-form'>
          <input
            type='text'
            placeholder='할일을 입력후 엔터를 누르세요'
          />
        </form>
      </div>

      <button className='insert-btn'>
        <MdAdd />
      </button>
    </>
  );
};

export default TodoInput;
