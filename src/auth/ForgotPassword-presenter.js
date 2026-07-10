import Notification from '../components/Notifications.js';
import { BASE_URL } from '../config/api.js';

export const handleForgotPassword = async (email) => {
    try {
        const response = await fetch(`${BASE_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (response.ok) {
            Notification.show('OTP terkirim ke email kamu!', 'success');

            setTimeout(() => {
                window.location.hash = `#/reset-password?email=${encodeURIComponent(email)}`;
            }, 1000);

            return;
        }

        Notification.show(result.message || 'Email tidak ditemukan', 'error');

    } catch (err) {
        Notification.show('Koneksi ke server gagal!', 'error');
    }
};