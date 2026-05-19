import "dotenv/config";

const url = "http://localhost:3000/api/system/api/endpoint/source/summary/prd";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImFwaWtleSI6eyJpZGFwcCI6ImNmY2QyMDg0LTk1ZDUtNjVlZi02NmU3LWRmZjlmOTg3NjRkYSIsImlkY2xpZW50IjoiNjE4OWU0MDEtYjdmYS00MGU1LTllODUtYmUwMjhlMTNhNmFlIn19LCJleHAiOjE3ODI5NTA0MDAsIm5iZiI6MTc3ODExMjAwMCwiaWF0IjoxNzc4Mjk5OTY1fQ.FN6vsklPSia4HoAcQCwEHlpa1VQKsu9NzF6qBjylpqM";

async function test() {
    console.log(`Testing POST ${url} with body...`);
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            idendpoint: "0f9b28e3-5412-45dd-82f6-c5bf1778d104"
        })
    });
    console.log(`Response: ${response.status} ${response.statusText}`);
    const data = await response.text();
    console.log(`Body: ${data}`);
}

test();
