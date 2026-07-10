import Notification from '../components/Notifications.js';

export const verifyEmail = async (email, otp) => {

    try{

        const response = await fetch(
            'http://localhost:4000/verify-email',
            {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    email,
                    otp
                })
            }
        );

        const result = await response.json();

        if(response.ok){

            localStorage.setItem(
                'isLogin',
                'true'
            );

            localStorage.setItem(
                'currentUser',
                JSON.stringify(result.data)
            );

            Notification.show(
                'Verifikasi berhasil!',
                'success'
            );

            setTimeout(()=>{
                window.location.hash='#/home';
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