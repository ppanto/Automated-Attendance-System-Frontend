import { BASE_PATH } from '../config/ApiConfig';
import axios from 'axios';
import {AuthService} from './AuthService';
const titlePath = `${BASE_PATH}/title`;

export const TitleService = {
    getTitles,
    createUpdateTitle,
    deleteTitle
}

async function getTitles(){
    const userObj = AuthService.getLoggedInUserObject();
    return await axios({
        method: 'GET',
        url: `${titlePath}`,
        auth:{
            username: userObj.username,
            password: userObj.password
        }
    })
    .then((response) => {return response.data})
    .catch(() => {return []});
}
async function createUpdateTitle(id, titleObj){
    const userObj = AuthService.getLoggedInUserObject();
    if(id === 0){
        return await axios({
            method: 'POST',
            url: `${titlePath}`,
            auth:{
                username: userObj.username,
                password: userObj.password
            },
            headers:{
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(titleObj)
        })
        .then((response) => {return response.data})
        .catch(() => {return null});
    }else{
        return await axios({
            method: 'PUT',
            url: `${titlePath}/${id}`,
            auth:{
                username: userObj.username,
                password: userObj.password
            },
            headers:{
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({'name':titleObj.name})
        })
        .then((response) => {return response.data})
        .catch(() => {return null});
    }
}
async function deleteTitle(id){
    const userObj = AuthService.getLoggedInUserObject();
    await axios({
        method: 'DELETE',
        url: `${titlePath}/${id}`,
        auth:{
            username: userObj.username,
            password: userObj.password
        }
    });
}