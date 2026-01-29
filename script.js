// CONFIG ASLI KAMU
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

    // FUNGSI ASLI KAMU
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
            const prev = document.getElementById('preview');
            prev.src = base64;
            prev.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // REQUEST KAMU: PERINGATAN PRIVATE AKUN
        if(!confirm("⚠️ PENTING: Pastikan akun Anda TIDAK DI-PRIVATE agar pesanan lancar. Lanjutkan?")) return;

        const waNum = document.getElementById('wa').value;
        if(!waNum.startsWith('62')) {
            alert("Nomor WA harus diawali 62 (Contoh: 62812...)");
            return;
        }

        const b = document.getElementById('btnKirim');
        b.innerText = "Processing..."; b.disabled = true;

        const p = document.getElementById('platform').value;
        const name = document.getElementById('cust').value;
        const layanan = p === 'TikTok' ? document.getElementById('layanan').value : 'IG Followers';
        const qty = p === 'TikTok' ? (document.getElementById('beliBerapa').value || document.getElementById('qty').value) : document.getElementById('igQty').value;

        const data = {
            cust: name,
            wa: waNum,
            platform: p,
            layanan: layanan,
            qty: qty,
            link: p === 'TikTok' ? document.getElementById('link').value : document.getElementById('igLink').value,
            tambahan: document.getElementById('tambah') ? (document.getElementById('tambah').value || "-") : "-",
            bukti: base64,
            status: "pending",
            time: new Date().toLocaleString("id-ID")
        };

        try {
            await db.ref('orders').push(data);

            // REQUEST KAMU: KIRIM BOT WHATSAPP
            const waMsg = "*HALO KAK " + name.toUpperCase() + "!* 👋\n\nTerima kasih sudah order di *RaffGemes Service*. Pesanan Anda telah masuk:\n\n🔹 *Item:* " + qty + " " + layanan + "\n🔹 *Status:* Menunggu Antrean 🚀\n\n⚠️ *Note:* Mohon akun tidak di-private.\n\n_Pesan ini dikirim otomatis oleh bot untuk memastikan orderan terkirim. Jika proses dimulai, akan di-chat kembali oleh owner/admin._ ✅";

            await fetch('https://api.fonnte.com/send', {
                method: 'POST',
                headers: { 'Authorization': FONTE_TOKEN },
                body: new URLSearchParams({ 'target': waNum, 'message': waMsg, 'countryCode': '62' })
            });

            // REQUEST KAMU: ANIMASI CENTANG
            const overlay = document.getElementById('success-overlay');
            overlay.style.display = 'flex';
            overlay.classList.add('animate__fadeIn');
            
            setTimeout(() => { location.reload(); }, 3500);

        } catch(err) { 
            alert("Gagal: " + err.message); 
            b.disabled = false; b.innerText = "KIRIM ORDER SEKARANG"; 
        }
    });
