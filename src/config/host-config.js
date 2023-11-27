//브라우저에서 현재 클라이언트의 호스트 이름 얻어오기
const clientHostName = window.location.hostname;

let backendHostName; //백엔드 서버 호스트 이름

if (clientHostName === 'localhost') {
  //개발 중
  backendHostName = 'http://localhost:8181';
} else if (clientHostName === 'spring.com') {
  //배포해서 서비스 중
  backendHostName = 'http://api.spring.com';
}

export const API_BASE_URL = backendHostName;
export const TODO = '/api/todos';
export const USER = '/api/auth';
