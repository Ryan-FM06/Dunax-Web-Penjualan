import Notification from '../components/Notifications.js';
import { AUTH_URL } from '../config/api.js';

export const handleRegister = async (name, email, password) => {

    try {

        const response = await fetch(
            `${AUTH_URL}/register`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const result = await response.json();

        if (response.ok) {

            Notification.show(
                'Registrasi berhasil! Cek email untuk kode OTP.',
                'success'
            );

            setTimeout(() => {

                window.location.hash =
                    `#/verify-email?email=${encodeURIComponent(email)}`;

            },1500);

            return;
        }

        Notification.show(
            result.message || 'Registrasi gagal.',
            'error'
        );

    }
    catch(err){

        Notification.show(
            'Koneksi ke backend gagal!',
            'error'
        );

    }

};