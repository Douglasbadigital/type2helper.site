// =====================================================================
// ⚙️ CONFIGURAÇÕES PRINCIPAIS (Altere apenas os valores aqui)
// =====================================================================

const CONFIG = {
    // ⏱️ Tempo de Delay: Formato "Minutos:Segundos"
    // Exemplo: "34:00" = 34 minutos | "00:30" = 30 segundos (para testes)
    // Nota: 3 segundos extras são adicionados automaticamente como
    // compensação pelo tempo médio até o lead dar play no vídeo
    tempoDeDelay: "00:15",

    // 🔗 Links de Checkout dos Botões (GLPatches)
    linkPote2: "https://lifebalancepeak.com/b?p=GPP2V1&b=341&fid=640&fnid=2&pfnid=1&pg=9467&aff_id=1002",
    linkPote6: "https://lifebalancepeak.com/b?p=GPP6V1&b=341&fid=640&fnid=2&pfnid=1&pg=9467&aff_id=1002",
    linkPote3: "https://lifebalancepeak.com/b?p=GPP3V1&b=341&fid=640&fnid=2&pfnid=1&pg=9467&aff_id=1002"
};

// =====================================================================
// 💻 CÓDIGO DO SISTEMA (Não precisa alterar nada daqui para baixo)
// =====================================================================

document.addEventListener("DOMContentLoaded", function() {

    // 1. APLICAR LINKS DE CHECKOUT
    document.getElementById('card-2-bottles').href = CONFIG.linkPote2;
    document.getElementById('card-6-bottles').href = CONFIG.linkPote6;
    document.getElementById('card-3-bottles').href = CONFIG.linkPote3;

    // 2. SISTEMA DE DELAY DA OFERTA E NOTIFICAÇÕES
    function calcularDelayEmMilissegundos(tempoStr) {
        const partes = tempoStr.split(':');
        const minutos = parseInt(partes[0], 10) || 0;
        const segundos = parseInt(partes[1], 10) || 0;
        const totalSegundos = (minutos * 60) + segundos;
        return totalSegundos * 1000;
    }

    // 3s fixos de compensação pelo tempo médio até o lead dar play no vídeo
    const COMPENSACAO_MS = 3000;

    const delayTotal = calcularDelayEmMilissegundos(CONFIG.tempoDeDelay) + COMPENSACAO_MS;

    // 3. PRELOAD DAS IMAGENS DOS CARDS
    // Inicia 20 segundos antes do delay terminar para evitar travada
    // Se o delay for menor que 20s, inicia imediatamente
    const ANTECEDENCIA_PRELOAD_MS = 20000;
    const tempoPreload = Math.max(0, delayTotal - ANTECEDENCIA_PRELOAD_MS);

    setTimeout(() => {
        const imagens = [
            "https://raw.githubusercontent.com/Douglasbadigital/type2helper.site/refs/heads/main/vsl/images/2-bottles.png",
            "https://raw.githubusercontent.com/Douglasbadigital/type2helper.site/refs/heads/main/vsl/images/6-bottles.png",
            "https://raw.githubusercontent.com/Douglasbadigital/type2helper.site/refs/heads/main/vsl/images/3-bottles.png",
            "https://cdn.elasticfunnels.io/123/assets/media/Group 507.png",
            "https://cdn.elasticfunnels.io/123/assets/media/MBP_BUTTON_1.png",
            "https://elasticfunnels-cdn.b-cdn.net/111/assets/cards.avif",
            "https://cdn.elasticfunnels.io/132/assets/media/SELOS.png",
            "https://storage.googleapis.com/download/storage/v1/b/asper-digital/o/1%2Fmedia%2FE7JAROAGZBRMEOBX.webp?generation=1708000145505835&alt=media"
        ];
        imagens.forEach(src => { new Image().src = src; });
    }, tempoPreload);


    // 4. FUNÇÃO DE REVELAR SEÇÃO
    function revelarSecao() {
        // Salva flag na sessão para revelar imediatamente se prospect retornar
        sessionStorage.setItem('ofertaRevelada', '1');

        // A. Revela a seção com os botões e garantia
        const secao = document.querySelector('.video-cta-container');
        if (secao) secao.style.display = 'block';

        // B. Cards dos potes aparecem imediatamente
        const grid = document.querySelector('.pricing-grid');
        if (grid) {
            grid.style.opacity = '1';
            grid.style.pointerEvents = 'auto';
        }

        // C. Desliza suavemente até o card de 6 potes
        const card6 = document.getElementById('card-6-bottles');
        if (card6) {
            card6.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // D. Popups iniciam 10 segundos após a seção ser revelada
        setTimeout(() => {
            startAllNotifications();
        }, 10000);
    }

    // 5. VERIFICA SE PROSPECT JÁ VIU A OFERTA (retorno ao site)
    if (sessionStorage.getItem('ofertaRevelada') === '1') {
        // Já assistiu: revela imediatamente sem delay
        revelarSecao();
    } else {
        // Primeira visita: aguarda o delay normal
        setTimeout(() => {
            revelarSecao();
        }, delayTotal);
    }

    // 6. CORREÇÃO MOBILE (bfcache): pageshow dispara quando o navegador
    // restaura a página do cache ao pressionar "voltar" no iOS/Android
    window.addEventListener('pageshow', function(event) {
        if (event.persisted && sessionStorage.getItem('ofertaRevelada') === '1') {
            revelarSecao();
        }
    });


    // 7. SISTEMA DO CONTADOR DE PESSOAS ASSISTINDO (Roda desde o início)
    function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }
    function updateCounter() {
        var currentCount = parseInt(document.getElementById('viewsCount').textContent.replace(/,/g, ''), 10);
        var increment = getRandomInt(1, 5);
        var nextCount = currentCount + increment;
        document.getElementById('viewsCount').textContent = nextCount.toLocaleString('en-US');
        var nextDelay = getRandomInt(1500, 3000);
        setTimeout(updateCounter, nextDelay);
    }
    document.getElementById('viewsCount').textContent = '71,712';
    updateCounter();


    // 8. SISTEMA DE NOTIFICAÇÕES FALSAS DE COMPRA (POP-UPS)
    const customerNames = [
        "Harper", "Noah", "Oliver", "Elijah", "William", "James", "Benjamin", "Lucas", "Henry", "Alexander", "Matt", "Paul",
        "Emma", "Olivia", "Ava", "Sophia", "Isabella", "Mia", "Charlotte", "Amelia", "Emily", "Abigail"
    ];
    const states = [
        {"name": "Alabama", "abbreviation": "al"}, {"name": "Alaska", "abbreviation": "ak"}, {"name": "Arizona", "abbreviation": "az"}, {"name": "Arkansas", "abbreviation": "ar"}, {"name": "California", "abbreviation": "ca"}, {"name": "Colorado", "abbreviation": "co"}, {"name": "Florida", "abbreviation": "fl"}, {"name": "Georgia", "abbreviation": "ga"}, {"name": "Hawaii", "abbreviation": "hi"}, {"name": "Illinois", "abbreviation": "il"}, {"name": "Texas", "abbreviation": "tx"}, {"name": "New York", "abbreviation": "ny"}
    ];
    const productNames = ["6 Packs of GLPatches", "3 Packs of GLPatches", "6 Packs of GLPatches"];

    function startAllNotifications() {
        const purchaseNotification = document.getElementById('purchase-notification');

        function updateNotificationContent(name, location, product, image) {
            purchaseNotification.querySelector('.customer-name').textContent = name;
            purchaseNotification.querySelector('.customer-location').textContent = location;
            purchaseNotification.querySelector('.product-name').textContent = product;
            purchaseNotification.querySelector('.profile-image').src = image;
        }

        function showNotification() {
            const name = customerNames[Math.floor(Math.random() * customerNames.length)];
            const state = states[Math.floor(Math.random() * states.length)];
            const product = productNames[Math.floor(Math.random() * productNames.length)];
            const image = `https://flagcdn.com/h40/us-${state.abbreviation}.png`;

            updateNotificationContent(name, state.name, product, image);

            setTimeout(() => {
                purchaseNotification.classList.add('show');
                setTimeout(() => {
                    purchaseNotification.classList.remove('show');
                    purchaseNotification.classList.add('hide');
                    setTimeout(() => purchaseNotification.classList.remove('hide'), 500);
                }, 10000);
            }, 500);
        }

        function startRandomInterval() {
            setTimeout(() => {
                showNotification();
                startRandomInterval();
            }, Math.random() * (30000 - 10000) + 11000);
        }

        setTimeout(() => {
            showNotification();
            startRandomInterval();
        }, 2000);
    }
});
