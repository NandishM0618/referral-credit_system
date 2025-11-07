import { Suspense } from 'react';
import SignupPage from './RegisterForm';

export default function RegisterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignupPage />
        </Suspense>
    );
}
