import "dotenv/config";

const url = "http://localhost:3000/api/system/api/endpoint/source/summary/prd";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImFwaWtleSI6eyJpZGFwcCI6ImNmY2QyMDg0LTk1ZDUtNjVlZi02NmU3LWRmZjlmOTg3NjRkYSIsImlkY2xpZW50IjoiNjE4OWU0MDEtYjdmYS00MGU1LTllODUtYmUwMjhlMTNhNmFlIn19LCJleHAiOjE3ODI5NTA0MDAsIm5iZiI6MTc3ODExMjAwMCwiaWF0IjoxNzc4Mjk5OTY1fQ.FN6vsklPSia4HoAcQCwEHlpa1VQKsu9NzF6qBjylpqM";

async function run() {
    console.log(`Testing POST ${url}...`);
    try {
        const testRes = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "User-Agent": "Mozilla/5.0"
            }
        });
        const body = await testRes.text();
        console.log(`Response: ${testRes.status} ${testRes.statusText}`);
        console.log(`Body: ${body}`);
    } catch (err) {
        console.error(`Error:`, err.message);
    }
}

run();
