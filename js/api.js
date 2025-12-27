const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const Route = {
  GET_DATA: '/data',
  SEND_DATA: '',
};

const Method = {
  GET: 'GET',
  POST: 'POST',
};

const load = (route, method, body = null) =>
  fetch(`${BASE_URL}${route}`, {
    method,
    body,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Ошибка запроса: ${response.status} ${response.statusText}`);
    }
    return response;
  });

const getData = () =>
  load(Route.GET_DATA, Method.GET)
    .then((response) => response.json());

const sendData = (body) =>
  load(Route.SEND_DATA, Method.POST, body);

export { getData, sendData };
