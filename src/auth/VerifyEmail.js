import React from 'https://esm.sh/react@18';
import ReactDOM from 'https://esm.sh/react-dom@18/client';
import { verifyEmail } from './VerifyEmail-presenter.js';

const VerifyEmailView = () => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const email = params.get('email') || '';

    const [otp, setOtp] = React.useState('');
    const [status, setStatus] = React.useState({
        type: '',
        message: ''
    });

    const onSubmit = (e) => {
        e.preventDefault();
        verifyEmail(email, otp);
    };

    return React.createElement(
        'div',
        { className: 'auth-page' },

        React.createElement(
            'div',
            { className: 'auth-card' },

            [

                React.createElement(
                    'h2',
                    {
                        key: 'title'
                    },
                    'Verifikasi Email'
                ),

                React.createElement(
                    'p',
                    {
                        key: 'desc',
                        style: {
                            textAlign: 'center',
                            marginBottom: '20px'
                        }
                    },
                    `Kode OTP telah dikirim ke ${email}`
                ),

                React.createElement(
                    'form',
                    {
                        key: 'form',
                        onSubmit
                    },
                    [

                        React.createElement('input', {
                            key: 'otp',
                            type: 'text',
                            placeholder: 'Masukkan 6 digit OTP',
                            value: otp,
                            maxLength: 6,
                            onChange: (e) => setOtp(e.target.value)
                        }),

                        React.createElement(
                            'button',
                            {
                                key: 'btn',
                                type: 'submit'
                            },
                            'Verifikasi'
                        )

                    ]
                ),
            ]
        )
    );
};

const VerifyEmail = {

    async render() {
        return `<div id="verify-email-root"></div>`;
    },

    async afterRender() {

        const root = ReactDOM.createRoot(
            document.getElementById('verify-email-root')
        );

        root.render(
            React.createElement(VerifyEmailView)
        );

    }

};

export default VerifyEmail;