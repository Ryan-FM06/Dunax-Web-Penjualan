import React from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18/client';
import { handleLogin } from './Login-presenter.js';

const LoginView = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [rememberMe, setRememberMe] = React.useState(false);
    const [status, setStatus] = React.useState({ type: '', message: '' });

    const onSubmit = (e) => {
        e.preventDefault();
        handleLogin(email, password, rememberMe);
    };

    return React.createElement('div', { className: 'auth-page' }, 
        React.createElement('div', { className: 'auth-content' }, 
            React.createElement('div', { className: 'auth-container' }, [
                React.createElement('h2', { key: 'h2' }, 'Login Dunax Farm'),
                React.createElement('form', { key: 'form', onSubmit }, [
                    React.createElement('input', { 
                        key: 'email', type: 'email', placeholder: 'Email', 
                        onChange: (e) => setEmail(e.target.value) 
                    }),
                    React.createElement('input', { 
                        key: 'pass', type: 'password', placeholder: 'Password', 
                        onChange: (e) => setPassword(e.target.value) 
                    }),
                    React.createElement('div', { 
                        key: 'remember-row', 
                        className: 'remember-row'
                    }, [
                        React.createElement('label', { key: 'remember-label', className: 'custom-checkbox' }, [
                            React.createElement('input', {
                                key: 'remember-checkbox',
                                type: 'checkbox',
                                checked: rememberMe,
                                onChange: (e) => setRememberMe(e.target.checked)
                            }),
                            React.createElement('span', { key: 'checkmark', className: 'checkmark' }),
                            React.createElement('span', { key: 'label-text' }, 'Ingat saya')
                        ]),
                        React.createElement('a', { key: 'forgot-link', href: '#/forgot-password', className: 'link-accent' }, 'Lupa password?')
                    ]),
                    React.createElement('button', { key: 'btn', type: 'submit' }, 'Login')
                ]),
                status.message && React.createElement('p', { 
                    key: 'msg', 
                    style: { color: status.type === 'error' ? '#e74c3c' : '#2ecc71', marginTop: '10px', textAlign: 'center' } 
                }, status.message),
                React.createElement('div', { key: 'footer', className: 'auth-footer' }, [
                    'Belum punya akun? ',
                    React.createElement('a', { key: 'a', href: '#/register', className: 'link-accent' }, 'Daftar di sini')
                ])
            ])
        )
    );
};

const Login = {
    async render() {
        return '<div id="login-root"></div>';
    },
    async afterRender() {
        const root = ReactDOM.createRoot(document.getElementById('login-root'));
        root.render(React.createElement(LoginView));
    }
};

export default Login;