(async function() {
    const $ = s => document.querySelector(s);
    const base = window.API_BASE.replace(/\/$/, '');


    // Wake up the Node server on load
    try {
        await fetch(`${base}/api/ping`, {
            cache: 'no-store'
        });
    } catch {
        /* ignore */ }


    $('#roll').onclick = async () => {
        const sides = +$('#sides').value || 6;
        const count = +$('#count').value || 1;
        const url = `${base}/api/roll?sides=${sides}&count=${count}`;
        const res = await fetch(url, {
            mode: 'cors'
        });
        const json = await res.json();
        $('#out').textContent = JSON.stringify(json, null, 2);
    };


    // Purposely hit the no-CORS route to show a browser-blocked request
    $('#tryFail').onclick = async () => {
        const sides = +$('#sides').value || 6;
        const count = +$('#count').value || 1;
        const url = `${base}/api/roll-nocors?sides=${sides}&count=${count}`;
        try {
            const res = await fetch(url, {
                mode: 'cors'
            });
            $('#out').textContent = 'Unexpected success: ' + await res.text();
        } catch (e) {
            $('#out').textContent = 'Expected CORS failure: ' + e;
        }
    };
})();