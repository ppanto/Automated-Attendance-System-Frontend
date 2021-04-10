import { BASE_PATH } from '../config/ApiConfig';
import axios from 'axios'; 

export const AuthService = {
    login,
    logout,
    getLoggedInUserObject
};

async function login(username, password){
    const returnObject = {
        message: '',
        success: false
    };
    return await axios({
        method: 'POST',
        url: `${BASE_PATH}/account/login`,
        data: JSON.stringify({
            username: username,
            passwordHash: password
        })
    }).then((response) => {
        if(response.status === 200){
            localStorage.setItem('user', JSON.stringify({
                username: username,
                token: response.data
            }));
            returnObject.success = true;
        }
        else{
            returnObject.message = 'Error while authenticating.';
        }
        return returnObject;
    }).catch((err) => {
        if(err && err.response && err.response.status === 403){
            returnObject.message = 'Invalid username or password';
        }
        else if(err && err.response === undefined){
            returnObject.message = 'Can not reach server. Server might be down or CORS issue.';
        }
        else{
            returnObject.message = 'Error while authenticating.';
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