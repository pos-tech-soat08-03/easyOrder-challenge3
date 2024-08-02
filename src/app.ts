import express from 'express';
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger-output.json";
import { CadastrarClienteEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Clientes/CadastrarClienteEndpoint';
import { ListarClientesEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Clientes/ListarClientesEndpoint';
import { BuscarClienteEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Clientes/BuscarClienteEndpoint';
import { RemoverProdutoEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Produto/RemoverProdutoEndpoint';
import { CadastrarPedidoEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Pedido/CadastrarPedidoEndpoint';
import { CancelarPedidoEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Pedido/CancelarPedidoEndpoint';
import { ListarPedidosPorStatusEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Pedido/ListarPedidosPorStatusEndpoint';
import { ClienteRepositoryMock } from './easyorder/Infrastructure/Output/Repository/ClienteRepositoryMock';
import { RemoverProdutoRepositoryMock } from './easyorder/Infrastructure/Output/Repository/RemoverProdutoRepositoryMock';
import { PedidoRepositoryMock } from './easyorder/Infrastructure/Output/Repository/PedidoRepositoryMock';
import { PedidoRepositoryMySQL } from './easyorder/Infrastructure/Output/Repository/PedidoRepositoryMySQL';
import { ClienteRepositoryMySQL } from './easyorder/Infrastructure/Output/Repository/ClienteRepositoryMySQL';
import { CategoriaRepositoryMock } from './easyorder/Infrastructure/Output/Repository/CategoriaRepositoryMock';
import { ListaCategoriasEndpoint } from './easyorder/Infrastructure/Input/Endpoint/Produto/ListarCategoriasEndpoint';




console.log('Iniciando aplicação...', process.env);

// const clienteRepository = new ClienteRepositoryMock();
const clienteRepository = new ClienteRepositoryMySQL(
  process.env.DATABASE_HOST || 'ERROR',
  Number(process.env.DATABASE_PORT || '0'),
  process.env.DATABASE_NAME || 'ERROR',
  process.env.DATABASE_USER || 'ERROR',
  process.env.DATABASE_PASS || 'ERROR'
);
const produtoRepository = new RemoverProdutoRepositoryMock();
// const pedidoRepository = new PedidoRepositoryMock();
const pedidoRepository = new PedidoRepositoryMySQL(
  process.env.DATABASE_HOST || 'ERROR',
  Number(process.env.DATABASE_PORT || '0'),
  process.env.DATABASE_NAME || 'ERROR',
  process.env.DATABASE_USER || 'ERROR',
  process.env.DATABASE_PASS || 'ERROR'
);

// Instanciar o mock e o use case para categorias
const categoriaRepositoryMock = new CategoriaRepositoryMock();
const listaCategoriasEndpoint = new ListaCategoriasEndpoint(categoriaRepositoryMock);

const app = express();
const port = Number(process.env.SERVER_PORT || '3000');

app.use(express.json());

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.get('/', (req, res) => {
  res.send('Tudo ok por aqui. Pode seguir viajem!');
});

app.get('/health', (req, res) => {
  res.json({
    status: 'UP'
  });
});

app.post('/cliente/cadastrar', new CadastrarClienteEndpoint(clienteRepository).handle);

app.get('/cliente/listar', new ListarClientesEndpoint(clienteRepository).handle);
app.get('/cliente/buscar', new BuscarClienteEndpoint(clienteRepository).handle);

app.delete('/produto/remover', new RemoverProdutoEndpoint(produtoRepository).handle);

app.post('/pedido/cadastrar', new CadastrarPedidoEndpoint(pedidoRepository).handle);

app.post('/pedido/cancelar/:pedidoId', new CancelarPedidoEndpoint(pedidoRepository).handle);

app.get('/pedido/listar/:statusPedido', new ListarPedidosPorStatusEndpoint(pedidoRepository).handle);

app.get('/categoria/listar', new ListaCategoriasEndpoint(categoriaRepositoryMock).handle);
app.get('/categoria/listar', listaCategoriasEndpoint.handle);


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});