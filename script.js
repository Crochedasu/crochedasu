// =====================================================
// 1. LISTA DE PRODUTOS COM CATEGORIAS
// =====================================================
const produtos = [
    // --- BOLSAS ---
    { nome: "Bolsa Azul", preco: 60.00, imagem: "imagens/bolsa_azul.jpeg", categoria: "bolsas" },
    { nome: "Bolsa Lilás", preco: 160.00, imagem: "imagens/Bolsa_Lilas.jpeg", categoria: "bolsas" },
    { nome: "Bolsa Rosas", preco: 60.00, imagem: "imagens/Bolsa_Rosas.jpeg", categoria: "bolsas" },
    { nome: "Bolsa de praia mesclada", preco: 35.00, imagem: "imagens/Bolsa_de_praia_mesclada.jpeg", categoria: "bolsas"},
    { nome: "Bolsa de praia", preco: 40.00, imagem: "imagens/Bolsa_de_praia.jpeg", categoria: "bolsas" },
    { nome: "Bolsa Flores Arco-íris", preco: 70.00, imagem: "imagens/Bolsa_flores_arco_iris.jpeg", categoria: "bolsas" },
    { nome: "Bolsa de Praia Marrom", preco: 50.00, imagem: "imagens/Bolsa_marrom.jpeg", categoria: "bolsas" },
    { nome: "Bolsa de praia Preta ", preco: 50.00, imagem: "imagens/Bolsa_preta.jpeg", categoria: "bolsas" },
    
    // --- DECORAÇÃO ---
    { nome: "Capa Galão invertido", preco: 70.00, imagem: "imagens/Capa_galão.jpeg", categoria: "decoracao" },
    { nome: "Jogo-americano Dourado", preco: 100.00, imagem: "imagens/Jogo_americano.jpeg", categoria: "decoracao" },
    { nome: "Sousplat Tulipas", preco: 60.00, imagem: "imagens/Supla_tulipas.jpeg", categoria: "decoracao" },
    { nome: "Tapete Coração", preco: 80.00, imagem: "imagens/Tapete_coração.jpeg", categoria: "decoracao" },
    { nome: "Tapete laranja", preco: 40.00, imagem: "imagens/tapete_laranja.jpeg", categoria: "decoracao" },
    { nome: "Tapete roxo", preco: 40.00, imagem: "imagens/Tapete_Roxo.jpeg", categoria: "decoracao" },
    { nome: "Tapete mesclado", preco: 35.00, imagem: "imagens/tapete_mesclado.jpeg", categoria: "decoracao" },
    { nome: "Trilho Arco-íris", preco: 35.00, imagem: "imagens/Trilho_arco_iris.jpeg", categoria: "decoracao" },
    { nome: "Trilho Lilás", preco: 80.00, imagem: "imagens/Trilho_lilas.jpeg", categoria: "decoracao" },
    { nome: "Trilho Vermelho", preco: 80.00, imagem: "imagens/trlho_vermelho.jpeg", categoria: "decoracao" },
    { nome: "Trilho Violeta", preco: 95.00, imagem: "imagens/Trilho_Violeta.jpeg", categoria: "decoracao" },
    // --- ACESSÓRIOS ---
    { nome: "Chapéu Arco-íris", preco: 35.00, imagem: "imagens/Chapeu_arco_iris.jpeg", categoria: "acessorios" },
    { nome: "Chepéu Flores", preco: 50.00, imagem: "imagens/Chapeu_flores.jpeg", categoria: "acessorios" },
];

// =====================================================
// 2. VARIÁVEIS GLOBAIS
// =====================================================
const container = document.getElementById("container-produtos");
const listaCarrinho = document.getElementById("lista-carrinho");
const totalCarrinho = document.getElementById("total-carrinho");
const carrinhoElement = document.getElementById("meuCarrinho");
const btnAbrirCarrinho = document.getElementById("abrirCarrinho");
const btnFecharCarrinho = document.getElementById("fecharCarrinho");
const barraPesquisa = document.getElementById("barraPesquisa");
const botoesCategoria = document.querySelectorAll('.cat-btn'); 

let carrinho = JSON.parse(localStorage.getItem('meuCarrinho')) || [];
let cronometroCarrinho; // Controla o tempo de fechar automático

// =====================================================
// 3. FUNÇÃO PRINCIPAL: RENDERIZAR PRODUTOS
// =====================================================
function renderizarProdutos(listaDeProdutos) {
    container.innerHTML = "";
    if(listaDeProdutos.length === 0) {
        container.innerHTML = "<p style='grid-column: 1/-1; text-align:center; font-size: 18px; color: #777;'>Nenhum produto encontrado nesta categoria.</p>";
        return;
    }
    listaDeProdutos.forEach((produto, index) => {
        const htmlDoProduto = `
            <div class="produto" data-categoria="${produto.categoria}">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p class="preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                <button id="btn-${index}" onclick="adicionarAoCarrinho('${produto.nome}')">Adicionar ao Carrinho</button>
            </div>
        `;
        container.innerHTML += htmlDoProduto;
    });
}

// =====================================================
// 4. FUNÇÕES DO CARRINHO
// =====================================================

// [NOVA FUNÇÃO] Fecha o carrinho com estilo
function fecharCarrinhoComAnimacao() {
    if(!carrinhoElement) return;

    // 1. Adiciona a classe que faz a animação de saída no CSS
    carrinhoElement.classList.add('carrinho-fechando');

    // 2. Espera 500ms (0.5s) que é o tempo da animação CSS terminar
    setTimeout(() => {
        carrinhoElement.style.display = 'none'; // Some de verdade
        carrinhoElement.classList.remove('carrinho-fechando'); // Limpa a classe para a próxima vez
    }, 500); 
}

function adicionarAoCarrinho(nomeDoProduto) {
    const produto = produtos.find(p => p.nome === nomeDoProduto);
    
    if (produto) {
        carrinho.push(produto);
        atualizarCarrinhoLateral();
        
        if(carrinhoElement) {
            // Garante que o carrinho está visível e SEM a classe de fechar
            carrinhoElement.style.display = 'block'; 
            carrinhoElement.classList.remove('carrinho-fechando');

            // Reinicia o cronômetro de fechar automático
            clearTimeout(cronometroCarrinho);
            cronometroCarrinho = setTimeout(() => {
                fecharCarrinhoComAnimacao(); // Chama a nova função
            }, 10000); 
        }
    }
}

function removerDoCarrinho(indexNoCarrinho) {
    carrinho.splice(indexNoCarrinho, 1);
    atualizarCarrinhoLateral();
}

function atualizarCarrinhoLateral() {
    listaCarrinho.innerHTML = "";
    let total = 0;
    
    carrinho.forEach((item, index) => {
        total += item.preco;
        const li = document.createElement("li");
        li.style.cssText = "display:flex; align-items:center; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:10px;";
        li.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}" style="width:60px; height:60px; object-fit:cover; border-radius:4px; margin-right:10px;">
            <span style="flex:1; font-size: 14px;">${item.nome} - R$ ${item.preco.toFixed(2).replace(".", ",")}</span>
            <button onclick="removerDoCarrinho(${index})" style="background:red; color:white; border:none; font-size:10px; width:18px; height:18px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center;">×</button>
        `;
        listaCarrinho.appendChild(li);
    });
    
    totalCarrinho.innerText = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
    
    const contadorCarrinho = document.querySelector('.cart-count');
    if(contadorCarrinho) contadorCarrinho.innerText = carrinho.length;

    localStorage.setItem('meuCarrinho', JSON.stringify(carrinho));
}

// =====================================================
// 5. EVENTOS
// =====================================================

// Botões de Categoria
botoesCategoria.forEach(btn => {
    btn.addEventListener('click', (e) => {
        botoesCategoria.forEach(b => b.classList.remove('ativo'));
        e.target.classList.add('ativo');

        const categoriaSelecionada = e.target.getAttribute('data-cat');
        barraPesquisa.value = "";

        if (categoriaSelecionada === 'todos') {
            renderizarProdutos(produtos);
        } else {
            const filtrados = produtos.filter(p => p.categoria === categoriaSelecionada);
            renderizarProdutos(filtrados);
        }
    });
});

// Pesquisa
barraPesquisa.addEventListener("input", function() {
    const termo = this.value.toLowerCase();
    botoesCategoria.forEach(b => b.classList.remove('ativo'));
    const produtosFiltrados = produtos.filter(produto => produto.nome.toLowerCase().includes(termo));
    renderizarProdutos(produtosFiltrados);
});

// BOTÃO MANUAL DE ABRIR
if(btnAbrirCarrinho && carrinhoElement) {
    btnAbrirCarrinho.addEventListener('click', () => {
        carrinhoElement.style.display = 'block';
        carrinhoElement.classList.remove('carrinho-fechando');
    });
}

// BOTÃO MANUAL DE FECHAR (Agora com animação também!)
if(btnFecharCarrinho && carrinhoElement) {
    btnFecharCarrinho.addEventListener('click', () => {
        fecharCarrinhoComAnimacao();
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos(produtos);
    atualizarCarrinhoLateral();
});

// =====================================================
// 6. FINALIZAR COMPRA
// =====================================================
function pagarWhatsApp() {
    if (carrinho.length === 0) { alert("Seu carrinho está vazio!"); return; }
    let mensagem = "Olá! Quero finalizar minha compra no Crochê da Su:\n\n";
    let total = 0;
    carrinho.forEach(item => {
        mensagem += `- ${item.nome}: R$ ${item.preco.toFixed(2).replace(".", ",")}\n`;
        total += item.preco;
    });
    mensagem += `\n*Total a pagar: R$ ${total.toFixed(2).replace(".", ",")}*`;
    let numeroWhatsApp = "557598922876"; 
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, "_blank");
}
const btnFinalizar = document.querySelector('.btn-finalizar');
if(btnFinalizar) btnFinalizar.addEventListener('click', pagarWhatsApp);