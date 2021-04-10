import React, { useState } from 'react'
import { AuthService } from '../../services/AuthService';
import './login.css';

export const Login = (props) => {
    const [submitted, setSubmitted] = useState(false);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    function handleChangeUsername(e) {
        const {value} = e.target;
        setUsername(value);
    }
    function handleChangePassword(e) {
        const {value} = e.target;
        setPassword(value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitted(true);
        if (!(username && password)) {
            return;
        }
        setLoading(true);

        AuthService.login(username, password)
            .then((returnObj) => {
                if(returnObj.success === true){
                    const { from } = window.location.state || { from: { pathname: "/" } };
                    props.history.push(from);
                }
                else{
                    setError(returnObj.message);
                    setLoading(false);
                }
            });
    }

    return (
        <div className="myLoginContainer">
            <div>
                <h1 className='myLoginH1'>Automated Attendance System</h1>
                <form name="loginForm" onSubmit={handleSubmit} className='myLoginForm'>
                    <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                        <input placeholder="Username" type="text" className="form-control" name="username" value={username} onChange={handleChangeUsername} />
                        {submitted && !username &&
                            <div className="text-danger">Username is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                        <input placeholder="Password" type="password" className="form-control" name="password" value={password} onChange={handleChangePassword} />
                        {submitted && !password &&
                            <div className="text-danger">Password is required</div>
                        }
                    </div>
                    <div className="form-group myLoginCenteredButton">
                        <button className="btn btn-primary myLoginButton" disabled={loading}>Login</button>
                        <br />
                        <br />
                        {loading &&
                            <img alt='Loading ...' src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                    </div>
                    {error &&
                        <div className={'alert alert-danger'}>{error}</div>
                    }
                </form>
            </div>
        </div>
    );
}
