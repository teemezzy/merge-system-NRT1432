import axios from 'axios';
import Cookies from 'cookies';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        res.status(404);
        return;
    }

    const data = req.body;
    const cookies = new Cookies(req, res);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
        const result = await axios.post(
            `${apiUrl}/api/v1/user/login/access-token`,
            new URLSearchParams({ ...data }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );

        const cookieExpiry = new Date();
        cookieExpiry.setDate(cookieExpiry.getDate() + 60);

        cookies.set('token', result.data.access_token, {
            expires: cookieExpiry,
            sameSite: 'strict',
        });

        res.status(200).json(result.data);
    } catch (error: any) {
        res.status(error.response.status).json(error.response.data);
    }
}
