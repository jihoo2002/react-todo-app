import React, { useEffect, useState } from 'react';
import TodoHeader from './TodoHeader';
import TodoMain from './TodoMain';
import TodoInput from './TodoInput';
import './scss/TodoTemplate.scss';
import { Spinner } from 'reactstrap';

import { API_BASE_URL as BASE, TODO, USER } from '../../config/host-config';
import { useNavigate } from 'react-router-dom';
import { getLoginUserInfo } from '../../utils/login-util';
const TodoTemplate = () => {
  const redirection = useNavigate();
  //로그인 인증 토큰 얻어오기
  const [token, setToken] = useState(getLoginUserInfo().token);

  // fetch 요청 보낼 때 사용할 요청 헤더 설정
  const requestHeader = {
    'content-type': 'application/json',
    // JWT에 대한 인증 토큰이라는 타입을 선언
    Authorization: 'Bearer ' + token,
  };

  //서버에 할 일 목록(json)을 요청(fetch)해서 받아와야함
  const API_BASE_URL = BASE + TODO; //경로 변수화해서 요긴하게 쓸거임 !
  const API_USER_URL = BASE + USER;
  //todos 배열을 상태관리
  const [todos, setTodos] = useState([]);
  //로딩 상태값 관리(처음에는 무조건 로딩이 필요하기 때문에 true ->로딩 끝나면 false로 전환)
  const [loading, setLoading] = useState(true);
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
  const addTodo = async (todoText) => {
    const newTodo = {
      title: todoText,
    }; // fetch를 이용해서 백엔드에 insert 요청 보내야 함.

    //useState의 함수는 이런식으로 데이터를 처리할 수없다.
    // 항상 set을 사용하여야 함
    //todos.push(newTodo); (x)
    //setTodos(newTodo) (x) ->배열 추가가 아닌 초기되고 추가된다.
    ///setTodos(todos.push(newTodo))->
    //react의 상태변수는 불변성(immutable)을 가지기 때문에
    //기존 상태에서 변경은 불가능 -> 새로운 상태로 만들어서 변경 해야 함
    /*
    setTodos((oldTodos) => {
      console.log(oldTodos);
      //이전 상태의 값이 oldTodos로 전달됨
      return [...oldTodos, newTodo]; //기존 값 뿌려주고 새로운 배열 추가
     
    });
     */
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: requestHeader,
      body: JSON.stringify(newTodo),
    });
    //일반 회원은 5개 이상 쓰면 안되기 때문에 오류가 이쪽으로 온다..
    if (res.status === 200) {
      const json = await res.json(); //fetch가 끝난 다음에 실행되야 하니까 fetch 쪽에 await
      setTodos(json.todos);
    } else if (res.status === 401) {
      alert('일반 회원은 일정 등록이 5개로 제한됩니다 ㅜㅜ');
    }

    // fetch(API_BASE_URL, {
    //   method: 'POST',
    //   headers: { 'content-type': 'application/json' },
    //   body: JSON.stringify(newTodo),
    // })
    //   .then((res) => res.json())
    //   .then((json) => {
    //     setTodos(json.todos);
    //   });
  };

  //할일 삭제 처리 함수
  const removeTodo = (id) => {
    //삭제버튼을 누른 그 객체의 아이디가 이쪽으로 오게 된다.
    //주어진 배열의 값들을 순회하여 조건에 맞는 요소들만 모아서 새로운 배열로 리턴
    //setTodos(todos.filter((todo) => todo.id !== id)); //지금 들어오는 아이디와 일치하지 않는 아이디의 객체들을 세팅
    fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: requestHeader,
    })
      .then((res) => res.json())
      .then((json) => {
        setTodos(json.todos);
      });
  };

  //할일 체크 처리 함수
  const checkTodo = (id, done) => {
    //이쪽으로 id의 값이 옴, done의 값을 뒤집으면 된다.
    /* setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      ) //매개변수로 배열 안에있는 할일 객체들이 하나씩 오게되는데, id가 맞다면 기존의 배열은 가져가면서 done은 반대로,
      //아니면 원래 배열을 그대로 둔다.
    ); */
    fetch(API_BASE_URL, {
      method: 'PATCH',
      headers: requestHeader,
      body: JSON.stringify({
        done: !done,
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);

        setTodos(json.todos);
      });
  };

  //체크가 안된 할일의 개수 카운트 세기
  const countRestTodo = () => todos.filter((todo) => !todo.done).length; //length를 리턴

  //비동기 방식 등급 승격 함수
  const fetchPromote = async () => {
    const res = await fetch(API_USER_URL + '/promote', {
      method: 'PUT',
      headers: requestHeader,
    });

    if (res.status === 403) {
      alert('이미 프리미엄 회원입니다. ');
    } else if (res.status === 200) {
      const json = await res.json();

      localStorage.setItem('ACCESS_TOKEN', json.token);
      localStorage.setItem('USER_ROLE', json.role);
      setToken(json.token); //새로 만들어진 토큰 값을 넣어준다.
    }
  };

  //등급 승격 서버요청 (프리미엄)
  const promote = () => {
    console.log('등급 승격 서버 요청');
    fetchPromote();
  };

  useEffect(() => {
    // 페이지가 처음 렌더링 됨과 동시에 할 일 목록을 서버에 요청해서 뿌려 주겠습니다.
    fetch(API_BASE_URL, {
      method: 'GET',
      headers: requestHeader,
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else if (res.status === 403) {
          alert('로그인이 필요한 서비스 입니다.');
          redirection('/login');
          return;
        } else {
          alert('관리자에게 문의하세요!');
        }
        return;
      })
      .then((json) => {
        // fetch를 통해 받아온 데이터를 상태 변수에 할당.
        if (json) setTodos(json.todos); //로딩이 끝난 시점 그전은 로딩이 되어야 한다.

        //로딩 완료 처리
        setLoading(false);
      });
  }, []);

  //로딩이 끝난 후 보여줄 컴포넌트
  const loadEndedPage = (
    <div className='TodoTemplate'>
      <TodoHeader
        count={countRestTodo}
        promote={promote}
      />
      <TodoMain
        todoList={todos}
        remove={removeTodo}
        check={checkTodo}
      />
      <TodoInput addTodo={addTodo} />
    </div>
  );
  //로딩 중 일때 보여줄 컴포넌트
  const loadingPage = (
    <div className='loading'>
      <Spinner color='danger'>loading...</Spinner>
    </div>
  );

  return <>{loading ? loadingPage : loadEndedPage}</>;
};

export default TodoTemplate;
