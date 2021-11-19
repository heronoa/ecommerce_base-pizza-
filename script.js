let cart = [], modalQt = 1, modalKey;

const c= (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);


// LISTAGEM DAS PIZZAS
// Adicionando as pizzas
pizzaJson.map((item, index)=>{ //Arrow Function
    //Seleciona o modelo para dispor as pizzas
    let pizzaItem = c('.models .pizza-item').cloneNode(true); // Equivalente à document.querySelector('.models .pizza-item').cloneNode(true)

    //Guardando o id das pizzas
    pizzaItem.setAttribute('data-key', index);

    //Preenchendo as informações das pizza no modelo
    pizzaItem.querySelector('.pizza-item--img img').src = item.img; // Equivalente à document.querySelector('.models .pizza-item').cloneNode(true).querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    
    //Adcionando a funcionalidade no botão
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        

        //Preenchendo os dados da pizza no modal apartir da variavel key (id da pizza)
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;

        //Mantem a opção grande selecionada
        c('.pizzaInfo--size.selected').classList.remove('selected');


        //Preenchendo o peso das pizzas

        /*
        function forEach(callback, array) {
        for (const index in array) {
            callback(array[index], +index, array);
            }
        }

        const arr = [1, 2, 3];
        forEach(console.log, arr);

        */
        cs('.pizzaInfo--size').forEach((size,sizeIndex)=>{ // O primeiro parametro de retorno do forEach e o proprio item, o segundo é o index da vez
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

        });
        c('.pizzaInfo--qt').innerHTML = modalQt;


        //Faz com que o modal das pizzas aparece ao clicar na pizza e simula uma animação
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() =>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 1);

    })
    
    //Dispoe um modelo para cada pizza pertencente a pizzaJson
    c('.pizza-area').append( pizzaItem ); // document.querySelector('.pizza-area').append( pizzaItem )


});

//EVENTOS DO MODAL

//Função que fecha o modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
//Botão para fechar o modal
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

//Botão para aumentar e dimunuir a quantidade de pizzas
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
//Botão para escolher o tamanho da pizza
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
//Botão de adicionar ao carrinho
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    // Precisamos saber qual a pizza?
    //console.log("Pizza: "+modalKey);
    // Qual o tamanho?
    //console.log("tamanho é " + size)
    // Quantas pizzas serão adicionadas?
    //console.log('quantidade: ' + modalQt)
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    //Pizzas do mesmo tamanho e do mesmo id devem se empilhar e não se torna item diferentes
    //Criando um identificador apartir dos atributos que considero igual
    let identifier = pizzaJson[modalKey].id+'@'+size;

    //Verificando se tem um identifier igual ao que eu quero acrescentar
    let  key = cart.findIndex((item)=>item.identifier == identifier);

    /*Se houver um item com o mesmo identifier vamos alterar a quantidade do item que já 
    esta no carrinho caso contrario vamos adcionar um item novo */
    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        //Pizzas selecionadas vão para o carrinho
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }   

    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
})

//Atualiza as informações no carrinho
function updateCart(){
    //Atualiza o numero de item no icone do mobile
    c('.menu-openner span').innerHTML = cart.length;


    if(cart.length > 0) {
        //Para o carrinho aparecer:
        c('aside').classList.add('show'); //classe que muda o width do aside para ele deslizar na direita para a esquerda
    
        c('.cart').innerHTML = '';

        let subtotal = 0, desconto = 0, total = 0;


        //Preenchendo o carrinho com as pizzas selecionadas
        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);

            subtotal += pizzaItem.price * cart[i].qt;


            let cartItem = c('.models .cart--item').cloneNode(true);
            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P'; 
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            };
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            

            //Preenchendo os dados das pizzas selecionados
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            //Evento de mais e menos da quantidade no carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{

                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();

            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++
                updateCart();
            });
            
            //Clona o modelo definido no html e poe dentro da aba do carrinho
            c('.cart').append(cartItem);

        }


        //Calcula os valores no carrinho 
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    };
};
//Ideais de implementação: Mudar o valor de acordo com o tamanho da pizza