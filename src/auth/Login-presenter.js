import Notification from '../components/Notifications.js';
import { AUTH_URL } from '../config/api.js';
import { saveAuth } from '../utils/authStorage.js';

export const handleLogin = async (email, password, rememberMe) => {

    try{

        const response = await fetch(
            `${AUTH_URL}/login`,
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    email,
                    password
                })
            }
        );

        const result = await response.json();

        if(response.ok){

            saveAuth(result.data, rememberMe);

            Notification.show(
                'Login berhasil!',
                'success'
            );

            setTimeout(()=>{
                window.location.hash='#/home';
            },1000);

            return;
        }

        if(response.status===403){

            Notification.show(
                'Email belum diverifikasi.',
                'error'
            );

            setTimeout(()=>{

                window.location.hash=
                `#/verify-email?email=${encodeURIComponent(email)}`;

            },1000);

            return;
        }

        Notification.show(
            result.message,
            'error'
        );

    }
    catch(err){

        Notification.show(
            'Koneksi ke server gagal!',
            'error'
        );
    }
};