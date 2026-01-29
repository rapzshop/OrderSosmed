const firebaseConfig = {
        apiKey: "AIzaSyAP4tVbyzcFWfPzw8fbetWShqxPBC1AT5Q",
        authDomain: "wkwkwk-7e5f0.firebaseapp.com",
        databaseURL: "https://wkwkwk-7e5f0-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "wkwkwk-7e5f0",
        storageBucket: "wkwkwk-7e5f0.firebasestorage.app",
        messagingSenderId: "589564116876",
        appId: "1:589564116876:web:301e5bdb516c566f2b20a9"
    };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    const FONTE_TOKEN = "AaaAzvco48eS44JBkB7f";

    function enterApp() {
        const lp = document.getElementById('landing-page');
        lp.style.opacity = '0';
        lp.style.transform = 'scale(1.05)';
        setTimeout(() => {
            lp.style.display = 'none';
            const main = document.getElementById('main-app');
            main.style.display = 'flex';
            setTimeout(() => { main.style.opacity = '1'; main.style.transform = 'translateY(0)'; }, 50);
        }, 800);
    }

    function toggleP() {
        const p = document.getElementById('platform').value;
        document.getElementById('tkGroup').className = p === 'TikTok' ? '' : 'hidden';
        document.getElementById('igGroup').className = p === 'Instagram' ? '' : 'hidden';
    }

    function toggleL() {
        const l = document.getElementById('layanan').value;
        const isS = (l === 'Paket FYP' || l === 'Paket Malam');
        const isMix = (l === 'CAMPURAN');
        document.getElementById('inputNormal').className = (isS || isMix) ? 'hidden' : 'form-group';
        document.getElementById('inputSpesial').className = isS ? 'form-group' : 'hidden';
        document.getElementById('mixModeUI').className = isMix ? 'mix-box' : 'hidden';
    }

    let base64 = "";
    function readImg() {
        const file = document.getElementById('bukti').files[0];
        const reader = new FileReader();
        reader.onload = e => { 
            base64 = e.target.result;
            const prev = document.getElementById('preview');
            prev.src = base64; prev.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    function closeSuccess() {
        document.getElementById('success-overlay').style.display = 'none';
        document.getElementById('orderForm').reset();
        document.getElementById('preview').style.display = 'none';
        window.scrollTo(0,0);
    }

    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const b = document.getElementById('btnKirim');
        b.innerText = "Sabar, sedang memproses..."; b.disabled = true;

        const waNum = document.getElementById('wa').value;
        const p = document.getElementById('platform').value;
        const mode = document.getElementById('layanan').value;
        const name = document.getElementById('cust').value;

        let finalQty = document.getElementById('qty').value;
        if(mode === 'CAMPURAN') {
            finalQty = `Mix: V:${document.getElementById('mixView').value || 0}, L:${document.getElementById('mixLike').value || 0}, F:${document.getElementById('mixFol').value || 0}`;
        } else if (mode === 'Paket FYP' || mode === 'Paket Malam') {
            finalQty = document.getElementById('beliBerapa').value + " Paket";
        }

        const data = {
            cust: name, wa: waNum, platform: p, layanan: mode,
            qty: p === 'TikTok' ? finalQty : document.getElementById('igQty').value,
            link: p === 'TikTok' ? document.getElementById('link').value : document.getElementById('igLink').value,
            tambahan: document.getElementById('tambah').value || "-",
            bukti: base64, status: "pending", time: new Date().toLocaleString("id-ID")
        };

        try {
            await db.ref('orders').push(data);
            
            // FONTE WHATSAPP NOTIF
            const msg = `*ORDER MASUK - RAPZ STORE* 👋\n\nHalo Kak *${name.toUpperCase()}*,\nPesanan Anda telah kami terima:\n\n🔹 *Item:* ${data.qty} ${mode}\n🔹 *Platform:* ${p}\n🔹 *Status:* Menunggu Konfirmasi\n\n⚠️ *Mohon akun tidak di-private!* Terma Kasih.`;
            await fetch('https://api.fonnte.com/send', {
                method: 'POST',
                headers: { 'Authorization': FONTE_TOKEN },
                body: new URLSearchParams({ 'target': waNum, 'message': msg })
            });

            // SHOW SUCCESS ANIMATION
            document.getElementById('success-overlay').style.display = 'flex';
            b.innerText = "SUBMIT ORDER SEKARANG"; b.disabled = false;
        } catch(err) { 
            alert("Gagal Terkirim: " + err.message); 
            b.disabled = false; b.innerText = "SUBMIT ORDER SEKARANG";
        }
    });
