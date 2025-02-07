// app/api/generateToken/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ message: 'JWT_SECRET_KEY não está definido' }, { status: 500 });
  }

  const { uid, displayName } = await request.json();

  const payload = { uid, displayName };

  try {
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Erro ao gerar o token JWT:', error);
    return NextResponse.json({ message: 'Erro ao gerar o token JWT' }, { status: 500 });
  }
}
