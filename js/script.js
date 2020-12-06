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
        let id = localStorage.getItem('id_locais')

        if(id === null){
            id = localStorage.setItem('id_locais', 0);
        }
    }

    //retorna o proximo id disponível
    proximoId(){
        let id = localStorage.getItem('id_locais');
        return parseInt(id) + 1;
    }

    //insere elemento no localStorage
    set(local){
        let id = this.proximoId();
        localStorage.setItem(`id_local_${id}`, JSON.stringify(local));
        localStorage.setItem(`id_locais`, id);
    }

    //edita elemento
    setId(id, local){
        localStorage.setItem(`id_local_${id}`, JSON.stringify(local));
    }

    //remove elemento
    delete(id){
        localStorage.removeItem(`id_local_${id}`);
        this.isEmpty();
    }

    isEmpty(){
        let locais = Array();
        locais = this.getAll();

        if(locais.length === 0){
            localStorage.setItem(`id_locais`, 0);
            return true;
        }

        return false;
    }

    getById(id){
        let local = JSON.parse(localStorage.getItem(`id_local_${id}`));
        return local;
    }

    //apresentas todos os elementos
    getAll(){
        let id = localStorage.getItem('id_locais');
        let locais = Array();

        for(let i=1; i<=id; i++){
            
            //se elemento na pos i não existir/foi removido continua 
            if(localStorage.getItem(`id_local_${i}`) === null){
                continue;
            }

            let local = this.getById(i);
            local.id = i;

            locais.push(local);
        }

        return locais;
    }
}

let dbLocais = new DbLocaisTrabalho();


function cadastrarLocal(id = ''){
    let funcionario = document.getElementById(`funcionario_${id}`).value;
    let predio = document.getElementById(`predio_${id}`).value;
    let local = document.getElementById(`localTrabalho_${id}`).value;

    let localTrabalho = new LocalTrabalho(
        funcionario,
        predio,
        local
    );

    if(id != '' && localTrabalho.validarLocalTrabalho()){
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
        locais = dbLocais.getAll();
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

        locais.forEach(function(local){
            let linha = apresentandoLocais.insertRow();

            linha.id = `linha_${local.id}`;
            linha.insertCell(0).innerHTML = local.funcionario;
            linha.insertCell(1).innerHTML = local.predio.replace('p', 'P');
            linha.insertCell(2).innerHTML = local.localDeTrabalho;
            linha.insertCell(3).innerHTML = `<i class="fas fa-pen" onclick="editarLocal(${local.id})"></i><i class="fas fa-trash" onclick="removerLocal(${local.id})"></i>`;
            
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
    modalTexto.innerText = 'Tem certeza que deseja alterar o cadastrado?';
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
    modalTexto.innerText = 'Tem certeza que deseja remover o cadastrado?';
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
    locaisLista = dbLocais.getAll();

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


