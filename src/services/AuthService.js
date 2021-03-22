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
        method: 'POST',
        url: `${BASE_PATH}/account/login`,
        data: JSON.stringify({
            username: username,
            passwordHash: password
        })
    }).then((response) => {
        if(response.status === 200){
            let user = {
                username: username,
                token: response.data
            };
            localStorage.setItem('user', JSON.stringify(user));
        }
        // eslint-disable-next-line
        else if(response.status == 403){
            returnObject.message = 'Invalid username or password';
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