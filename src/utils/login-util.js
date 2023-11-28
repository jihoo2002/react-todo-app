//로그인한 유저의 데이터 객체를 반환하는 함수

export const getLoginUserInfo = () => {
  return {
    token: localStorage.getItem('ACCESS_TOKEN'),
    username: localStorage.getItem('LOGIN_USERNAME'),
    role: localStorage.getItem('USER_ROLE'),
  };
};

//로그인 여부를 확인하는 함수

/* const isLogin = () => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  //로그인을 했다면 토큰이 있을 것이다.
  if (token === null) return false;
  return true;
}; */

//특정 값이나 메서드의 리턴값을 논리 타입으로 변환하고 싶을 떄 !!를 붙임
//localStorage.getItem()의 결과를 논리타입으로 리턴 -> 값이 있으면 true,null이면 false
export const isLogin = () => !!localStorage.getItem('ACCESS_TOKEN');
//로그인을 안한 사람은 이쪽으로 null, 로그인 한 사람은 토큰이 온다.
//리턴 생략됨,  그냥 !!면 논리값 리턴, 즉 토큰은 true , null이면 false
