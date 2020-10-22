import { BASE_PATH } from '../config/ApiConfig';
import axios from 'axios'; 

export const AuthService = {
    login,
    logout,
    getLoggedInUserObject
};

function login(username, password){
    const returnObject = {
        status: null,
        message: ''
    };
    return axios({
        method: 'GET',
        url: `${BASE_PATH}/account/validate-login`,
        auth: {
            username: username,
            password: password
        }
    }).then((response) => {
        if(response.status === 200){
            let user = {
                username: username,
                password: password
            };
            localStorage.setItem('user', JSON.stringify(user));
        }
        returnObject.status = response.status;
        return returnObject;
    }).catch((err) => {
        // eslint-disable-next-line
        if(err == 'Error: Network Error'){
            returnObject.status = 0;
            returnObject.message = 'The Server might be down.'
        }
        else{
            returnObject.status = 401;
            returnObject.message = 'Invalid username or password';
        }
        return returnObject;
    });
}
function logout(){
    localStorage.removeItem('user');
    window.location.reload();
}
function getLoggedInUserObject(){
    return JSON.parse(localStorage.getItem('user'));
}