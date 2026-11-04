# NVX / NovantX

Jalankan: python -m http.server 4174 --directory dist
Konten anggota, agent, Discord, film dan background: dist/config.js.
Layout: dist/index.html. Gaya: dist/style.css. Interaksi: dist/app.js.

Empat cinematic lokal (Jett, Yoru, Omen, Clove) muted dan loop. Perpindahan scene mengikuti scroll dan dapat dibalik; isi video diputar sebagai loop. Tombol CINEMATIC menjeda video. Video berhenti saat keluar layar, tab tersembunyi, atau dialog terbuka. Reduced-motion memakai poster statis dan carousel native; data-saver mematikan autoplay awal. SOUND OFF/ON mengaktifkan bunyi klik/scroll lokal, default mati.

Klik kartu membuka cuplikan pendek atau film resmi. FULL FILM membuka YouTube. Fade, Reyna dan Cypher langsung membuka film resmi. Video bukan rekaman pertandingan NVX. GSAP, ScrollTrigger dan Lenis disertakan lokal. Font Google memiliki fallback.

Tidak ada aset wajib yang kosong. Opsional: footage pertandingan NVX, cinematic Yoru resolusi lebih tinggi, tautan sosial tambahan. Ganti video, poster, preview di config.js. Sumber di ASSETS.md.
