import { BASE_PATH } from '../config/ApiConfig';
import axios from 'axios';
import {AuthService} from './AuthService';
const apiPath = `${BASE_PATH}/leave-type`;

export const LeaveTypeService = {
    get,
    createUpdate,
    deleteObj
}

async function get(){
    const userObj = AuthService.getLoggedInUserObject();
    return await axios({
        method: 'GET',
        url: `${apiPath}`,
        auth:{
            username: userObj.username,
            password: userObj.password
        }
    })
    .then((response) => {return response.data})
    .catch(() => {return []});
}
async function createUpdate(id, obj){
    const userObj = AuthService.getLoggedInUserObject();
    if(id === 0){
        return await axios({
            method: 'POST',
            url: `${apiPath}`,
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
            url: `${apiPath}/${id}`,
            auth:{
                username: userObj.username,
                password: userObj.password
            },
            headers:{
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({'name':obj.name})
        })
        .then((response) => {return response.data})
        .catch(() => {return null});
    }
}
async function deleteObj(id){
    const userObj = AuthService.getLoggedInUserObject();
    await axios({
        method: 'DELETE',
        url: `${apiPath}/${id}`,
        auth:{
            username: userObj.username,
            password: userObj.password
        }
    });
}