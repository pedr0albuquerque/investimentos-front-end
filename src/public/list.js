// Esse arquivo js é responsavel pela interação com a tela de listagem de investimentos
// Ele carrega a tabela de investimentos, permite editar e deletar investimentos

//importando a função de validação de data e valor
import { verificateDate, verificateValue } from './validator.js';

// Função loadTable carrega a tabela de acordo com os dados recebidos
// Ela recebe uma lista de investimentos e preenche a tabela com os dados
// Chamada pela função getInv() que faz uma requisição ao servidor para obter os investimentos
function loadTable(listInvestments) {
    const tabelaBody = document.querySelector('#tableInvestment tbody');
    tabelaBody.innerHTML = '';

    // Verifica se a lista de investimentos é um array e itera sobre cada investimento
    // Cria uma linha para cada investimento e adiciona os dados nas células
    // Também adiciona os botões de editar e deletar
    if(Array.isArray(listInvestments)){
      listInvestments.forEach(investment => {
        const line = document.createElement('tr');

        const idInvestment = document.createElement('td');
        idInvestment.textContent = investment.idInvestment;

        const nameInvestment = document.createElement('td');
        nameInvestment.textContent = investment.nameInvestment;

        const typeInvestment = document.createElement('td');
        typeInvestment.textContent = investment.typeInvestment;

        const valueInvestment = document.createElement('td');
        valueInvestment.textContent = investment.valueInvestment;

        const dateInvestment = document.createElement('td');
        dateInvestment.textContent = dayjs(investment.dateInvestment).format('DD/MM/YYYY');

        const btnEdit = document.createElement('button');
        btnEdit.id = "btnEdit";
        btnEdit.innerText = "Editar";
        btnEdit.addEventListener('click', () => showFormEdit(investment));
        

        const btnDelete = document.createElement('button');
        btnDelete.id = "btnDelete";
        btnDelete.innerText = "Deletar";
        btnDelete.addEventListener('click', () => deleteInvestment(investment.idInvestment));

        const actions = document.createElement('td');
        actions.appendChild(btnEdit);
        actions.appendChild(btnDelete);

        line.appendChild(idInvestment);
        line.appendChild(nameInvestment);
        line.appendChild(typeInvestment);
        line.appendChild(valueInvestment);
        line.appendChild(dateInvestment);
        line.appendChild(actions);

        tabelaBody.appendChild(line);
    });
    }
}

// Variável global para armazenar o id do investimento que será editado
let idInvestment = null

// Função showFormEdit exibe o formulário de edição com os dados do investimento selecionado
function showFormEdit(investment) {
  const editForm = document.querySelector('#editForm');
  const inputEditName = document.querySelector('#editNameInvestment');
  const inputEditType = document.querySelector('#editTypeInvestment');  
  const inputEditValue = document.querySelector('#editValueInvestment');
  const inputEditDate = document.querySelector('#editDateInvestment');

  inputEditName.value = investment.nameInvestment;
  inputEditType.value = investment.typeInvestment;
  inputEditValue.value = investment.valueInvestment;
  inputEditDate.value = investment.dateInvestment;

  //Passa o id do investimento para a variável global
  idInvestment = investment.idInvestment;

  // Mostrar o formulário de edição
  editForm.style.display = 'block';
  editForm
}

// Deleta o investimento com base no idInvestment
function deleteInvestment(idInvestment) {
  fetch(`http://localhost:3000/investimentos/${idInvestment}`, {
    method: 'DELETE'
  })
  .then(response => {
    if(response.status === 200){
      alert("Investimento deletado com sucesso")
      getInv();
    }else{
      alert("Falha ao deletar investimento");
    }
  })
}

// Adiciona a máscara de entrada para o campo de valor do investimento
$(document).ready(function() {
  $('#editValueInvestment').mask('000.000.000,00', {reverse: true});
});

// Adiciona o evento de submit ao formulário de edição
// Quando o formulário é enviado, ele previne o comportamento padrão e faz uma requisição PUT para atualizar o investimento
document.querySelector('#editForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const inputEditName = document.querySelector('#editNameInvestment').value;
  const inputEditType = document.querySelector('#editTypeInvestment').value;  
  const inputEditValue = parseFloat(document.querySelector('#editValueInvestment').value.replace(/\./g,'').replace(/,/g, '.'));
  const inputEditDate = document.querySelector('#editDateInvestment').value;

  // Atualiza tabela dinamicamente pelo metodo getInv()
  if (!inputEditName || !inputEditType || isNaN(inputEditValue) || !inputEditDate) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }else{
      // Verificando se a data é válida
      const dataResp = verificateDate(inputEditDate);
      if(!dataResp) {
        return;
      }
      
      // Verificando se o valor do investimento é inválido
      const valueResp = verificateValue(inputEditValue);
      if(valueResp <= 0 ) {
        return;
      }

      fetch(`http://localhost:3000/investimentos/${idInvestment}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nameInvestment: inputEditName,
          typeInvestment: inputEditType,
          valueInvestment: inputEditValue,
          dateInvestment: inputEditDate
        })
      })
      .then(response => {
        if(response.status === 200){
          alert("Investimento atualizado com sucesso")
          getInv();
        }else{
          alert("Falha ao atualizar investimento");
        }
        document.querySelector('#editForm').style.display = 'none';
      })
    }
});

// Função getInv faz uma requisição ao servidor para obter os investimentos
const getInv = async() => await fetch("http://localhost:3000/investimentos")
.then(response => response.json())
.then(data => {loadTable(data.listInvestments)});
// Ao inciar a página, chama a função getInv para carregar os investimentos
getInv();

// Carrega a tabela de investimentos ao carregar a página
window.onload = loadTable;