import axios from 'axios';
axios.defaults.withCredentials = true;

export const interceptedAxios = axios;

export const downloadVideo = (blob: any, filename: string) => {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.type = 'video/webm';
    a.click();
    window.URL.revokeObjectURL(url);
};


export const getUserDetails = (params: { response: any, token: string }) => {
    const { response, token } = params;
    const userData = response?.data;
    if (userData) {
        const extendedUser = {
            ...userData,
            token,
            full_name: `${userData.first_name} ${userData.last_name}`,
        };
        return extendedUser;
    }
    return null;

};

