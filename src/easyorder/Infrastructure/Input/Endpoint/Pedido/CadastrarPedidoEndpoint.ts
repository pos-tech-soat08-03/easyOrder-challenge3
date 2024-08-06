
import { Request, Response } from 'express';
import { CadastrarPedidoUsecase } from '../../../../Core/Application/Usecase/Pedidos/CadastrarPedidoUsecase';
import { PedidoRepositoryInterface } from '../../../../Core/Domain/Output/Repository/PedidoRepositoryInterface';

export class CadastrarPedidoEndpoint {

    constructor(
        private pedidoRepository: PedidoRepositoryInterface
    ) {
        this.handle = this.handle.bind(this);
    }

    public async handle(req: Request, res: Response): Promise<void> {
        /**
            #swagger.tags = ['Pedidos']
            #swagger.method = 'post'
            #swagger.summary = 'Cadastrar novo pedido'
            #swagger.description = 'Endpoint para cadastro de novo cliente para posterior identificação em pedidos e uso em campanhas de marketing'
            #swagger.produces = ["application/json"]
            #swagger.parameters['body'] = { 
                in: 'body', 
                '@schema': { 
                    "required": ["clienteId"], 
                    "properties": { 
                        "clienteId": { 
                            "type": "string", 
                            "minLength": 36, 
                            "maxLength": 36,
                            "format": "uuid",
                            "example": "29a81eeb-d16d-4d6c-a86c-e13597667307" 
                        }
                    }
                }
            }
        */
        try {

            const usecase = new CadastrarPedidoUsecase(
                this.pedidoRepository
            );

            if (req.body === undefined || Object.keys(req.body).length === 0) {
                throw new Error('Nenhum dado enviado.');
            }

            const clienteId: string = req.body.clienteId;

            const result = await usecase.execute(clienteId);

            if (!result.getSucessoExecucao()) {
                throw new Error(result.getMensagem());
            }

            /**
            #swagger.responses[200] = {
                'description': 'Pedido cadastrado com sucesso2',
                '@schema': {
                    'properties': {
                        mensagem: {
                            type: 'string',
                            example: 'Pedido cadastrado com sucesso3'
                        },
                        pedido: {
                            $ref: '#/definitions/PedidoResponse'
                        }
                    }
                }
            }
            */
            res.json({
                mensagem: result.getMensagem(),
                pedido: result.getPedido() ? {
                    id: result.getPedido()?.getId(),
                    data: result.getPedido()?.getDataPedido(),
                    clienteId: result.getPedido()?.getClienteId(),
                    status: result.getPedido()?.getStatusPedido().getValue(),
                    pagamentoStatus: result.getPedido()?.getStatusPagamento(),
                } : null
            });

        } catch (error: any) {
            /**
            #swagger.responses[400] = {
                'description': 'Ocorreu um erro inesperado',
                '@schema': {
                    'properties': {
                        mensagem: {
                            type: 'string',
                            example: 'Ocorreu um erro inesperado: Pedido não encontrado'
                        }
                    }
                }
            }
            */
            res.status(400).json({
                mensagem: 'Ocorreu um erro inesperado: ' + error.message,
            });
        }

        return;

    }

}
