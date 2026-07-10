import React from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18/client';
import { handleForgotPassword } from './ForgotPassword-presenter.js';

const ForgotPasswordView = () => {
    const [email, setEmail] = React.useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        handleForgotPassword(email);
    };

    return React.createElement('div', { className: 'auth-page' },
        React.createElement('div', { className: 'auth-content' },
            React.createElement('div', { className: 'auth-container' }, [
                React.createElement('h2', { key: 'h2' }, 'Lupa Password'),
                React.createElement('p', { key: 'desc', style: { fontSize: '14px', textAlign: 'center', marginBottom: '10px' } }, 
                    'Masukkan email kamu, kami kirim kode OTP buat reset password.'
                ),
                React.createElement('form', { key: 'form', onSubmit }, [
                    React.createElement('input', {
                        key: 'email', type: 'email', placeholder: 'Email',
                        onChange: (e) => setEmail(e.target.value)
                    }),
                    React.createElement('button', { key: 'btn', type: 'submit' }, 'Kirim OTP')
                ]),
                React.createElement('div', { key: 'footer', className: 'auth-footer' }, [
                    React.createElement('a', { key: 'a', href: '#/login', className: 'link-accent' }, 'Kembali ke Login')
                ])
            ])
        )
    );
};

const ForgotPassword = {
    async render() {
        return '<div id="forgot-password-root"></div>';
    },
    async afterRender() {
        const root = ReactDOM.createRoot(document.getElementById('forgot-password-root'));
        root.render(React.createElement(ForgotPasswordView));
    }
};

export default ForgotPassword;