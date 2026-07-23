import Notification from '../components/Notifications.js';
import { AUTH_URL } from '../config/api.js';

export const handleResetPassword = async (email, otp, newPassword) => {
    try {
        const response = await fetch(`${AUTH_URL}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, newPassword })
        });

        const result = await response.json();

        if (response.ok) {
            Notification.show('Password berhasil diubah! Silakan login.', 'success');

            setTimeout(() => {
                window.location.hash = '#/login';
            }, 1000);

            return;
        }

        Notification.show(result.message || 'Gagal reset password', 'error');

    } catch (err) {
        Notification.show('Koneksi ke server gagal!', 'error');
    }
};