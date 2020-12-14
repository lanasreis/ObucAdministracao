class LocalTrabalho{
    constructor(funcionario, predio, localDeTrabalho){
        this.funcionario = funcionario;
        this.predio = predio;
        this.localDeTrabalho = localDeTrabalho;
    }

    //valida se todos os campos estão preenchidos
    validarLocalTrabalho(){
        if(this.funcionario != '' && this.predio != '' && this.localDeTrabalho != ''){
            return true;
        }

        return false;
    }
}

class DbLocaisTrabalho{
    constructor(){
        let arr = Array();
        arr = localStorage.getItem('arr_locais');

        if(arr == null){
            arr = localStorage.setItem('arr_locais', []);
        }
    }

    getArray(){
        let arr = [];
        arr = JSON.parse(localStorage.getItem('arr_locais'));
        if(arr == ''){
            arr = [];
        }
        return arr;
    }

    //insere elemento no localStorage
    set(local){
        let arr = [];
        arr = this.getArray();
        arr.push(local);
        localStorage.setItem('arr_locais', JSON.stringify(arr));
    }

    //edita elemento
    setId(id, local){
        let arr = [];
        arr = this.getArray();
        arr[id] = local;
        localStorage.setItem(`arr_locais`, JSON.stringify(arr));
    }

    //remove elemento
    delete(id){
        let arr = [];
        arr = JSON.parse(localStorage.getItem('arr_locais'));

        let newArray = [];
        newArray = arr.filter((value, index) => index != id);
        localStorage.setItem('arr_locais', JSON.stringify(newArray));
        this.isEmpty();
    }

    isEmpty(){
        let arr = [];
        arr = JSON.parse(localStorage.getItem('arr_locais'));
        
        if(arr.length === 0){
            localStorage.setItem(`arr_locais`, []);
            return true;
        }

        return false;
    }

    getById(id){
        let arr = [];
        arr = JSON.parse(localStorage.getItem('arr_locais'));
        return arr[id];
    }

}

let dbLocais = new DbLocaisTrabalho();


function cadastrarLocal(id = -1){
    console.log("Alterar ", id);
    let aux = id;
    if(id == -1) aux = '';
    let funcionario = document.getElementById(`funcionario_${aux}`).value;
    let predio = document.getElementById(`predio_${aux}`).value;
    let local = document.getElementById(`localTrabalho_${aux}`).value;

    let localTrabalho = new LocalTrabalho(
        funcionario,
        predio,
        local
    );

    if(id >= 0 && localTrabalho.validarLocalTrabalho()){
        console.log('Entrei Alterar ', id)
        dbLocais.setId(id, localTrabalho);
    }

    else if(localTrabalho.validarLocalTrabalho()){
        dbLocais.set(localTrabalho);
        
        let modal = document.getElementById('modal');
        let modalTitulo = document.getElementById('modal-titulo');
        let modalTexto = document.getElementById('modal-texto');
        let modalSuccess = document.getElementById('modal-success');
             
        modal.className = 'modal-container ';
        modalTitulo.innerText = 'Salvo';
        modalTitulo.className = 'modal-titulo success';
        modalTexto.innerText = 'Seu cadastro foi registrado com sucesso!';
        modalSuccess.className = 'button success';
        modalSuccess.onclick = () => {
            fecharModal();
            window.location.reload();
        };

        
    }

    else{
        let erroFuncionario = document.getElementById('erro-funcionario');
        let erroPredio = document.getElementById('erro-predio');
        let erroLocal = document.getElementById('erro-local');
        
        if(localTrabalho.funcionario == ''){
            erroFuncionario.className = 'form-error';
        }
        else{
            erroFuncionario.className = 'form-error inativo'
        }
        
        if(localTrabalho.predio == ''){
            erroPredio.className = 'form-error';
        }
        else{
            erroPredio.className = 'form-error inativo'
        }
        
        if(localTrabalho.localDeTrabalho == ''){
            erroLocal.className = 'form-error';
        }
        else{
            erroLocal.className = 'form-error inativo'
        }
    }
}

function listaLocais(locais = '') {
    if(locais == ''){
        locais = dbLocais.getArray();
    }

    let table = document.getElementById('tabela-info');
    let nenhumCadastro = document.getElementById('nenhumCadastro');
    let nenhumCadastroEncontrado = document.getElementById('nenhumCadastroEncontrado');

    if(locais.length === 0){
        table.className = 'tabela-info inativo';
        nenhumCadastro.className = 'nenhumCadastro';
        nenhumCadastroEncontrado.className = 'nenhumCadastro inativo';
    }

    else{
        nenhumCadastro.className = 'nenhumCadastro inativo';
        nenhumCadastroEncontrado.className = 'nenhumCadastro inativo';
        table.className = 'tabela-info';
        
        let apresentandoLocais = document.getElementById('apresentandoLocais');
        apresentandoLocais.innerHTML = '';

        locais.forEach(function(local, id){
            let linha = apresentandoLocais.insertRow();

            linha.id = `linha_${id}`;
            linha.insertCell(0).innerHTML = local.funcionario;
            linha.insertCell(1).innerHTML = local.predio.replace('p', 'P');
            linha.insertCell(2).innerHTML = local.localDeTrabalho;
            linha.insertCell(3).innerHTML = `<i class="fas fa-pen" onclick="editarLocal(${id})"></i><i class="fas fa-trash" onclick="removerLocal(${id})"></i>`;
            
        });
    
    }
    
}

function editarLocal(id){
    let local = dbLocais.getById(id);
    let linha = document.getElementById(`linha_${id}`);
    linha.innerHTML = '';

    linha.insertCell(0).innerHTML = `<input id="funcionario_${id}" name="funcionario_${id}" type="text" value="${local.funcionario}">`;

    let select = document.createElement('select');
    
    let option1 = document.createElement('option');
    option1.value="predio1";
    option1.innerText="Predio1";
    
    let option2 = document.createElement('option');
    option2.value="predio2";
    option2.innerText="Predio2";
    
    let option3 = document.createElement('option');
    option3.value="predio3";
    option3.innerText="Predio3";

    
    let option4 = document.createElement('option');
    option4.value="predio4";
    option4.innerText="Predio4";

    select.add(option1);
    select.add(option2);
    select.add(option3);
    select.add(option4);
    select.id=`predio_${id}`;

    select.value=`${local.predio}`;

    linha.insertCell(1).appendChild(select);

    linha.insertCell(2).innerHTML = `<input id="localTrabalho_${id}" name="localTrabalho_${id}" type="text" value="${local.localDeTrabalho}">`;
    let coluna4 = linha.insertCell(3).innerHTML = `<i class="fas fa-check" onclick="salvarEdicao(${id})"></i><i class="fas fa-times" onclick="listaLocais()"></i>`
    coluna4.className = 'opcoes';
}

function salvarEdicao(id){
    let modal = document.getElementById('modal');
    let modalTitulo = document.getElementById('modal-titulo');
    let modalTexto = document.getElementById('modal-texto');
    let modalNormal = document.getElementById('modal-normal');
    let modalCancel = document.getElementById('modal-cancel');
    
    modal.className = 'modal-container ';
    modalTitulo.innerText = 'Alterar dados';
    modalTexto.innerText = 'Tem certeza que deseja alterar o cadastro?';
    modalNormal.className = 'button ';
    modalNormal.onclick = () => {
        cadastrarLocal(id);
        fecharModal();
        listaLocais();
    };

    modalCancel.className = 'button cancel';
    modalCancel.onclick = () => {
        fecharModal();
        listaLocais();
    };

}


function removerLocal(id){
    let modal = document.getElementById('modal');
    let modalTitulo = document.getElementById('modal-titulo');
    let modalTexto = document.getElementById('modal-texto');
    let modalNormal = document.getElementById('modal-normal');
    let modalCancel = document.getElementById('modal-cancel');
    
    modal.className = 'modal-container ';
    modalTitulo.innerText = 'Remover';
    modalTexto.innerText = 'Tem certeza que deseja remover o cadastro?';
    modalNormal.className = 'button';
    modalNormal.innerText = 'OK';
    modalNormal.onclick = () => {
        dbLocais.delete(id);
        fecharModal();
        listaLocais();
    };

    modalCancel.className = 'button cancel';
    modalCancel.onclick = () => {
        fecharModal();
        listaLocais();
    };
}


function ativaNavegadores(){
    let navegador = document.getElementById('navegadores');
    navegador.className = 'navegadores';
}

function fechaNavegadores(){
    let navegador = document.getElementById('navegadores');
    navegador.className = 'navegadores inativo';
}

function fecharModal(){
    let modal = document.getElementById('modal');
    modal.className = 'modal-container inativo'

    let buttonSuccess = document.getElementById('modal-success');
    buttonSuccess.className = 'button success inativo';

    let buttonNormal = document.getElementById('modal-normal');
    buttonNormal.className = 'button inativo';

    let buttonCancel = document.getElementById('modal-cancel');
    buttonCancel.className = 'button cancel inativo';


}

function buscarLocal(){
    let funcionario = document.getElementById(`funcionario_`).value;
    let predio = document.getElementById(`predio_`).value;
    let local = document.getElementById(`localTrabalho_`).value;

    let buscaLocal = new LocalTrabalho(
        funcionario,
        predio,
        local
    );

    let locaisLista = [];
    locaisLista = dbLocais.getArray();

    let result = locaisLista.filter(local => (local.funcionario.includes(buscaLocal.funcionario) && local.predio.includes(buscaLocal.predio) && local.localDeTrabalho.includes(buscaLocal.localDeTrabalho)))

    console.log(result)
    if(result == ''){
        console.log('entrei')
        let divMsg = document.getElementById('nenhumCadastroEncontrado');
        let table = document.getElementById('tabela-info');
        let nenhumCadastro = document.getElementById('nenhumCadastro');
        
        table.className = 'tabela-info inativo';
        divMsg.className = 'nenhumCadastro';
        nenhumCadastro.className = 'nenhumCadastro inativo';
    }

    else{
        listaLocais(result);
    }
}


