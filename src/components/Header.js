import React from 'react';

const Header = () => {
  return (
    <header className="bg-black text-yellow-600 p-5">
      <h1 className="text-3xl font-bold">Nome do Motoclub</h1>
      <nav className="mt-4">
        <a href="#" className="text-yellow-700 mr-4">Início</a>
        <a href="#" className="text-gold mr-4">Eventos</a>
        <a href="#" className="text-gold mr-4">Galeria</a>
        <a href="#" className="text-gold mr-4">Contato</a>
      </nav>
    </header>
  );
};

export default Header;
