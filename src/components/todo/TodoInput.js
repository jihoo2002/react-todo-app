import React, { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import cn from 'classnames';
import './scss/TodoInput.scss';

const TodoInput = ({ addTodo }) => {
  //입력창이 열리는 여부를 표현하는 상태값
  const [open, setOpen] = useState(false);

  //할 일 입력창에 입력한 내용을 표현하는 상태값
  const [todoText, setTodoText] = useState('');
  //사용자가 입력할 때 그 변화하는 값을 감지하기 위해 useState 사용

  //+ 버튼 클릭시 이벤트
  const onToggle = () => {
    setOpen(!open); //버튼 클릭시 오픈의 값을 반대로 뒤집음
  };
  //input change 이벤트 핸들러
  const todoChangeHandler = (e) => {
    setTodoText(e.target.value);
  };

  // submit 이벤트 핸들러
  const submitHandler = (e) => {
    e.preventDefault(); //태그의 기본 기능 제한(submit 막기)

    //부모 컴포넌트가 전달한 함수의 매개값으로 입력값 넘기기.
    addTodo(todoText);

    //submit을 눌렀다는 건 입력 끝남, 입력창 비우기
    setTodoText('');
  };

  return (
    <>
      {open && ( //오픈이 true면 실행될 구문
        <div className='form-wrapper'>
          <form
            className='insert-form'
            onSubmit={submitHandler}
          >
            <input
              type='text'
              placeholder='할일을 입력후 엔터를 누르세요'
              onChange={todoChangeHandler}
              value={todoText} //여기서  벨류는 input 벨류가 아닌가??
            />
          </form>
        </div> //value를 submit 보내면 입력창을 비워줘야 하기때문에 따로 핸들러를 썼음
      )}

      {/* 
          cn() : 첫번째 파라미터는 항상 유지할 default 클래스
                 두번째 파라미터는 논리 상태값
                 => 논리 상태값이 true일 경우 해당 클래스 추가
                    false일 경우 제거.
                    {클래스이름: 논리값}, 
                    클래스 이름 지정 안할 시 변수명이 클래스 이름으로 사용됨.
                    즉 open이라는 클래스가 추가된 것임
        */}
      <button
        className={cn('insert-btn', { open })}
        onClick={onToggle}
      >
        <MdAdd />
      </button>
    </>
  );
};

export default TodoInput;
