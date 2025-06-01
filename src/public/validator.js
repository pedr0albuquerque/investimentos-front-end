// Validator deve fazer as verificações de data e valor do investimento
// Utilizando as bibliotecas dayjs e currency.js
// Instaladas via cdn no index.html

// Função para verificar se a data do investimento é válida
function verificateDate(date){

  // Convertendo a data para um objeto dayjs
  const objDayjs = dayjs(date);
  const difference = dayjs().diff(objDayjs, 'hour');

  // Se diferenca for entre a data atual e a data do investimento for negativa, significa que a data é no futuro
  if(difference < 0) {
    alert("A data do investimento não pode ser no futuro.");
    return false;
  } else{
    return true;
  }
}

// Função para verificar se o valor do investimento é maior que zero
// Tratar o dado para garantir a precisão do valor
function verificateValue(value) {
  // Verifica se o valor é um número e se é maior que zero
  if (value <= 0) {
    alert("O valor do investimento deve ser um número maior que zero.");
    return 0;
  }else{
    const valueFormatted = currency(value, {
        precision: 2
    });

    console.log(valueFormatted.value);
    return valueFormatted.value;
  }
}

export { verificateDate, verificateValue };