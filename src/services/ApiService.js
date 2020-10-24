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

async function get(url){
    const userObj = AuthService.getLoggedInUserObject();
    return await axios({
        method: 'GET',
        url: `${BASE_PATH}/${url}`,
        auth:{
            username: userObj.username,
            password: userObj.password
        }
    })
    .then((response) => {return response.data})
    .catch(() => {return []});
}
async function createUpdate(url, id, obj){
    const userObj = AuthService.getLoggedInUserObject();
    if(id === 0){
        return await axios({
            method: 'POST',
            url: `${BASE_PATH}/${url}`,
            auth:{
                username: userObj.username,
                password: userObj.password
            },
            headers:{
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(obj)
        })
        .then((response) => {return response.data})
        .catch(() => {return null});
    }else{
        return await axios({
            method: 'PUT',
            url: `${BASE_PATH}/${url}/${id}`,
            auth:{
                username: userObj.username,
                password: userObj.password
            },
            headers:{
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(obj)
        })
        .then((response) => {return response.data})
        .catch(() => {return null});
    }
}
async function deleteObj(url, id){
    const userObj = AuthService.getLoggedInUserObject();
    await axios({
        method: 'DELETE',
        url: `${BASE_PATH}/${url}/${id}`,
        auth:{
            username: userObj.username,
            password: userObj.password
        }
    });
}
async function deactivate(url, id){
    const userObj = AuthService.getLoggedInUserObject();
    await axios({
        method: 'POST',
        url: `${BASE_PATH}/${url}/${id}`,
        auth:{
            username: userObj.username,
            password: userObj.password
        }
    });
}
async function postXData(url, data, id){
    const userObj = AuthService.getLoggedInUserObject();
    await axios({
        url: `${BASE_PATH}/${url}/${id}`,
        method: 'POST',
        data: data,
        auth:{
            username: userObj.username,
            password: userObj.password
        }
    });
}
async function send(url, method, data){
    const userObj = AuthService.getLoggedInUserObject();
    await axios({
        url: `${BASE_PATH}/${url}`,
        method: method,
        data: data,
        auth:{
            username: userObj.username,
            password: userObj.password
        },
        headers:{
            'Content-Type': 'application/json'
        },
    });
}