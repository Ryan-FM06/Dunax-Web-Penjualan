import React from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18/client';
import { handleResetPassword } from './ResetPassword-presenter.js';

const getEmailFromHash = () => {
    const query = window.location.hash.split('?')[1] || '';
    const params = new URLSearchParams(query);
    return params.get('email') || '';
};

const ResetPasswordView = () => {
    const [email] = React.useState(getEmailFromHash());
    const [otp, setOtp] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        handleResetPassword(email, otp, newPassword);
    };

    return React.createElement('div', { className: 'auth-page' },
        React.createElement('div', { className: 'auth-content' },
            React.createElement('div', { className: 'auth-container' }, [
                React.createElement('h2', { key: 'h2' }, 'Reset Password'),
                React.createElement('p', { key: 'desc', style: { fontSize: '14px', textAlign: 'center', marginBottom: '10px' } },
                    `Masukkan kode OTP yang dikirim ke ${email}`
                ),
                React.createElement('form', { key: 'form', onSubmit }, [
                    React.createElement('input', {
                        key: 'otp', type: 'text', placeholder: 'Kode OTP',
                        onChange: (e) => setOtp(e.target.value)
                    }),
                    React.createElement('input', {
                        key: 'newpass', type: 'password', placeholder: 'Password Baru',
                        onChange: (e) => setNewPassword(e.target.value)
                    }),
                    React.createElement('button', { key: 'btn', type: 'submit' }, 'Simpan Password')
                ]),
                React.createElement('div', { key: 'footer', className: 'auth-footer' }, [
                    React.createElement('a', { key: 'a', href: '#/login' }, 'Kembali ke Login')
                ])
            ])
        )
    );
};

const ResetPassword = {
    async render() {
        return '<div id="reset-password-root"></div>';
    },
    async afterRender() {
        const root = ReactDOM.createRoot(document.getElementById('reset-password-root'));
        root.render(React.createElement(ResetPasswordView));
    }
};

export default ResetPassword;