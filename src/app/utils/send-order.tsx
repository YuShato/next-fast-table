export function sendOrder(data: { email: string; name: string; message: string; dufavorites: any[] }) {
    console.log("🚀 ~ sendOrder ~ data:", data)
    console.log(data);
    const apiEndpoint = '/api/order';

    if (typeof window !== 'undefined' && window.localStorage) {
        const dufavorites = JSON.parse(window.localStorage.getItem('dufavorites') || '[]');
        data.dufavorites = dufavorites;
    } else {
        data.dufavorites = [];
    }

    fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((response) => {
            alert(response.message);
        })
        .catch((err) => {
            alert(err);
        });
}