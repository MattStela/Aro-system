import React, { useState } from "react";
import { db } from "../../../firebase"; // Certifique-se de que o caminho para seu arquivo firebase.js esteja correto
import { collection, addDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { FaChevronDown, FaChevronRight, FaEdit } from "react-icons/fa";

export default function Posts({
  posts,
  displayName, // nome do usuário google
  token, // token jwt
  handleSignOut, // lida com o botão de sair, saindo do usuário logado
  userData, // dados do banco de dados do firebase
  handleRegisterInfo, // registra informações do usuário
  areaCode, // +55 Brasil
  setAreaCode,
  phoneNumber, // numero de telefone cadastrado
  setPhoneNumber,
  pin, // pin cadastrado
  handlePinChange,
  setDisplayName, // Função para definir o apelido (displayName)
}) {
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedPostIds, setExpandedPostIds] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "posts"), {
        title: newTitle,
        content: newContent,
        createdBy: displayName,
        createdAt: Timestamp.fromDate(new Date()), // Usar Timestamp ao invés de new Date()
      });
      setNewTitle("");
      setNewContent("");
      alert("Post adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar post: ", error);
      alert("Erro ao adicionar post. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePostDetails = (postId) => {
    setExpandedPostIds((prevState) =>
      prevState.includes(postId)
        ? prevState.filter((id) => id !== postId)
        : [...prevState, postId]
    );
  };

  const handleEditPost = (post) => {
    setEditingPost(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const postRef = doc(db, "posts", editingPost);
      await updateDoc(postRef, {
        title: editTitle,
        content: editContent,
      });
      setEditingPost(null);
      setEditTitle("");
      setEditContent("");
      alert("Post atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar post: ", error);
      alert("Erro ao atualizar post. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPostDetails = (post) => {
    const isExpanded = expandedPostIds.includes(post.id);
    const canEdit = userData.role === "admaster" || (userData.role === "adm" && post.createdBy === displayName);

    return (
      <div className="p-2" key={post.id}>
        {editingPost === post.id ? (
          <div className="w-full p-4 mb-4">
            <h2 className="text-lg font-bold mb-4">Editar Post</h2>
            <form onSubmit={handleUpdatePost} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Título"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-black w-full h-8 text-sm p-2 border rounded"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Conteúdo"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="text-black w-full text-sm p-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Atualizando..." : "Atualizar Post"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="flex space-x-4 justify-between items-center">
              <h3 className="text-xl font-bold">{post.title}</h3>
              <div className="flex items-center">
                {canEdit && (
                  <button onClick={() => handleEditPost(post)}>
                    <FaEdit className="text-blue-500 mx-2" />
                  </button>
                )}
                <button onClick={() => togglePostDetails(post.id)}>
                  {isExpanded ? (
                    <FaChevronDown className="bg-gray-800" />
                  ) : (
                    <FaChevronRight className="bg-gray-800" />
                  )}
                </button>
              </div>
            </div>
            {isExpanded && (
              <div>
                <p>{post.content}</p>
                <p className="text-sm text-gray-500">Criado por: {post.createdBy}</p>
                {post.createdAt && (
                  <p className="text-sm text-gray-500">
                    Em: {new Date(post.createdAt.seconds * 1000).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="border w-full min-h-screen flex flex-col items-center justify-center">
      {(userData.role === "admaster" || userData.role === "adm") && (
        <>
          <form onSubmit={handleSubmit} className="w-[400px] border space-y-4 p-4 mb-8">
            <h2 className="text-lg font-bold mb-4">Adicionar Novo Post</h2>
            <div>
              <input
                type="text"
                placeholder="Título"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="text-black w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Conteúdo"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="text-black w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Adicionar Post"}
            </button>
          </form>
        </>
      )}

      <h2 className="text-lg font-bold mb-4">Posts</h2>
      {posts.map((post) => renderPostDetails(post))}
    </div>
  );
}
