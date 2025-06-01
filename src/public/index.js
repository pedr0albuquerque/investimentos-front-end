// Esse arquivo js é responsável pela interação com a tela de cadastro de investimentos
// Ele captura os dados do formulário, valida e envia para o servidor

//importando a função de validação de data e valor
import { verificateDate, verificateValue } from './validator.js';

const form = document.querySelector('#formInvestment');

// Adiciona a máscara de entrada para o campo de valor do investimento
$(document).ready(function() {
  $('#valueInvestment').mask('000.000.000,00', {reverse: true});
});

//Adicionando o evento de submit ao formulário
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector('#nameInvestment').value;
  const type = document.querySelector('input[name="typeInvestment"]:checked').value;
  const value = parseFloat(document.querySelector('#valueInvestment').value.replace(/\./g,'').replace(/,/g, '.'));
  const date = document.querySelector('#dateInvestment').value;

// Verificando se os campos estão preenchidos corretamente
// Se estiver correto, cria o investimento 
  if (!name || !type || isNaN(value) || !date) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  } else{
      // Verificando se a data é válida
      // Se a data for inválida, não prossegue com o envio
      const dataResp = verificateDate(date)
      if(!dataResp) {
        return;
      }

      // Verificando se o valor é inválido
      // Se o valor for válido, trata o numero para garantir a precisão

      const valueResp = verificateValue(value);
      if(valueResp <= 0 ) {
        return;
      }

      const investment = {
        nameInvestment: name,
        typeInvestment: type,
        valueInvestment: valueResp, // Valor tratado
        dateInvestment: date
      };

      fetch("http://localhost:3000/investimentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(investment)
      })
      .then(response => {
        if(response.status === 201){
          alert("Investimento criado com sucesso");
          form.reset();
        } else {
          alert("Falha ao criar investimento");
        }
      })
  }
});

// Adicionando o evento de click ao botão de listar investimentos
// Esse botão deve redirecionar para a página de listagem
const btnList = document.querySelector('#btnList');
btnList.addEventListener("click", () => {
  window.location.href = "list.html";
});