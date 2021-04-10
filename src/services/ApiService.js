import { BASE_PATH } from '../config/ApiConfig';
import axios from 'axios';
import {AuthService} from './AuthService';

export const ApiService = {
    get,
    createUpdate,
    deleteObj,
    deactivate,
    postXData,
    send
}

function checkIfExpiredCredsAndLogout(err){
    if(err.response && err.response.status === 403){
        alert("Your login credentials have expired. Please log in again.")
        AuthService.logout();
    }
}

async function get(url){
    const userObj = AuthService.getLoggedInUserObject();
    return await axios({
        method: 'GET',
        url: `${BASE_PATH}/${url}`,
        headers: {
            'Authorization': 'Bearer ' + userObj.token
        }
    })
    .then((response) => {return response.data})
    .catch((err) => {
        checkIfExpiredCredsAndLogout(err)
        return []
    });
}

async function createUpdate(url, id, obj){
    const userObj = AuthService.getLoggedInUserObject();
    if(id === 0){
        return await axios({
            method: 'POST',
            url: `${BASE_PATH}/${url}`,
            headers:{
                'Authorization': 'Bearer ' + userObj.token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(obj)
        })
        .then((response) => {return response.data})
        .catch((err) => {
            checkIfExpiredCredsAndLogout(err)
            return null
        });
    }else{
        return await axios({
            method: 'PUT',
            url: `${BASE_PATH}/${url}/${id}`,
            headers:{
                'Authorization': 'Bearer ' + userObj.token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(obj)
        })
        .then((response) => {return response.data})
        .catch((err) => {
            checkIfExpiredCredsAndLogout(err)
            return null
        });
    }
}
async function deleteObj(url, id){
    const userObj = AuthService.getLoggedInUserObject();
    await axios({
        method: 'DELETE',
        url: `${BASE_PATH}/${url}/${id}`,
        headers:{
            'Authorization': 'Bearer ' + userObj.token
        }
    }).catch((err) => {
        checkIfExpiredCredsAndLogout(err)
        return null
    });
}
async function deactivate(url, id){
    const userObj = AuthService.getLoggedInUserObject();
    await axios({
        method: 'POST',
        url: `${BASE_PATH}/${url}/${id}`,
        headers:{
            'Authorization': 'Bearer ' + userObj.token
        }
    }).catch((err) => {
        checkIfExpiredCredsAndLogout(err)
        return null
    });
}
async function postXData(url, data, id){
    const userObj = AuthService.getLoggedInUserObject();
    await axios({
        url: `${BASE_PATH}/${url}/${id}`,
        method: 'POST',
        data: data,
        headers:{
            'Authorization': 'Bearer ' + userObj.token
        }
    }).catch((err) => {
        checkIfExpiredCredsAndLogout(err)
        return null
    });
}
async function send(url, method, data){
    const userObj = AuthService.getLoggedInUserObject();
    await axios({
        url: `${BASE_PATH}/${url}`,
        method: method,
        data: data,
        headers:{
            'Authorization': 'Bearer ' + userObj.token,
            'Content-Type': 'application/json'
        }
    }).catch((err) => {
        checkIfExpiredCredsAndLogout(err)
        return null
    });
}