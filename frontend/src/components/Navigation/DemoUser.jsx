
import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './Navigation.css';

export function DemoUser(){

    const dispatch = useDispatch();
    const [credential] = useState('LittleWing');
    const [password] = useState('34&sldkfKJ');
    const { closeModal } = useModal();
                
                
             function onSubmit(e){
                e.preventDefault()
                return dispatch(sessionActions.login({ credential, password }))
                .then(closeModal)
             }  
                
             return (
                <form className="demo-form" onSubmit={onSubmit}>
                    <button id="demo-user-modal" type="submit">Log In As Jimi</button>
                </form>
             )
                
            


     
}