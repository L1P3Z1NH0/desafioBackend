const axios = require("axios").default;

const pedidoService = require('./services/pedido.service')

const API_PATH_PIPEDRIVE = "https://kruzer.pipedrive.com/api/v1";
const API_TOKEN_PIPEDRIVE = "519ce9d62044af5ca7eae8b8daa4c01a04ae4459";

const API_PATH_BLING = "https://bling.com.br/Api/v2/";
const API_TOKEN_BLING = "6b9eeb5964d8322a9e617b0eea57d7d63fae0752877d5fcafe70932b69991fdf65fb197d";

const calculateVerificationDigit = (numberSequence) => {
  if (numberSequence.length !== 9) {
    throw new Error("numberSequence must have length 9");
  }

  const numberSequenceParameter = Array.from(numberSequence).reduce(
    (prev, curr, index) => {
      const multiplier = 10 - index;

      return prev + Number(curr) * multiplier;
    },
    0
  );

  const numberSequenceRemainder = numberSequenceParameter % 11;

  return numberSequenceRemainder < 2
    ? String(0)
    : String(11 - numberSequenceRemainder);
};

const generateCPF = () => {
  return Array.from(Array(11).keys())
    .map(() => Math.floor(Math.random() * 10))
    .reduce((prev, curr, index) => {
      if (index < 9) {
        return prev + String(curr);
      }

      if (index === 9) {
        return prev + calculateVerificationDigit(prev);
      }

      return prev + calculateVerificationDigit(prev.slice(1));
    }, "");
};

(async () => {
  try {
    
    const resGetDeals = await axios.get(
      `${API_PATH_PIPEDRIVE}/deals/?api_token=${API_TOKEN_PIPEDRIVE}&status=won`
    );
    const ganhos = resGetDeals.data.data;
    
    let objGanhos = ganhos.map((elemen) => {
      persons = {
        nome: elemen.person_id.name,
        cpf: generateCPF(),
      };

      //   console.log("persons :>> ", persons);
      return persons;
    });

    // console.log("ganhos :>> ", ganhos);
    // console.log('objGanhos :>> ', objGanhos);

    let contatos = objGanhos.map(
        (elemen) => {
      return `
            <?xml version="1.0" encoding="UTF-8"?>
            <contato>
                <nome>${elemen.nome}</nome>
                <tipoPessoa>F</tipoPessoa>
                <cpf_cnpj>${elemen.cpf}</cpf_cnpj>
                <contribuinte>9</contribuinte>
            </contato>`;
    });

    let pedidos = objGanhos.map(
        (elemen) => {
      return `
        <?xml version="1.0" encoding="utf-8" ?>
        <pedidocompra>
            <fornecedor>
                <nome>${elemen.nome}</nome>
                <cpfcnpj>${elemen.cpf}</cpfcnpj>
            </fornecedor>
            <itens>
                <item>
                    <descricao>Livro</descricao>
                    <qtde>2</qtde>
                    <valor>10</valor>
                </item>
            </itens>
        </pedidocompra>
        `;
    });
    
    // const getResPedidoCompra = await axios.get(
    //     `${API_PATH_BLING}/pedidoscompra/json/?apikey=${API_TOKEN_BLING}`
    //   );

    // const pedidoCompras = getResPedidoCompra.data.retorno.pedidoscompra;
    
    // const pedidoDataValor = pedidoCompras.map(
    //     (elemen) =>{      
    //       arrayElement = []
    //         for (let i = 0; i < elemen.length; i++) {
    //           arrayElement.push(elemen[i].pedidocompra.datacompra)
    //         }
    //         return arrayElement
    //     }
    // )

    // console.log('pedidoCompras :>> ', JSON.stringify(pedidoCompras, null, 4) );

    // console.log('pedidoDataValor :>> ', JSON.stringify(pedidoDataValor, null, 4) );

    for (let index = 0; index < objGanhos.length; index++) {
      const resPostContato = await axios.post(`${API_PATH_BLING}/contato/?apikey=${API_TOKEN_BLING}&xml=${contatos[index]}`);
      const resPostPedido = await axios.post(`${API_PATH_BLING}/pedidocompra/?apikey=${API_TOKEN_BLING}&xml=${pedidos[index]}`);
      const pedido = await pedidoService.create(objGanhos[index])
    }

  } catch (error) {
    console.error(error);
  }
})();
