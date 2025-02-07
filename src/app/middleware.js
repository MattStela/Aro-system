import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Cors from 'cors';

const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export async function middleware(req, res) {
  await runMiddleware(req, res, cors);

  const token = req.cookies.get('jwtToken') || req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    console.log('Token não fornecido. Redirecionando para a página inicial.');
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Token verificado com sucesso. Usuário autenticado.');
    return NextResponse.next();
  } catch (error) {
    console.log('Token inválido ou verificação falhou. Redirecionando para a página inicial.');
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
