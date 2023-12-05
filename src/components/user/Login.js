import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { API_BASE_URL as BASE, USER } from '../../config/host-config';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../utils/AuthContext';
import { KAKAO_AUTH_URL } from '../../config/kakao-config';
const Login = () => {
  const redirection = useNavigate();

  const { onLogin } = useContext(AuthContext);

  const REQUEST_URL = BASE + USER + '/signin';
  //함수 앞에 async를 붙이면 해당 함수는 프로미스 객체를 바로 리턴합니다.
  //서버에 비동기 로그인 요청(AJAX 요청)
  //fetch가 끝나기 전까지 그 아래 코드 실행 x await걸어놨기 때문
  const fetchLogin = async () => {
    //이메일, 비밀번호 입력 태그 얻어오기
    const $email = document.getElementById('email');
    const $password = document.getElementById('password');

    //await는 async로 선언된 함수에서만 사용이 가능
    //await는 프로미스 객체가 처리될 때까지 기다립니다.
    //프로미스 객체의 반환값을 바로 활용할 수 있도록 도와줍니다.
    //then()을 활용하는 것보다 가독성이 좋고, 쓰기도 쉽다.
    const res = await fetch(REQUEST_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: $email.value,
        password: $password.value,
      }),
    });
    if (res.status === 400) {
      const text = await res.text();
      alert(text);
      return;
    }

    const { token, userName, email, role } = await res.json();
    //json에 담긴 인증정보를 클라이언트에 보관
    //1.로컬 스토리지 - 브라우저가 종료되어도 보관
    //2.세션 스토리지 - 브라우저가 종료되면 사라짐
    //Context API를 사용하여 로그인 상태를 업데이트합니다.
    onLogin(token, userName, role);
    // 홈으로 리다이렉트
    redirection('/');
    //     .then((res) => {
    //       if (res.status === 400) {
    //         //가입이 안되어 있거나, 비번이 틀린 경우
    //         return res.text(); //에러메세지는 text 떄문에 text()를 리턴.
    //       }
    //       return res.json(); //400 에러가 아니라면 로그인 성공이기 때문에 json을 리턴
    //     })
    //     .then((result) => {
    //       //에러 -> text, 에러 x ->json데이터
    //       if (typeof result === 'string') {
    //         alert(result);
    //         return;
    //       } else {
    //         alert('로그인 성공하셨습니다.');
    //       }
    //       console.log(result);
    //     });
  };

  //로그인 요청 핸들러
  const loginHandler = (e) => {
    e.preventDefault(); //submit 막기

    //서버에 로그인 요청 전송
    fetchLogin();
  };

  return (
    <Container
      component='main'
      maxWidth='xs'
      style={{ margin: '200px auto' }}
    >
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={12}
        >
          <Typography
            component='h1'
            variant='h5'
          >
            로그인
          </Typography>
        </Grid>
      </Grid>

      <form
        noValidate
        onSubmit={loginHandler}
      >
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <TextField
              variant='outlined'
              required
              fullWidth
              id='email'
              label='email address'
              name='email'
              autoComplete='email'
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <TextField
              variant='outlined'
              required
              fullWidth
              name='password'
              label='on your password'
              type='password'
              id='password'
              autoComplete='current-password'
            />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Button
              type='submit'
              fullWidth
              variant='contained'
              style={{ background: '#38d9a9' }}
              color='primary'
            >
              로그인
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <a href={KAKAO_AUTH_URL}>
              <img
                style={{ width: '100%' }}
                alt='kakaobtn'
                src={require('../../assets/img/kakao_login_medium_wide.png')}
              />
            </a>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Login;
