// app/api/updateUserData/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../../../firebase';

export async function POST(request) {
  const secretKey = process.env.JWT_SECRET_KEY;
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secretKey);

    // Obter os dados do corpo da requisição
    const { uid, data } = await request.json();

    // Atualizar os dados do usuário no Firestore
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, data, { merge: true });

    return NextResponse.json({ message: 'Dados atualizados com sucesso' });
  } catch (error) {
    console.error('Erro ao verificar ou atualizar os dados:', error);
    return NextResponse.json({ message: 'Erro ao verificar ou atualizar os dados' }, { status: 500 });
  }
}
