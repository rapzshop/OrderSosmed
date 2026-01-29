// Config Kamu
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

    function toggleP() {
        const p = document.getElementById('platform').value;
        document.getElementById('tkGroup').className = p === 'TikTok' ? '' : 'hidden';
        document.getElementById('igGroup').className = p === 'Instagram' ? '' : 'hidden';
    }

    function toggleL() {
        const l = document.getElementById('layanan').value;
        const isS = (l === 'Paket FYP' || l === 'Paket Malam');
        document.getElementById('inputNormal').className = isS ? 'hidden' : '';
        document.getElementById('inputSpesial').className = isS ? '' : 'hidden';
    }

    let base64 = "";
    function readImg() {
        const file = document.getElementById('bukti').files[0];
        const reader = new FileReader();
        reader.onload = e => { 
            base64 = e.target.result;
            document.getElementById('preview').src = base64;
            document.getElementById('preview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const b = document.getElementById('btnKirim');
        b.innerText = "Mengirim..."; b.disabled = true;

        const p = document.getElementById('platform').value;
        const data = {
            cust: document.getElementById('cust').value,
            platform: p,
            layanan: p === 'TikTok' ? document.getElementById('layanan').value : 'Followers IG',
            qty: p === 'TikTok' ? (document.getElementById('beliBerapa').value || document.getElementById('qty').value) : document.getElementById('igQty').value,
            link: p === 'TikTok' ? document.getElementById('link').value : document.getElementById('igLink').value,
            tambahan: document.getElementById('tambah').value || "-",
            bukti: base64,
            status: "pending",
            time: new Date().toLocaleString()
        };

        try {
            await db.ref('orders').push(data);
            alert("Berhasil! Menunggu ACC Admin.");
            location.reload();
        } catch(err) { alert("Gagal: " + err.message); b.disabled = false; b.innerText = "KIRIM ORDER SEKARANG"; }
    });
