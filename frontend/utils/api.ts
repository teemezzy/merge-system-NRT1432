import axios from 'axios';
import {
    notification
} from 'antd';


export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

export const streamRegistrationVideoToAPI = async (
    stream: MediaStream,
    setRegistrationIsSuccessful: any,
    setstartFaceRegistration: any,
    token: string,
) => {

    const recordedChunks: any = [];
    const options = { mimeType: 'video/webm;codecs=vp9' };
    const mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.start();

    mediaRecorder.ondataavailable = (e) => {
        recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { 'type': 'video/webm' });
        const formData = new FormData();
        formData.append('file', blob, 'video.webm');
        axios.post(`${API_URL}/identity/register/face-id`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${token}`
            }
        }).then((res) => {
            setRegistrationIsSuccessful(true);
            setstartFaceRegistration(false);
        }).catch((err) => {
            setRegistrationIsSuccessful(false);
            setstartFaceRegistration(false);
            alert("Face registration failed!");
        })
    };

    setTimeout(() => {
        mediaRecorder.stop();
    }, 5000);
}

export const streamVerifyVideoToAPI = async (
    stream: MediaStream,
    setVerificationIsSuccessful: any,
    setstartFaceVerification: any,
    setResponse: any
) => {

    const recordedChunks: any = [];
    const options = { mimeType: 'video/webm;codecs=vp9' };
    const mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.start();

    mediaRecorder.ondataavailable = (e) => {
        recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { 'type': 'video/webm' });
        const formData = new FormData();
        const responseData: any = {};

        formData.append('file', blob, 'video.webm');
        axios.post(`${API_URL}/identity/verify/face-id`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        }).then((res) => {
            setVerificationIsSuccessful(true);
            setstartFaceVerification(false);
            responseData.message = res.data.message;
            responseData.user = res.data.user
            responseData.hasError = false;
            setResponse(responseData);
            return responseData
        }).catch((error) => {
            setVerificationIsSuccessful(false);
            setstartFaceVerification(false);

            if (error.response) {
                if (error.response.status === 406 && error.response.data.message === "FAILED") {
                    responseData.message = error.response.data.message;
                    responseData.user = null
                    responseData.hasError = true;
                    setResponse(responseData);
                }

            } else {
                responseData.message = "Something went wrong. Please try again later.";
                responseData.user = null
                responseData.hasError = true;
                setResponse(responseData);
            }
        })
    };

    setTimeout(() => {
        mediaRecorder.stop();
    }, 2000);
}


export const registerNewUser = async (payload: any) => {
    try {
        await axios.post(
            `${API_URL}/user/register`,
            payload
        )
        notification.success({
            message: "Success",
            description: "Registration successful",
        });
        window.location.href = "/sign-in";
    } catch (error: any) {
        if (error.response) {
            const msg = error.response.data.detail;
            notification.error({
                message: "Error",
                description: msg,
            });
        } else {
            notification.error({
                message: "Error",
                description: "Something went wrong. Please try again later."
            });

        }
    }

}

const getURL = () => process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;


export const getUserInfo = async (token: any) => {
    if (!token) return null;

    const apiUrl = getURL();
    try {
        const res = await axios.get(
            `${apiUrl}/api/v1/user/me`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return res;
    } catch (error: any) {
        if (error.response) {
            const msg = error.response.data.detail;
            if (msg === "Could not validate credentials") {
                return null;
            }
            notification.error({
                message: "Error",
                description: msg,
            });
            return null;
        } else {
            notification.error({
                message: "Error",
                description: "Something went wrong. Please try again later."
            });
            return null;

        }
    }

}
