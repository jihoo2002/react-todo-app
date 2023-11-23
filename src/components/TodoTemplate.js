import React, { useState } from 'react';
import TodoHeader from './TodoHeader';
import TodoMain from './TodoMain';
import TodoInput from './TodoInput';
import './scss/TodoTemplate.scss';

const TodoTemplate = () => {
  //서버에 할 일 목록(json)을 요청(fetch)해서 받아와야함

  //todos 배열을 상태관리
  const [todos, setTodos] = useState([
    {
      id: 1,
      title: '아침 산책하기',
      done: true,
    },
    {
      id: 2,
      title: '오늘 주간 신문 읽기',
      done: true,
    },
    {
      id: 3,
      title: '샌드위치 사먹기',
      done: false,
    },
    {
      id: 4,
      title: '리액트 복습하기',
      done: false,
    },
  ]);
  //id값 시퀀스 함수 (DB연동시키면 필요 없음)
  const makeNewId = () => {
    if (todos.length === 0) return 1;
    return todos[todos.length - 1].id + 1; //맨 마지막 할일 객체의 id보다 하나 크게
  };

  /*
  todoInput에게 todoText를 받아오는 함수
  자식 컴포넌트가 부모 컴포넌트에게 데이터를 전달할 때는
  일반적인 props 사용이 불가능.
  부모 컴포넌트에서 함수를 선언(매개변수 꼭 선언) -> props로 함수를 전달
  자식 컴포넌트에서 전달받은 함수를 호출하면서 매개값으로 데이터를 전달.
  */
  const addTodo = (todoText) => {
    const newTodo = {
      id: makeNewId(),
      title: todoText,
      done: false,
    }; //나중에 fetch를 이용해서 백엔드에 insert 요청 보내야 함.

    //useState의 함수는 이런식으로 데이터를 처리할 수없다.
    // 항상 set을 사용하여야 함
    //todos.push(newTodo); (x)
    //setTodos(newTodo) (x) ->배열 추가가 아닌 초기되고 추가된다.
    ///setTodos(todos.push(newTodo))->
    //react의 상태변수는 불변성(immutable)을 가지기 때문에
    //기존 상태에서 변경은 불가능 -> 새로운 상태로 만들어서 변경 해야 함

    setTodos((oldTodos) => {
      //가장 최신의 상태값이 oldTodos로 전달됨
      return [...oldTodos, newTodo]; //기존 값 뿌려주고 새로운 배열 추가
    });
  };

  //할일 삭제 처리 함수
  const removeTodo = (id) => {
    //삭제버튼을 누른 그 객체의 아이디가 이쪽으로 오게 된다.
    //주어진 배열의 값들을 순회하여 조건에 맞는 요소들만 모아서 새로운 배열로 리턴
    setTodos(todos.filter((todo) => todo.id !== id)); //지금 들어오는 아이디와 일치하지 않는 아이디의 객체들을 세팅
  };

  //할일 체크 처리 함수
  const checkTodo = (id) => {
    //이쪽으로 id의 값이 옴, done의 값을 뒤집으면 된다.
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      ) //매개변수로 배열 안에있는 할일 객체들이 하나씩 오게되는데, id가 맞다면 기존의 배열은 가져가면서 done은 반대로,
      //아니면 원래 배열을 그대로 둔다.
    );
  };

  //체크가 안된 할일의 개수 카운트 세기
  const countRestTodo = () => todos.filter((todo) => !todo.done).length; //length를 리턴

  return (
    <div className='TodoTemplate'>
      <TodoHeader count={countRestTodo} />
      <TodoMain
        todoList={todos}
        remove={removeTodo}
        check={checkTodo}
      />
      <TodoInput addTodo={addTodo} />
    </div>
  );
};

export default TodoTemplate;
