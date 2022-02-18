//metas de cada mes, onde qtd é o necessário para bate-la
const metas = [
  { mes: 1, qtd: 5 },
  { mes: 2, qtd: 3 },
  { mes: 3, qtd: 2 },
  { mes: 4, qtd: 2 },
  { mes: 5, qtd: 5 },
  { mes: 6, qtd: 60 },
  { mes: 8, qtd: 2 },
  { mes: 9, qtd: 4 },
  { mes: 10, qtd: 4 },
  { mes: 11, qtd: 7 },
  { mes: 12, qtd: 2 },
];

function calculaComissaoController(req, res) {
  //Verifica se os pedidos existem no body da requisição
  if (!req.body.pedidos) {
    return res.status(400).send("Pedidos não informados");
  }
  //pega apenas o array de pedidos do body da requisição
  const pedidos = req.body.pedidos;

  //Declara o objeto vendedores onde as informações serão organizadas
  let vendedores = {};
  //Declara o array de retorno
  let comissoes = new Array();

  //Montagem do objeto de vendedores
  pedidos.forEach(function (pedido) {
    //Caso o vendedor ainda não exista no objeto de vendedores ele é declarado
    if (!vendedores[pedido.vendedor]) vendedores[pedido.vendedor] = {};

    //Pega apenas mes e ano da string de data
    const mesAno = pedido.data.slice(0, 7);
    //caso aquele mesAno ainda não exista dentro do vendedor ele é declarado como array
    if (!vendedores[pedido.vendedor][mesAno])
      vendedores[pedido.vendedor][mesAno] = new Array();

    //Insere no final do array de cada mês dentro de cada vendedor o valor das vendas daquele mês
    vendedores[pedido.vendedor][mesAno].push(pedido.valor);
  });

  //Calculo das comissões para cada vendedor
  Object.getOwnPropertyNames(vendedores).forEach(function (vendedor) {
    //Para cada mês
    Object.getOwnPropertyNames(vendedores[vendedor]).forEach(function (data) {
      //Inicializa a comissao com
      let comissao = 0;
      //Pega apenas o mês para o calculo da meta mensal
      const mesSemAno = parseInt(data.slice(-2));

      //Calcula valor da comissão de cada venda e da meta mensal
      vendedores[vendedor][data].forEach(function (valor, index, array) {
        //1% para vendas até 300 reais
        if (valor < 300) comissao += valor * (1 / 100);
        //3% para vendas entre 300 e 1000 reais
        else if (valor >= 300 && valor < 1000) comissao += valor * (3 / 100);
        //5% para vendas acima de 1000 reais
        else comissao += valor * (5 / 100);

        //Calcula valor da meta mensal (executa apenas na primeira iteração do foreach)
        if (index <= 0 && array.length >= metas[mesSemAno].qtd) {
          //Soma o valor total das vendas no mês
          let totalMes = array.reduce((a, b) => a + b);
          //Calcula 3% em cima do total do mes e adiciona ao valor da comissão
          comissao += totalMes * (3 / 100);
        }
      });

      //Adiona no array de comissões as comissões de cada vendedor para cada mês
      /*
        Optei por mostrar o mês como "yyyy-mm" para que meses iguais
        porém de anos diferentes não sejam confundidos
      */
      comissoes.push({
        vendedor: vendedor,
        mes: data,
        valor: comissao,
      });
    });
  });

  //Envia a resposta com status 200 de "OK" e o array de comissões
  res.status(200).send({ comissoes });
}

module.exports = { calculaComissaoController };
