import { loggerError_Serverside } from '@/utils/logger';
import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next'

export default handleAuth({
    async login(req: NextApiRequest, res: NextApiResponse) {
        try {
            const returnTo = req.query.param === 'signup' ? `/account` : `/archive`
            await handleLogin(req, res, {
                returnTo,
                authorizationParams: { screen_hint: (req.query.param || null) }
            });
        } catch (e) {
            //// Logging ////
            console.error('error : api/[...auth0] Login/Signin にてエラー。ログイン・サインインの失敗。')
            loggerError_Serverside(req, res, e, 'api/[...auth0] Login/Signin にてエラー。ログイン・サインインの失敗。')
            //// end of Logging ////
            res.status(e.status || 500).end(e.message);
        }
    }
});