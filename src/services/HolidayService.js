import { BASE_PATH } from '../config/ApiConfig';
import axios from 'axios';
import {AuthService} from './AuthService';
const apiPath = `${BASE_PATH}/calendar/holiday`;

export const HolidayService = {
    get,
    createUpdate,
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
}
