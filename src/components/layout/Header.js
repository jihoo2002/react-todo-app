import React, { useContext, useEffect, useState } from 'react';
import { AppBar, Grid, Toolbar, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import './Header.scss';
import { isLogin, getLoginUserInfo } from '../../utils/login-util';
import AuthContext from '../../utils/AuthContext';
import { API_BASE_URL, USER } from '../../config/host-config';

const Header = () => {
  const profileRequestURL = `${API_BASE_URL}${USER}/load-profile`;

  const redirection = useNavigate();

  const [profileUrl, setProfileUrl] = useState(null);

  // AuthContext에서 로그인 상태를 가져옵니다. ->자식쪽 컴포넌트
  const { isLoggedIn, userName, onLogout } = useContext(AuthContext);

  //const { username: userName } = getLoginUserInfo(); //->토큰, 유저네임, role을 가지고 있엄
  //const userName = localStorage.getItem('userName');

  // 로그아웃 핸들러
  const logoutHandler = async () => {
    const res = await fetch(`${API_BASE_URL}${USER}/logout`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('ACCESS_TOKEN'),
      },
    });

    // AuthContext의 onLogout 함수를 호출하여 로그인 상태를 업데이트 합니다.
    onLogout();
    redirection('/login');
  };

  const fetchProfileImage = async () => {
    const res = await fetch(profileRequestURL, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('ACCESS_TOKEN'),
      },
    });

    if (res.status === 210) {
      const imgUrl = await res.text(); //카카오톡 프로필이 text로 오니까
      setProfileUrl(imgUrl);
      return;
    }

    if (res.status === 200) {
      //서버에서 byte[]로 직렬화된 이미지가 응답되므로
      // blob()을 통해 전달받아야 한다.json아님
      const profileBlob = await res.blob(); //서버에서 응답한 데이터는 바이트 배열이니까
      //해당 이미지를 imgUrl 로 변경
      const imgUrl = window.URL.createObjectURL(profileBlob);
      console.log(imgUrl);
      setProfileUrl(imgUrl);
    } else {
      const err = await res.text();
      setProfileUrl(null);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchProfileImage();
  }, [isLoggedIn]); //isLoggedIn(로그인)의 상태가 변화될 때 화면이 리렌더링 되고,
  //그에 맞는 회원의 프로필 이미지 요청이 들어갈 수 있도록 처리.

  return (
    <AppBar
      position='fixed'
      style={{
        background: '#38d9a9',
        width: '100%',
      }}
    >
      <Toolbar>
        <Grid
          justify='space-between'
          container
        >
          <Grid
            item
            flex={9}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant='h4'>
                {isLoggedIn ? userName + '님' : '오늘'}의 할일
              </Typography>
              {isLoggedIn && (
                <img
                  src={profileUrl || require('../../assets/img/anonymous.jpg')}
                  alt='프사프사'
                  style={{
                    marginLeft: 20,
                    width: 75,
                    height: 75,
                    borderRadius: '50%',
                  }}
                />
              )}
            </div>
          </Grid>

          <Grid item>
            <div className='btn-group'>
              {isLoggedIn ? (
                <button
                  className='logout-btn'
                  onClick={logoutHandler}
                >
                  로그아웃
                </button>
              ) : (
                <>
                  <Link to='/login'>로그인</Link>
                  <Link to='/join'>회원가입</Link>
                </>
              )}
            </div>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
