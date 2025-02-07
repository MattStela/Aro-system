// app/api/updateUserData/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase"; // Certifique-se de que o caminho está correto

export async function POST(request) {
  console.log('Início do processamento da requisição POST');
  const secretKey = process.env.JWT_SECRET_KEY;
  const authHeader = request.headers.get('Authorization');
  console.log('AuthHeader:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Token não fornecido ou inválido');
    return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token:', token);

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log('Token verificado com sucesso:', decoded);

    // Obter os dados do corpo da requisição
    const requestBody = await request.json();
    console.log('Dados do corpo da requisição:', requestBody);

    const { uid, data } = requestBody;
    console.log('UID:', uid);
    console.log('Dados a serem atualizados:', data);

    // Atualizar os dados do usuário no Firestore
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, data, { merge: true });
    console.log('Dados atualizados com sucesso no Firestore');

    return NextResponse.json({ message: 'Dados atualizados com sucesso' });
  } catch (error) {
    console.error('Erro ao verificar ou atualizar os dados:', error);
    return NextResponse.json({ message: 'Erro ao verificar ou atualizar os dados' }, { status: 500 });
  }
}
