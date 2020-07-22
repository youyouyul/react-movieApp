import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action'

export default function(SpecificComponent, option, adminRoute = null) {
    //option 
    //null : 아무나 출입
    //true : login 한 유저만 출입
    //false : login 한 유저는 출임 불가능

    function AuthenticationCheck(props) {

        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => {
                //로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    if(option) {
                        props.history.push('/login');
                    }
                } else {
                    //로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin) {
                        props.history.push('/');
                    }
                    if(!option) {
                        props.history.push('/');
                    }    
                }
            })
        }, [])

        return (
            <SpecificComponent />
        )
    }

    return AuthenticationCheck
}