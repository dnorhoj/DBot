const axios = require('axios');

const mojangAPI = "https://api.mojang.com";
const mcAPI = "https://mcapi.us";

async function usernameToUUID(username) {
    return axios.get(`${mojangAPI}/users/profiles/minecraft/${username}`)
        .then(response => {
            if(response.status == 200) {
                return response.data.id;
            }
        }).catch(() => {});
}

async function nameHistory(uuid) {
    return axios.get(`${mojangAPI}/user/profiles/${uuid}/names`)
        .then(response => {
            if(response.status == 200) {
                return response.data;
            }
        }).catch(() => {});
}

async function serverStatus(ip, port) {
    return axios.get(`${mcAPI}/server/status?ip=${ip}&port=${port}`)
        .then(response => {
            return response.data;
        }).catch(() => {
            return {online:false}
        });
}

module.exports = { usernameToUUID, nameHistory, serverStatus };
