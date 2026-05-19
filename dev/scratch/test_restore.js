
import fetch from 'node-fetch';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImFkbWluIjp7ImN0cmwiOnt9LCJpZHVzZXIiOjEsImVuYWJsZWQiOnRydWUsInVzZXJuYW1lIjoic3VwZXJvcGVuZnVzaW9uYXBpIiwiZmlyc3RfbmFtZSI6InN1cGVyIiwibGFzdF9uYW1lIjoidXNlciIsImVtYWlsIjoic3VwZXJvcGVuZnVzaW9uYXBpQGV4YW1wbGUuY29tIiwiZXhwX3RpbWUiOjM2MDB9LCJfcm5kXyI6MC41NDI2MDgyNzQ5OTg5Mjc4fSwiZXhwIjoxNzc4NDI3MzkxLCJpYXQiOjE3Nzg0MjM3OTF9.jo7iex4_TBxWab3yeNqRFzVYdA1CpSKiDqic2_Jx7Hw";

async function test() {
    try {
        const response = await fetch("http://localhost:3000/api/system/restore/prd", {
            "headers": {
                "accept": "*/*",
                "accept-language": "es-ES,es;q=0.6",
                "content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            "body": JSON.stringify({"restore":false}),
            "method": "PUT"
        });
        const data = await response.json();
        console.log("RESPONSE_START");
        console.log(JSON.stringify(data, null, 2));
        console.log("RESPONSE_END");
    } catch (error) {
        console.error("Fetch error:", error.message);
    }
}
test();
