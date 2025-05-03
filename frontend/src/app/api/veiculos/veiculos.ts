import type { NextApiRequest, NextApiResponse } from 'next';

type Veiculo = {
  id: number;
  marca: string;
  modelo: string;
  ano: string;
  valor: string;
};

const veiculos: Veiculo[] = [
  {
    id: 1,
    marca: 'Toyota',
    modelo: 'Corolla',
    ano: '2020',
    valor: 'R$ 85.000',
  },
  {
    id: 2,
    marca: 'Honda',
    modelo: 'Civic',
    ano: '2019',
    valor: 'R$ 80.000',
  },
  {
    id: 3,
    marca: 'Ford',
    modelo: 'Ka',
    ano: '2018',
    valor: 'R$ 35.000',
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(veiculos);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
